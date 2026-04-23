---
title: 'Using Cloudflare KV with SvelteKit'
date: "2024-12-23"
updated: "2026-04-22"
description: How to wire a Cloudflare KV namespace into a SvelteKit app deployed on Cloudflare — creating the namespace, binding it in wrangler, exposing it through hooks, and the basic read/write patterns in server routes.
categories:
  - sveltekit
  - svelte
  - cloudflare workers
  - cloudflare kv
image: /images/sveltekit-cloudflare-kv.png
author: Me
published: true
---
This guide walks through integrating Cloudflare KV with a SvelteKit app deployed on Cloudflare — creating the namespace, binding it in `wrangler.toml`, exposing it through SvelteKit's `event.locals`, and the basic read/write patterns in server routes.

## Initial Setup

### Configure SvelteKit for Cloudflare
First, ensure your SvelteKit project is configured for Cloudflare Pages. Update your `vite.config.js`:
```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
});
```
you also need to update the `svelte.config.js`
```ts
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter()
    }
};

export default config;
```

### Create and configure Cloudflare KV namespace
In order to use cloudflare worker, it is best practise to install cloudflare `wrangler` cli.

You can do that by running this command
```shell
npm i -D wrangler
```
Then run this command to create a new KV namespace. If you already have a KV namespace in your Cloudflare account, skip this step and use the existing one.
Take note the id generated so that we can use it in our app
```shell
npx wrangler kv:namespace create "MY_NAMESPACE"
```
Add the namespace to your `wrangler.toml:`.
```toml
kv_namespaces = [
  { binding = "MY_KV", id = "your_namespace_id" }
]
```
if you are using typescript, you need to update `src/app.d.ts` file
```ts
declare global {
    namespace App {
        interface Platform {
            env: {
                MY_KV: KVNamespace;
            };
        }
    }
}
```

### Point KV namespace in cloudflare dashboard
Once you have deployed to cloudflare, you need to ensure cloudflare know which KV that you want to target
You need to navigate to your svelte project in cloudflare 
navigate to `Settings > Bindings > + Add > KV namespace`

| name          | value                   |
|---------------|-------------------------|
| Variable Name | MY_KV                   |
| KV Namespace  | [Whatever your KV name] |



## Basic Operations

### 1. Server-Side Routes (Hooks)

Create a `src/hooks.server.ts` file to handle KV operations:

```typescript
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Access KV through platform.env
  const { platform } = event;
  
  if (platform?.env) {
    // Attach KV to event.locals for easy access
    event.locals.kv = platform.env.MY_KV;
  }
  
  return resolve(event);
};
```

### 2. Server Route Implementation

Create server routes in `src/routes/api/[resource]/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
  const { key, value } = await request.json();
  
  try {
    await platform?.env.MY_KV.put(key, JSON.stringify(value));
    return json({ success: true });
  } catch (error) {
    return json({ error: 'Failed to store data' }, { status: 500 });
  }
};

export const GET: RequestHandler = async ({ url, platform }) => {
  const key = url.searchParams.get('key');
  
  if (!key) {
    return json({ error: 'Key is required' }, { status: 400 });
  }
  
  try {
    const value = await platform?.env.MY_KV.get(key, 'json');
    return json({ value });
  } catch (error) {
    return json({ error: 'Failed to retrieve data' }, { status: 500 });
  }
};
```

### 3. Page Server Implementation

Create a `+page.server.ts` file for server-side data loading:

```typescript
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
  try {
    const userData = await platform?.env.MY_KV.get('user_data', 'json');
    return {
      userData
    };
  } catch (error) {
    console.error('Failed to load user data:', error);
    return {
      userData: null
    };
  }
};
```

## What KV is and isn't good for

KV is eventually consistent — a write from one region can take up to ~60 seconds to propagate globally. That's fine for rate-limit counters, feature flags, cached API responses, and user preferences. It's not fine for anything where "read-your-writes" matters within the same session, or for anything that needs a guaranteed atomic update.

For strongly-consistent per-row reads and writes on Cloudflare, reach for D1 — the [setup guide](/posts/setup-d1-cloudflare-worker-with-drizzle) covers that path.