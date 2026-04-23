---
title: 'Drizzle with Cloudflare D1 — the everyday usage guide'
date: "2025-02-02"
updated: "2026-04-22"
description: The read, write, and soft-delete patterns I reach for every day when working against Cloudflare D1 through Drizzle — dynamic filters, joins, RETURNING, audit fields, and the sql template. Worked examples from DuitGee.
categories:
  - cloudflare D1
  - drizzle
  - hono
  - sveltekit
  - duitgee
author: Me
published: true
featured: true
appCta: duitgee
series: hono-drizzle-cloudflare-d1-practical-recipes
order: 20
---

This is the middle post in a three-part D1 lineage. [Setting up D1 with Drizzle in Hono](/posts/setup-d1-cloudflare-worker-with-drizzle) covers wiring everything up; [D1 has no transactions — using client.batch()](/posts/d1-has-no-transactions-use-client-batch) covers the atomic multi-write case. This one sits between them: the patterns I actually use every day against D1 through Drizzle while building [DuitGee](https://duitgee.com).

Every example here comes from a handler that's running in production. Names and types are the real ones — `funds`, `expenses`, `fundTransactions` — not `foo` / `bar`.

## The setup you can assume

Every handler starts the same way:

```ts
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '$lib/server/db/schema';

const client = drizzle(env.DB, { schema });
```

`env.DB` is the D1 binding from `wrangler.jsonc`. Passing `{ schema }` is what enables typed results — `client.select().from(funds)` returns `Fund[]` with no casting. That's the setup the rest of this post assumes.

## Reading

Four shapes cover about 95% of the read code I write.

### By id, scoped, with soft-delete filter

Rarely just `where(eq(funds.id, id))`. In a multi-tenant app every read has to respect two things: the tenant scope (the row belongs to the caller's vault) and the soft-delete flag (`deletedAt IS NULL`). The pattern:

```ts file=src/lib/server/api/funds/updateFundHandler.ts
const [existing] = await client
    .select({ id: funds.id })
    .from(funds)
    .where(and(
        eq(funds.id, data.id),
        eq(funds.vaultId, data.vaultId),
        isNull(funds.deletedAt),
    ))
    .limit(1);

if (!existing) throw new Error('Fund not found');
```

Three things worth noting:

- **`select({ id: funds.id })`** instead of `select()`. If I only need the id to check existence, I only fetch the id. D1 is billed by rows read, so narrowing the projection isn't just hygiene.
- **`and(eq(...), eq(...), isNull(...))`** is the bread-and-butter predicate shape. Drizzle's `and` accepts a variadic list.
- **`.limit(1)`** paired with `[existing] = ...` — the destructure gives you the single row or `undefined`. Don't reach for `.get()` here; the destructure form is clearer.

### Filtered list with dynamic where

Listing endpoints usually take optional filters — "expenses between these dates, optionally filtered by fund". The pattern is to build up a `whereClause` progressively:

```ts file=src/lib/server/api/expenses/getExpensesHandler.ts
let whereClause = and(
    eq(expenses.vaultId, vaultId),
    isNull(expenses.deletedAt),
);

if (startDate && endDate) {
    whereClause = and(
        whereClause,
        sql`${expenses.date} >= ${startDate}`,
        sql`${expenses.date} <= ${endDate}`,
    );
}

if (fundId) {
    whereClause = and(whereClause, eq(expenses.fundId, fundId));
}

const rows = await client
    .select()
    .from(expenses)
    .where(whereClause)
    .orderBy(desc(expenses.date))
    .limit(limit)
    .offset(offset);
```

`and(...)` returns `SQL | undefined`, so TypeScript will let you reassign it to itself. The flow reads top-to-bottom: start with the always-true filters, compose optional ones on, pass the whole thing to `.where()`.

For pagination, I run a separate count query against the same `whereClause`:

```ts
const totalCount = await client
    .select({ count: sql`count(*)` })
    .from(expenses)
    .where(whereClause);
```

Two round trips. D1 doesn't have window functions that would let you get the count in the same query cheaply, and at SaaS row counts it's not worth optimising further.

### Joins, projected

Left-join when the related row is optional, inner-join when the relationship is required. Pick the fields you want; don't `select *` through a join:

```ts file=src/lib/server/api/funds/getFundsHandler.ts
const rows = await client
    .select({
        fund: funds,
        activeCycle: fundCycles,
        policy: fundPolicies,
    })
    .from(funds)
    .leftJoin(
        fundCycles,
        and(eq(fundCycles.fundId, funds.id), eq(fundCycles.status, 'active')),
    )
    .leftJoin(fundPolicies, eq(fundPolicies.fundId, funds.id))
    .where(and(eq(funds.vaultId, vaultId), isNull(funds.deletedAt)))
    .orderBy(funds.createdAt);
```

The three top-level keys in `select()` — `fund`, `activeCycle`, `policy` — become the shape of each row. `rows[0].fund.name`, `rows[0].activeCycle?.periodStart`. The optional chaining is real — left-joined rows can be `null`.

Two things I didn't know until they bit me:

- **Join conditions can be compound.** The `fundCycles` join isn't "any cycle for this fund" — it's "the *active* cycle for this fund". Put that predicate in the `ON` clause with `and(...)`, not in the outer `where`. If you move it to `where`, you turn the left-join into a logical inner-join (a null `fundCycles.status` fails the equality check) and funds without an active cycle vanish from the result.
- **Multiple left-joins multiply rows.** If a fund has 3 policies and 2 active cycles, you get 6 rows for that fund. For one-to-at-most-one relationships like mine it's fine; for one-to-many on both sides it isn't.

### Aggregates with the `sql` template

D1 doesn't (yet) expose every Drizzle aggregate helper, and real queries sometimes need casts. Fall back to the `sql` template:

```ts
const deductions = await client
    .select({
        cycleId: fundTransactions.cycleId,
        total: sql<number>`cast(sum(${fundTransactions.amount}) as real)`,
    })
    .from(fundTransactions)
    .where(and(
        inArray(fundTransactions.cycleId, activeCycleIds),
        eq(fundTransactions.type, 'deduction'),
    ))
    .groupBy(fundTransactions.cycleId);
```

Two things worth calling out:

- **`sql<number>`** is the return-type annotation — Drizzle can't know what your raw SQL produces, so you tell it. Without the annotation, `total` comes back as `unknown`.
- **`cast(... as real)`** because SQLite's `sum()` returns integer when all inputs are integer, which silently truncates if you later divide. Casting to `real` forces a float path in the query.

`inArray` is the correct primitive for `WHERE x IN (...)` — don't build the list by string-concatenating, and don't call `eq` in a loop.

## Writing

### Insert with `RETURNING`

D1 supports `RETURNING` on single-statement writes, and Drizzle exposes it. I almost always use it — one round trip, get the inserted row back with its generated id:

```ts file=src/lib/server/api/funds/createFundHandler.ts
const [fund] = await client
    .insert(funds)
    .values({
        vaultId: data.vaultId,
        name: data.name,
        balance: 0,
        status: 'active',
        ...auditFields,
    })
    .returning();
```

Two notes on `RETURNING`:

- **Single-statement writes** (`insert().returning()`, `update().returning()`, `delete().returning()`) are reliable.
- **Inside a `client.batch([...])`** — don't rely on chaining results across statements. The batch post goes into why; the short version is "pre-generate IDs client-side and feed them into the batch".

### Dynamic update payload

Update handlers usually accept a partial body — only update the fields the caller sent. Build the `set` object progressively:

```ts file=src/lib/server/api/funds/updateFundHandler.ts
const updates: Record<string, unknown> = {
    ...updateAuditFields({ userId: session.user.id }),
};
if (data.name !== undefined) updates.name = data.name;
if (data.description !== undefined) updates.description = data.description;
if (data.color !== undefined) updates.color = data.color;

const [updated] = await client
    .update(funds)
    .set(updates)
    .where(eq(funds.id, data.id))
    .returning();
```

The `!== undefined` check is deliberate — `null` and `''` are both legitimate values the caller might want to store; `undefined` is "don't touch this field". Don't use truthy checks; they'll eat explicit null-outs.

### Soft delete is just an update

DuitGee never deletes rows in the business-data tables. "Delete an expense" means "set `deletedAt = now` and the caller as `deletedBy`", and every query everywhere filters `isNull(x.deletedAt)`:

```ts file=src/lib/server/api/expenses/deleteExpenseHandler.ts
const [deletedExpense] = await client
    .update(expenses)
    .set(deleteAuditFields({ userId }))
    .where(eq(expenses.id, id))
    .returning();
```

`deleteAuditFields` is a tiny helper — it returns `{ deletedAt: new Date().toISOString(), deletedBy: userId, updatedAt: ..., updatedBy: ... }`. Every handler uses the same helper so no one accidentally forgets to stamp `updatedAt` on a soft-delete.

Two reasons this beats `DELETE`:

- **Audit trail for free.** "Who deleted this and when" is in the row forever.
- **Cascading reversibility.** If a user says "I didn't mean to delete that", flipping `deletedAt` back to null restores the row and all its relationships. A real `DELETE` with FK cascades is one-way.

The cost is every read has to remember `isNull(x.deletedAt)`. A few weeks in, it's muscle memory.

## The `sql` template — rule of thumb

You'll notice `sql\`...\`` used above for date comparisons, aggregates, and casts. The rule I've converged on:

**Use the `sql` template any time you want the database to evaluate something at execution time.**

The clearest example comes from the [batch post](/posts/d1-has-no-transactions-use-client-batch): when updating a balance, you don't want to write the computed value back from JavaScript — the value you read might already be stale. Instead, you want SQLite to read-and-modify the current row:

```ts
// WRONG — writes a stale, client-side-computed value
.set({ balance: fromFund.balance - data.amount })

// RIGHT — emits `SET balance = balance - ?`, evaluated server-side
.set({ balance: sql`${funds.balance} - ${data.amount}` })
```

Same mental model for `count(*)`, `now()`, conditional aggregates, `jsonb_*` functions if you ever leave SQLite — if the DB should do the work at execution time, use the template.

## Audit fields, packaged once

Every table in DuitGee carries six audit columns:

```ts
createdAt: text,  createdBy: text,
updatedAt: text,  updatedBy: text,
deletedAt: text,  deletedBy: text,
```

…and three tiny helpers to populate them correctly:

```ts
// pseudo-signatures
initialAuditFields({ userId })  // → { createdAt, createdBy, updatedAt, updatedBy }
updateAuditFields({ userId })   // → { updatedAt, updatedBy }
deleteAuditFields({ userId })   // → { deletedAt, deletedBy, updatedAt, updatedBy }
```

They get spread into writes:

```ts
await client.insert(funds).values({ ...data, ...auditFields });
```

Boring, but the payoff is consistency. Every table, every handler, one helper — you don't have a single place where `updatedBy` silently got missed because the author was in a hurry.

## Runtime validation with drizzle-valibot

Occasionally you need to validate a shape at the edge of a handler — especially when a row is coming back from a join and you want to strip the joined fields before returning it. `drizzle-valibot` lets you derive a Valibot schema straight from the table:

```ts
import { createSelectSchema } from 'drizzle-valibot';
import { parse } from 'valibot';

const parsed = parse(createSelectSchema(expenses), row);
```

No separate schema to maintain — `createSelectSchema(expenses)` is always in sync with the Drizzle table. The Zod analogue (`createSelectSchema` from `drizzle-zod`) works the same way if you're on that stack.

## What's next

Two things this post deliberately skips:

- **Multi-step atomic writes.** D1 doesn't support `BEGIN TRANSACTION`, and naive "await insert, await insert, await update" is a corruption waiting to happen. The answer is `client.batch([...])`, and it has four gotchas that are worth writing down on their own — [that's the next post](/posts/d1-has-no-transactions-use-client-batch).
- **Drizzle's relational query API** (`client.query.funds.findFirst({ with: { policies: true } })`). It's nice, but I haven't needed it — the joined-select form above is predictable and generates the SQL I'd write by hand. If you prefer the relational shape, [the Drizzle docs](https://orm.drizzle.team/docs/rqb) cover it.

Everything in this post is the "day three" layer on top of the setup guide: now you can actually ship features. The next post is what you hit the first time one of those features needs to update five rows without tearing.
