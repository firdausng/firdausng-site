---
title: Use Sveltekit with Wails app
description: In this article, we explore integrating SvelteKit with a Wails app. We will create a Wails project named ‘todo-app’ and update the Wails app by modifying the ‘wails.json’ file to include frontend-related commands. Revamp the frontend by setting up SvelteKit. Enjoy your new Wails App powered by SvelteKit! 🚀
date: '2023-11-19'
categories:
  - sveltekit
  - svelte
  - wails
image: /images/wail-svelte.png
author: Me
published: true
---
Hello there! Before we begin our journey, let's make sure you have these installed on your system:
- Go SDK
- Node.js
- Wails CLI
- pnpm

Don't worry if you're not familiar with these terms, consider them as tools needed to build our project. Ready? Let's start!

## Step 1: Create a Wails Project
First, we need to create a new project using Wails. Let's name our project 'todo-app'. You can use terminal or command prompt for this:

```
wails init -n todo-app -t svelte-ts
cd .\todo-app\
```
With these commands, we are creating a directory called '**todo-app**'.

Check out the project! You may notice a directory named "**frontend**". This is where the Svelte app will be available.

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


## Step 5: Test Your Wails App
Let's start our app to see how it looks. Run this command in the root folder:
```shell
wails dev
```
## Step 6: Build Your Wails App
Satisfied with the app? Fantastic! Now, let's build our app. Run this command:
```shell
wails build
```
Upon successful build, you'll see an executable file in the `build\bin` directory. You can launch the file and enjoy your new Wails App powered by Sveltekit!

Cheers to your first Wails App!