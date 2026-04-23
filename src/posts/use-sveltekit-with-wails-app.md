---
title: 'Use SvelteKit with a Wails desktop app'
description: Wails bundles a Go backend with a web frontend into a native desktop binary. The default scaffold uses vanilla Svelte; swapping in SvelteKit as the frontend takes four config changes and an SPA-mode layout file.
date: '2023-11-19'
updated: '2026-04-22'
categories:
  - sveltekit
  - svelte
  - wails
  - go
image: /images/wail-svelte.png
author: Me
published: true
---
[Wails](https://wails.io) bundles a Go backend with a web frontend into a native desktop binary. The default Svelte template uses vanilla Svelte; this swaps it for SvelteKit in SPA mode — four config changes and a layout file.

Prerequisites: Go SDK, Node.js, the Wails CLI, and pnpm.

## Step 1: Create a Wails project

Scaffold a new project (named `todo-app` in this walkthrough) with the Svelte TypeScript template:

```shell
wails init -n todo-app -t svelte-ts
cd ./todo-app
```

That creates a `todo-app` directory with a `frontend/` folder — the default vanilla-Svelte scaffold. We're going to replace that folder with a SvelteKit one in step 3.

## Step 2: Update Wails App
In the todo-app folder, look for the **wails.json** file and add these lines:
```json
{
  ...
  "frontend:install": "pnpm install",
  "frontend:build": "pnpm run build",
  "frontend:dev:watcher": "pnpm run dev",
  "frontend:dev:serverUrl": "auto",
  "wailsjsdir": "./frontend/src/lib"
}
```

## Step 3: Revamp the Frontend Svelte App
Delete the **frontend** directory and run the following command to set up Sveltekit:
```shell
npx sv create frontend
```
When prompted:
- Opt for the **Skeleton Project**
- Enable **TypeScript syntax**
- Choose any other options as per your preference.

Let's navigate to **frontend** directory and install some packages:
```shell
pnpm install
pnpm install -D @sveltejs/adapter-static svelte-preprocess
```
Open up **svelte.config.js** and update these lines:
```typescript
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			fallback: 'index.html',
			pages: "dist"
		}),
	}
};

export default config;
```
changes:
- update the `preprocess` to use preprocess from `svelte-preprocess`
- update `adapter` to use adapter from `@sveltejs/adapter-static` and change the output to `dist` because wails app expect output from dist folder

## Step 4: Enable  Single-Page App (SPA)
add new file `+layout.ts` in the routes folder with this content to disable ssr and prerendering because we want this to be a Single-Page App (SPA)
```typescript
export const prerender = false;
export const ssr = false;
```


## Step 5: Run in dev mode

From the project root:

```shell
wails dev
```

Wails starts both the Go backend and the SvelteKit dev server, wires up hot reload for both, and opens the embedded webview.

## Step 6: Produce a release binary

```shell
wails build
```

You'll find the executable in `build/bin/`. That's a standalone native binary — ship it directly, no Node runtime required.

## What you've traded off

SPA mode (`ssr = false`, `prerender = false`) is the right fit here because the app runs in Wails's embedded webview, not a browser hitting a server — there's no "server" to render on. You lose SvelteKit's server-load functions, form actions, and streaming, which don't make sense in this environment anyway. What you keep is SvelteKit's routing, layouts, `$lib` aliases, and the broader ecosystem of Svelte tooling — all the frontend productivity, none of the server-rendering machinery that doesn't apply.