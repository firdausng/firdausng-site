---
title: 'Migrate a Cloudflare D1 database to another account'
date: "2025-10-15"
updated: "2026-04-22"
description: Exporting a D1 database with wrangler and replaying it on a different Cloudflare account — plus the foreign-key ordering error that always trips people up on first try.
categories:
  - cloudflare D1
  - cloudflare workers
author: Me
published: true
featured: true
---
Moving a Cloudflare D1 database to another Cloudflare account is two `wrangler` commands — but the second one almost always fails on the first try, for a reason that isn't obvious.

## When you'd do this

Three situations come up:

- **Account split** — splitting a shared Cloudflare account into per-project ones (often when a side project graduates to a company account, or vice versa).
- **Staging clone** — copying production's shape and a snapshot of data into a staging database on the same or a different account.
- **Organisation change** — moving a project's infrastructure under a different billing entity without recreating the schema by hand.

Cloudflare has no built-in "transfer this D1 database" button. The path is: export to SQL, create the empty database on the destination, replay the SQL.

## The two commands

From the account that owns the source database:

```shell
npx wrangler d1 export <database_name> --remote --output=./database.sql
```

Then authenticate as the destination account (log out and log in again with `wrangler logout` / `wrangler login`, or use a different `CLOUDFLARE_API_TOKEN`), create the new D1 database (`npx wrangler d1 create <new_database_name>`), and replay:

```shell
npx wrangler d1 execute <new_database_name> --remote --file=./database.sql
```

That's the happy path. It usually isn't.

## The foreign-key ordering error

On the second command you'll often see something like:

```
no such table: main.user: SQLITE_ERROR
```

…even though the export ran cleanly and `user` is clearly in the file.

**Why it happens.** `wrangler d1 export` writes tables in the order SQLite returns them from `sqlite_schema`, which is creation order — not dependency order. If you ever ran a migration that created `user_role` (with a foreign key to `user`) before creating `user` itself, the export preserves that ordering. On replay, the `CREATE TABLE user_role` statement runs first, references a `user` table that doesn't exist yet, and aborts the whole batch.

**How to fix.** Open `database.sql` in an editor and move the `CREATE TABLE user` statement above the `CREATE TABLE user_role` statement. More generally: parent tables before child tables, for every FK relationship in the file. Once the schema statements are correctly ordered, the `INSERT` statements below them are safe — row inserts don't need the same reshuffling because FK checks usually permit referenced rows to appear in the same transaction.

If you have more than two or three FK chains, it's faster to dump schema and data separately, hand-order the schema file, and replay in two passes:

```shell
npx wrangler d1 export <database_name> --remote --no-data --output=./schema.sql
npx wrangler d1 export <database_name> --remote --no-schema --output=./data.sql
# hand-edit schema.sql, then:
npx wrangler d1 execute <new_database_name> --remote --file=./schema.sql
npx wrangler d1 execute <new_database_name> --remote --file=./data.sql
```

## Things that don't make the trip

- **Database ID changes.** The new D1 has a new `database_id`. Update your `wrangler.jsonc` (or `wrangler.toml`) on the destination account to match — the old ID only exists on the old account.
- **Migration history.** D1 tracks applied migrations in a `d1_migrations` table. After replay the new database "knows" the same migrations were applied (because that table is in the dump), but if you ran any migrations on the source after the export, you'll need to run them against the new database separately.
- **Insert performance.** `wrangler d1 execute --file=` replays statements one at a time over HTTP. For a 50k-row database expect several minutes; for a 500k-row database expect closer to an hour. The command is resumable if you split the file — use the `--no-data` / `--no-schema` split above and then chunk `data.sql` if needed.

## Verify before you delete

Before deleting the source database, run a few sanity queries against the new one:

```shell
npx wrangler d1 execute <new_database_name> --remote --command "SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name"
npx wrangler d1 execute <new_database_name> --remote --command "SELECT COUNT(*) FROM user"
```

Table list matches, row counts match — then you're done.

## References

- [Cloudflare D1 — import and export data](https://developers.cloudflare.com/d1/best-practices/import-export-data/)
