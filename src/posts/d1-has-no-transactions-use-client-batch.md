---
title: 'D1 has no transactions — using client.batch() for multi-step writes'
date: "2026-04-19"
description: Cloudflare D1 has no BEGIN/COMMIT. The official answer is client.batch(), but it has four subtle rules worth writing down. Worked example from DuitGee's fund-transfer handler. 🚀
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
---

While building [DuitGee](https://duitgee.com), a fund-based expense tracker, I hit the first real Cloudflare D1 gotcha: transferring money between two funds is three inserts plus two balance updates that must land atomically — but D1 doesn't support `BEGIN TRANSACTION`. The official answer is `client.batch([...])`, and it has enough subtle rules that they deserve being written down in one place.

This builds on two earlier posts — [Setting up D1 with Drizzle in Hono](/posts/setup-d1-cloudflare-worker-with-drizzle) and [D1 with Drizzle — usage guide](/posts/d1-cloudflare-with-drizzle) — so skim those first if the baseline setup is unfamiliar.

## Background

DuitGee models money like a small ledger: **vaults** own **funds**, funds have rolling **cycles**, and every movement is an immutable **fund transaction**. A fund transfer moves balance from one fund to another inside the same vault, and a single transfer touches **five rows**:

1. A `fund_transfers` record — the first-class "this transfer happened" entity.
2. A `fund_transactions` row on the source fund with `type = 'transfer_out'`.
3. A `fund_transactions` row on the destination fund with `type = 'transfer_in'`.
4. A balance decrement on the source fund's cached balance.
5. A balance increment on the destination fund's cached balance.

If any of those five writes lands without the others, the ledger is corrupt — balances and transactions drift. It has to be all-or-nothing.

## The gap — D1 has no transactions

Drizzle exposes `client.transaction(tx => ...)` for Postgres, LibSQL, and local SQLite. Call it against D1 and it throws — transactions aren't exposed through D1's HTTP API. Cloudflare's [documented answer](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch) is `client.batch([...])`: a list of prepared statements that execute atomically in a single round trip. If any statement fails, the whole batch is rolled back; if they all succeed, the writes are committed together.

That's the happy path. The rest of this post is the stuff the docs don't quite tell you.

## The solution

Here's the transfer handler, trimmed to the essential shape. Permission checks and audit plumbing are stripped out so the batch is easier to read.

### Read and validate — always *before* the batch

```ts file=src/lib/server/api/funds/transferFundsHandler.ts
const client = drizzle(env.DB, { schema });

// 1. Fetch both funds — the batch can't branch on "does this row exist?"
const [fromFund] = await client
    .select()
    .from(funds)
    .where(and(eq(funds.id, data.fromFundId), isNull(funds.deletedAt)))
    .limit(1);

if (!fromFund) throw new Error('Source fund not found');
if (fromFund.balance < data.amount) {
    throw new Error(`Insufficient balance. Available: ${fromFund.balance}`);
}

const [toFund] = await client
    .select()
    .from(funds)
    .where(and(eq(funds.id, data.toFundId), isNull(funds.deletedAt)))
    .limit(1);

if (!toFund) throw new Error('Destination fund not found');

// 2. Pre-generate every ID the batch will insert. The batch can't
//    use RETURNING reliably, so FKs between rows must be known upfront.
const transferId = createId();
const outTxId = createId();
const inTxId = createId();
```

Three things are happening here and none of them are incidental:

- **Reads come first**, outside the batch. The batch only takes statement objects — there's no callback, no `if` branch inside it. Anything you need to decide on must be decided before the batch starts executing.
- **Validation throws early** with a useful message. By the time the batch runs, the caller already knows the inputs are good.
- **IDs are generated client-side** with `createId()` (cuid2, but `crypto.randomUUID()` works just as well). We'll use them as both primary keys and cross-row foreign keys inside the batch.

### The batch itself

```ts file=src/lib/server/api/funds/transferFundsHandler.ts
await client.batch([
    // 1. The transfer record — both sides reference this id
    client.insert(fundTransfers).values({
        id: transferId,
        vaultId: data.vaultId,
        fromFundId: fromFund.id,
        toFundId: toFund.id,
        amount: data.amount,
        transferredAt: now,
    }),

    // 2. transfer_out on the source fund
    client.insert(fundTransactions).values({
        id: outTxId,
        fundId: fromFund.id,
        type: 'transfer_out',
        amount: data.amount,
        fundTransferId: transferId,    // FK resolves — we generated transferId above
    }),

    // 3. transfer_in on the destination fund
    client.insert(fundTransactions).values({
        id: inTxId,
        fundId: toFund.id,
        type: 'transfer_in',
        amount: data.amount,
        fundTransferId: transferId,
    }),

    // 4. Decrement source balance — SQL expression, not client-side math
    client
        .update(funds)
        .set({ balance: sql`${funds.balance} - ${data.amount}` })
        .where(eq(funds.id, fromFund.id)),

    // 5. Increment destination balance — same pattern
    client
        .update(funds)
        .set({ balance: sql`${funds.balance} + ${data.amount}` })
        .where(eq(funds.id, toFund.id)),
]);
```

Five statements, one round trip, all-or-nothing. If any of them fails — a constraint violation, an unreachable FK, a type error — D1 rolls back the entire batch. You either end up with all five rows in their correct state, or none of them.

## Four gotchas worth writing down

### 1. Reads must happen *outside* the batch

The batch takes an array of Drizzle statement objects. It does not take a function body, and it does not let you insert an `if` in the middle.

That means every decision — "does this fund exist?", "is there enough balance?", "is this cycle active or do we need to roll one over?" — has to happen in the read phase before the batch is constructed. You resolve everything you need, throw any domain errors, then hand the batch a set of writes that are already validated.

It feels restrictive at first. In practice it enforces a useful discipline: handlers end up with a clean **read → validate → write** shape that's easy to reason about and easy to test.

### 2. Pre-generate IDs client-side

D1's batch doesn't guarantee that `RETURNING` clauses come back in a usable order. You can't reliably say "insert row A, read its generated id from the result, then use that id in row B's foreign key" — the batch executes all statements together and returns results, but relying on them to chain is fragile.

Solution: generate your IDs before the batch runs.

```ts
const transferId = createId();
const outTxId = createId();
const inTxId = createId();
```

Now every statement in the batch has every ID it needs. The `fund_transactions` rows can reference `fundTransferId: transferId` because `transferId` is just a local variable we controlled. No RETURNING required.

The side benefit: your code becomes easier to log, test, and trace. You can log the transferId before the batch runs, so if the batch fails, you know exactly which intended record didn't land.

### 3. Balance deltas belong in SQL, not in JavaScript

The most subtle bug in this shape is the balance update. It's tempting to write:

```ts
// WRONG — race waiting to happen
client
    .update(funds)
    .set({ balance: fromFund.balance - data.amount })
    .where(eq(funds.id, fromFund.id))
```

`fromFund.balance` was read during the validation phase. Between then and the batch executing — even if it's only milliseconds — something else might have mutated the balance. Now you're writing back a stale, computed value, and you've silently clobbered concurrent activity.

The fix is to let SQLite do the arithmetic inside the batch:

```ts
// RIGHT — the DB reads the current value and applies the delta atomically
client
    .update(funds)
    .set({ balance: sql`${funds.balance} - ${data.amount}` })
    .where(eq(funds.id, fromFund.id))
```

This emits `UPDATE funds SET balance = balance - ? WHERE id = ?`. The read-modify-write happens server-side inside the same batch, so it's atomic with the inserts. The rule: **never do arithmetic against a value you fetched in the read phase; always express it as SQL.**

### 4. What `batch()` deliberately does not do

- **No mid-batch conditionals.** You can't say "insert A, then *if* A didn't violate a constraint, insert B". The batch decides upfront and runs.
- **No custom rollback handlers.** Rollback is automatic on any statement error. You don't get to choose what "partial failure" means.
- **No `tx.rollback()`.** Drizzle's transaction-style rollback helper isn't available — nothing to roll back to.
- **No cross-batch atomicity.** Two separate `batch()` calls are two separate transactions. If the second one fails, the first one's writes are already committed. If you need three-way atomicity, all three writes go in one batch.

## The shape every multi-write handler ends up with

Once you've written a few of these, a pattern emerges:

1. Permission and entitlement checks.
2. Reads — the specific rows you need for validation and for computing any derived writes.
3. Domain validation — throw early with good error messages.
4. Client-side ID generation for everything the batch will insert.
5. `client.batch([...])` with only writes, no reads, using `sql\`...\`` expressions for any arithmetic.
6. Return a derived response object — don't re-query to reconstruct the new state; compute it from what you already know.

Every multi-step write handler in DuitGee follows this shape. It's boring, and that's the point.

## The anti-pattern

The trap to avoid is this:

```ts
// Don't do this — two separate round trips, not atomic
await client.insert(fundTransfers).values({ ... });
await client.insert(fundTransactions).values({ ... });
await client.update(funds).set({ ... }).where(...);
```

It looks fine. It works in happy-path testing. Then one day the Worker times out between the second insert and the update, or a constraint elsewhere rejects the third statement, and now the `fund_transfers` row exists without the balance change — a corrupt ledger. The batch is what prevents that. Use it whenever "these writes must land together" is a requirement.

## When batch isn't enough

If your operation has more than roughly 25 statements, or it truly needs mid-operation branching (e.g. "try strategy A; if it hits a uniqueness error, try strategy B"), `batch()` starts creaking. At that scale, a few alternatives are worth considering:

- **Break the operation into idempotent steps with explicit state.** DuitGee does this for reimbursements — `pending_reimbursement` transactions exist with `amount = 0`, and a separate settlement action converts them later. Each step is small and retriable.
- **Compensating actions.** Write step A, then if step B fails, write a reversal of A. This is how the expense-delete flow undoes its fund-transaction side effects.
- **Durable Objects or Cloudflare Workflows** for true cross-step orchestration. Out of scope for this post, but signposting them as the answer when the pattern stops fitting.

---

That's the shape of every multi-write handler in DuitGee. `batch()` isn't as expressive as a real transaction — no mid-operation branching, no RETURNING you can chain on, no custom rollback — but it's atomic, it's fast, and it forces a discipline that actually makes the code easier to follow once you're used to it.
