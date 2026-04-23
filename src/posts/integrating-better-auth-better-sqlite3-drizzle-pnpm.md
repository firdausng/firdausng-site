---
title: 'Better Auth + better-sqlite3 under pnpm — "Could not locate the bindings file"'
date: "2025-10-08"
updated: "2026-04-22"
description: Running Better Auth's schema generator under pnpm throws "Could not locate the bindings file" because pnpm's strict isolation skips native module builds by default. Here's why, and the one-line fix.
categories:
  - better auth
  - better sqlite3
  - drizzle
  - pnpm
author: Me
published: true
featured: true
---

Wiring up [Better Auth](https://better-auth.com) in a Cloudflare Workers project uses `better-sqlite3` locally as a throwaway generator database — you run `@better-auth/cli generate` against a SQLite file, and it emits the Drizzle schema you check into version control. Production then uses D1, not better-sqlite3.

Under pnpm that generator step often errors out on first run:

```
Error: Could not locate the bindings file.
```

It looks like a missing file, but the real problem is that the file was never built.

## Why this happens

`better-sqlite3` is a native Node addon — when you install it, npm normally runs `node-gyp` to compile a `better_sqlite3.node` binary against your local Node version's headers. That compiled binary is what `require('bindings')(...)` ends up loading at runtime.

pnpm changed this default. Since pnpm 10, install scripts for native dependencies are blocked unless the package appears in an allow-list. The reasoning is security: a malicious dependency can run arbitrary code at install time through a postinstall script, and pnpm's position is that you should explicitly opt each package in.

So under pnpm, `better-sqlite3` installs its JavaScript source but never compiles the native binary. `require('bindings')` then can't find `better_sqlite3.node` and throws.

## The fix

Add an `onlyBuiltDependencies` allow-list to your `package.json`:

```json
{
  "pnpm": {
    "onlyBuiltDependencies": [
      "esbuild",
      "better-sqlite3"
    ]
  }
}
```

Then wipe and reinstall:

```shell
rm -rf node_modules
pnpm install
```

On the fresh install pnpm sees the allow-list, runs `better-sqlite3`'s install script, and `node-gyp` compiles the binary. Next time you run the Better Auth generator it works.

`esbuild` is in the list for the same reason — it's another native postinstall that pnpm blocks by default.

## Where this bites you in the Better Auth flow

The CLI command that triggers this is the schema generator:

```shell
pnpm dlx @better-auth/cli@latest generate \
    --config ./better-auth.config.ts \
    --output ./src/lib/server/db/better-auth-schema.ts
```

`better-auth.config.ts` instantiates `betterAuth({ database: drizzleAdapter(db, { provider: 'sqlite' }) })` where `db` is `drizzle(new Database('./temp-betterauth.db'))` — that `Database` is from `better-sqlite3`. The moment the CLI imports your config, it loads `better-sqlite3`, and that's when the binding error surfaces.

In production (Cloudflare Workers + D1) you don't hit this at all — the D1 adapter doesn't touch `better-sqlite3`. The generator is the only place it appears.

## Related

The full Better Auth + Hono + SvelteKit walkthrough is over at [Integrate Better Auth and Google One Tap with Hono and SvelteKit](/posts/integrating-better-auth-with-hono-svelte-google-one-tap) — this post extracts the one error that's worth its own page for searchability.

## References

- [better-sqlite3 issue #146 — bindings file error](https://github.com/WiseLibs/better-sqlite3/issues/146)
- [pnpm onlyBuiltDependencies](https://pnpm.io/package_json#pnpmonlybuiltdependencies)
