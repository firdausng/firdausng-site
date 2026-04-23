---
title: 'Using Nx with SvelteKit — caching without the monorepo'
date: "2024-12-28"
updated: "2026-04-22"
description: Nx is usually pitched as a monorepo tool for Angular or React, but since v18's "project crystal" it works cleanly on a single SvelteKit project too — and the build cache alone is worth the install.
categories:
  - sveltekit
  - svelte
  - nx
image: /images/using-nx-in-sveltekit.png
author: Me
published: true
---
Nx is usually pitched as a monorepo build tool for Angular or React, and there isn't much written about it in the Svelte ecosystem. But since Nx v18's [Project Crystal](https://nx.dev/concepts/inferred-tasks), Nx can wrap any JS/TS project non-intrusively — no generator scaffolding, no wrapping your scripts in custom executors. That makes it a lightweight drop-in on a single-project SvelteKit repo, purely for the build cache.

There are existing Nx plugins for [Svelte](https://nx.dev/showcase/example-repos/add-svelte) and [SvelteKit](https://nxext.dev/docs/sveltekit/overview.html), but this post skips them and starts from scratch — the vanilla `nx init` is enough for what we want.

## Setting Up Your SvelteKit Project

### 1. Create a New SvelteKit Project

If you haven't already created your SvelteKit project, you can do so using the following commands:

```bash
npx sv create my-sveltekit-nx-app
cd my-sveltekit-nx-app
```

### 2. Configure NX for Sveltekit

To initialize NX in sveltekit project, you just need to install NX in sveltekit project and run the `init` command

```bash
npm i -D nx
npx nx init
```
You will get few question from this init command 
1. what scripts is cacheable - just choose most of the script such as dev, build and test
2. for each script, it will ask whether it will create output
   1. dev - skip
   2. build - .sveltekit
   3. check - skip
   4. lint - skip

you will notice a new `nx.json` file created at the root of project directory

## Run Your SvelteKit Project using NX

1 of the feature of nx is the cache, when you run build for the first time using NX, it will create a cache for you
```bash
npx nx run build #first run
npx nx run build #second run
```
you will notice on second run, it will be faster and there is a message from NX that said something similar to this `Nx read the output from the cache instead of running the command for 1 out of 1 tasks.`

## Where the cache actually saves you time

The cache is keyed off the input files and your local Node/pnpm version. If nothing in your source or dependencies has changed since the last run, Nx replays the previous output — reads from disk, no work done. In practice that means:

- **CI re-runs after a flaky test.** Build step is free.
- **Editing a markdown file in a mostly-code repo.** Build is free; only lint/test run.
- **Switching branches and back.** Both branches' build outputs are cached.

Against a cold Vite build on a SvelteKit site of any size, this is the difference between waiting 30 seconds and waiting 300 milliseconds.

## What else Nx gives you

The cache alone justifies the install, but if you grow into a monorepo two other features become valuable:

- **[Nx release](https://nx.dev/nx-api/nx/documents/release)** — versioning, changelogs, and publishing across packages from one command.
- **`nx graph`** — a live dependency graph of your projects, useful for spotting accidental cross-package imports.

For a single-project SvelteKit repo you won't need either. The caching is the win.
