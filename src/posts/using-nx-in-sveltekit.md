---
title: 'Using Nx with SvelteKit: My Guide'
date: "2024-12-28"
description: usually NX used by framework like Angular or React. However not much article about svelte and NX 🚀
categories:
  - sveltekit
  - svelte
  - nx
image: /images/using-nx-in-sveltekit.png
author: Me
published: true
---
usually NX used by framework like Angular or React. However not much article about svelte and NX

In recent time, from version 18,  NX have introduced [project crystal](https://nx.dev/concepts/inferred-tasks) which make NX less intrusive.
This make it work nicely with any JS/TS projects. There already NX plugins for [svelte](https://nx.dev/showcase/example-repos/add-svelte) and [sveltekit](https://nxext.dev/docs/sveltekit/overview.html).
However, is this article, I will not use them and will start from scratch.

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

## Conclusion
NX is known as a build tools so it can actually can do more things then what I just shown especially if you are using monorepo. there are also few interesting features of NX are:
1. [nx release](https://nx.dev/nx-api/nx/documents/release)
2. nx graph

but for me, the most useful feature is the caching
