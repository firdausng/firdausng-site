---
title: 'Hono + Drizzle + Cloudflare D1 — practical recipes'
date: "2025-02-02"
updated: "2026-04-22"
description: A growing set of production-tested recipes for building on Cloudflare D1 with Drizzle and Hono — wiring the stack up, writing the day-to-day CRUD patterns, and handling the sharp edges (atomic multi-step writes, no native transactions).
categories:
  - cloudflare worker
  - cloudflare D1
  - hono
  - drizzle
author: Me
published: true
featured: true
---

Three posts, three layers. Each one can stand alone; read in order they compound into the full working picture.

1. **[Setting up D1 with Drizzle in Hono](/posts/setup-d1-cloudflare-worker-with-drizzle)** — wiring it up. `wrangler.jsonc`, Drizzle config, the first migration, a basic Hono handler, Drizzle Studio against the local Miniflare SQLite, pushing to production.

2. **[Drizzle with Cloudflare D1 — the everyday usage guide](/posts/d1-cloudflare-with-drizzle)** — the read, write, and soft-delete patterns you reach for every day. Dynamic `where` composition, joins with projected fields, `RETURNING`, audit columns, and the `sql` template.

3. **[D1 has no transactions — using `client.batch()` for multi-step writes](/posts/d1-has-no-transactions-use-client-batch)** — the first real gotcha. D1 has no `BEGIN/COMMIT`; `client.batch([...])` is the answer, and it has four subtle rules worth writing down.

The examples in parts 2 and 3 come from [DuitGee](https://duitgee.com) — a fund-based expense tracker I'm building on this stack. Real schema names, real handlers, real production code.
