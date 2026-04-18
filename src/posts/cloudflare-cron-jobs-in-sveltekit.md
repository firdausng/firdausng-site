---
title: 'Cloudflare Cron Jobs in SvelteKit'
date: "2026-03-08"
description: How to add cron job support to a SvelteKit app deployed on Cloudflare Workers, since the adapter doesn't natively support the scheduled event handler.
categories:
  - sveltekit
  - cloudflare workers
  - cron
author: Me
published: true
featured: true
appCta: geeledger
---

SvelteKit's Cloudflare adapter (`@sveltejs/adapter-cloudflare`) does not natively support the `scheduled` event handler. This article documents a workaround to add cron job support to any SvelteKit app deployed on Cloudflare Workers.

## Background

While building [Gee Ledger](https://geeledger.com), I needed cron support for **recurring transactions** — invoices and expenses that auto-generate on a schedule. Think monthly rent, a client retainer billed quarterly, or an annual software renewal. The user defines a template once (amount, line items, party, category) along with a frequency (`daily` / `weekly` / `monthly` / `yearly`), an interval count, a start date, and an optional end date. Every night a cron sweep runs:

1. Find every `active` template whose `nextOccurrence` is on or before today.
2. For each one, materialize a real transaction — copy the line items from the template's blueprint, attach the income/expense aggregate, write a new row.
3. Compute the next occurrence date and either advance `nextOccurrence` or, if we've passed the end date, mark the template `completed`.

That's the feature that needed Cloudflare's `scheduled` event handler. But SvelteKit's `@sveltejs/adapter-cloudflare` doesn't natively support it — the adapter generates `_worker.js` with only a `fetch` handler, so there's no built-in way to export a `scheduled` handler.

This was raised in [sveltejs/kit#4841](https://github.com/sveltejs/kit/issues/4841). Rich Harris stated that native support for scheduled events is outside the adapter's scope, and the issue was closed with no plans to add it. The community established two workarounds:

1. **Post-build file append** (documented here) — append a `scheduled` handler to the generated worker file after build. Simple, single worker deployment.
2. **Service binding** — create a separate Cloudflare Worker for cron that calls the SvelteKit app's endpoints via service bindings. More infrastructure, but cleaner separation.

This article covers approach #1, based on [this comment](https://github.com/sveltejs/kit/issues/4841#issuecomment-3290611044).

## The Solution

Append a `scheduled` handler to the generated `_worker.js` after the SvelteKit build. The generated file exports `worker_default` as a plain object with a `fetch` method. We attach a `scheduled` method to it post-build.

## Setup

### 1. Create `cron/job.js`

The scheduled handler. Receives `event`, `env` (all Cloudflare bindings), and `ctx` (execution context).

```js
// cron/job.js

/**
 * @param {import("@cloudflare/workers-types").ScheduledEvent} event
 * @param {Env} env
 * @param {import('@cloudflare/workers-types').EventContext<Env, "", {}>} ctx
 */
worker_default.scheduled = async (event, env, ctx) => {
    console.log('[CRON] Running at:', new Date().toISOString());

    // Example: query D1 database
    // const result = await env.DB.prepare('SELECT COUNT(*) as total FROM users').first();
    // console.log('Users:', result?.total);

    // Example: write to R2
    // await env.BUCKET.put('last-cron.txt', new Date().toISOString());

    // Example: call external API
    // const res = await fetch('https://api.example.com/webhook', { method: 'POST' });
};
```

### 2. Create `cron/append.js`

Post-build script that appends `job.js` to the generated worker.

```js
// cron/append.js
import { appendFile, readFile } from 'fs/promises';

const file = await readFile('cron/job.js', 'utf8');
await appendFile('.svelte-kit/cloudflare/_worker.js', file, 'utf8');
```

### 3. Update `package.json`

Chain the append after the Vite build:

```json
{
  "scripts": {
    "build": "vite build && node cron/append.js",
    "preview": "pnpm run build && wrangler dev"
  }
}
```

### 4. Update `wrangler.jsonc`

Add the `triggers` block:

```jsonc
{
  "triggers": {
    "crons": ["0 1 * * *"]
  }
}
```

That's it — 2 new files, 2 config changes.

## How It Works

1. `vite build` generates `.svelte-kit/cloudflare/_worker.js` with a `worker_default` object containing a `fetch` method
2. `node cron/append.js` appends `cron/job.js` to the end of that file, adding `worker_default.scheduled = async (...) => { ... }`
3. Cloudflare Workers runtime sees both `fetch` and `scheduled` on the exported default object
4. On the configured cron schedule, Cloudflare calls `worker_default.scheduled()` directly — not via HTTP
5. The handler receives `env` with all bindings (D1, R2, KV, etc.) — same bindings available to the fetch handler

## Testing Locally

### 1. Build and start the worker with cron testing enabled

```bash
pnpm build && npx wrangler dev --test-scheduled
```

The `--test-scheduled` flag exposes the `/__scheduled` endpoint for testing cron triggers locally.

### 2. Trigger the cron manually

In a separate terminal:

```bash
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"
```

The `cron` query parameter must be URL-encoded (spaces as `+`).

### 3. Check the output

Logs appear in the terminal where wrangler is running:

```
[CRON] Running at: 2026-03-08T10:25:28.453Z
[wrangler:info] GET /__scheduled 200 OK (19ms)
```

### Troubleshooting: `/__scheduled` returns 307 or 404

This means SvelteKit's routing is intercepting the `/__scheduled` request (e.g. auth middleware redirecting to login). The cron logic still executes — check the logs above the HTTP status line.

This only affects local testing. In production, Cloudflare calls `scheduled()` directly, not via HTTP.

## Constraints

**Hard constraints** (inherent to the append approach):

- `worker_default` is the variable name generated by SvelteKit's Cloudflare adapter. If the adapter changes this name in a future version, the append will break. Check the end of `.svelte-kit/cloudflare/_worker.js` after a build to verify.
- Cannot use SvelteKit path aliases (`$lib/`, `$app/`, `$env/`, etc.) — these are resolved by Vite at build time, and the appended code runs outside Vite's module system.

**Soft constraints** (implementation choices, can be worked around):

- Plain JS instead of TypeScript — could be solved by adding an esbuild step: `esbuild cron/job.ts --outfile=cron/job.js --format=esm && node cron/append.js`
- No ORM (Drizzle, etc.) — could be solved by bundling with esbuild. Raw SQL via `env.DB.prepare()` is simpler for cron logic and avoids the extra build complexity.

## Cron Syntax Reference

Format: `minute hour day-of-month month day-of-week`

| Pattern | Description |
|---------|-------------|
| `* * * * *` | Every minute (testing only) |
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour |
| `0 1 * * *` | Daily at 1:00 AM UTC |
| `0 */6 * * *` | Every 6 hours |
| `0 0 * * 1` | Every Monday at midnight UTC |
| `0 0 1 * *` | First day of every month |

## Accessing Cloudflare Bindings

The `env` parameter provides access to all bindings configured in `wrangler.jsonc`:

```js
worker_default.scheduled = async (event, env, ctx) => {
    // D1 Database
    const rows = await env.DB.prepare('SELECT * FROM users WHERE active = ?').bind(1).all();
    await env.DB.prepare('INSERT INTO logs (message) VALUES (?)').bind('cron ran').run();

    // Batch multiple D1 statements
    await env.DB.batch([
        env.DB.prepare('UPDATE table1 SET col = ?').bind('val1'),
        env.DB.prepare('INSERT INTO table2 (col) VALUES (?)').bind('val2'),
    ]);

    // R2 Object Storage
    await env.BUCKET.put('report.json', JSON.stringify({ generated: new Date() }));
    const obj = await env.BUCKET.get('config.json');

    // KV Namespace
    await env.KV.put('last-run', new Date().toISOString());
    const lastRun = await env.KV.get('last-run');

    // Environment Variables
    const apiKey = env.API_KEY;

    // External HTTP calls
    await fetch('https://api.example.com/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cron completed' }),
    });
};
```

## Multiple Cron Schedules

You can define multiple schedules. All of them invoke the same `scheduled` handler — use `event.cron` to differentiate:

```jsonc
// wrangler.jsonc
{
  "triggers": {
    "crons": ["0 * * * *", "0 0 * * *"]
  }
}
```

```js
// cron/job.js
worker_default.scheduled = async (event, env, ctx) => {
    if (event.cron === '0 * * * *') {
        // Hourly task
    }
    if (event.cron === '0 0 * * *') {
        // Daily task
    }
};
```

## Alternative: Route Through SvelteKit

Instead of doing work directly in `job.js`, you can route the cron into a SvelteKit API endpoint:

```js
// cron/job.js
worker_default.scheduled = async (event, env, ctx) => {
    const req = new Request('https://example.com/_cron', { method: 'GET' });
    await worker_default.fetch(req, env, ctx);
};
```

This calls `worker_default.fetch` with a fake request, which SvelteKit routes to `src/routes/_cron/+server.ts`. The origin (`example.com`) doesn't matter — it's never actually fetched.

**Pros:** Access to TypeScript, SvelteKit imports, Drizzle ORM, full framework features.
**Cons:** Must bypass auth middleware for the `/_cron` path. Slightly more overhead.

## Production Deployment

No special steps. Deploy as normal — the build script handles everything:

```bash
pnpm deploy
# or: wrangler deploy
```

Verify cron triggers in the Cloudflare dashboard: **Workers & Pages > your-worker > Settings > Triggers > Cron Triggers**.
