---
title: 'Deploy SvelteKit to Cloudflare Pages'
date: "2024-12-22"
updated: "2026-04-22"
description: A straight walkthrough for deploying a SvelteKit app to Cloudflare Pages — installing the Cloudflare adapter, wiring a Git repo to a Pages project, and configuring the build.
categories:
  - sveltekit
  - svelte
  - cloudflare workers
image: /images/sveltekit-cloudflare.png
author: Me
published: true
featured: true
---
SvelteKit is a powerful framework for building web applications, and Cloudflare Pages provides an excellent platform for hosting them. This guide will walk you through the process of deploying your SvelteKit application to Cloudflare Pages, ensuring optimal performance and reliability.

## Prerequisites

Before we begin, make sure you have:
- Node.js installed on your machine
- A GitHub account
- A Cloudflare account
- Basic familiarity with SvelteKit

## Setting Up Your SvelteKit Project

### 1. Create a New SvelteKit Project

If you haven't already created your SvelteKit project, you can do so using the following commands:

```bash
npx sv create my-sveltekit-app
cd my-sveltekit-app
npm install
```

### 2. Configure SvelteKit for Cloudflare

To deploy to Cloudflare Pages, you'll need to make some adjustments to your SvelteKit configuration:

1. Install the Cloudflare adapter:
```bash
npm install -D @sveltejs/adapter-cloudflare
```

2. Update your `svelte.config.js`:
```javascript
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter()
    }
};

export default config;
```

## Preparing for Deployment

### 1. Version Control Setup

Make sure your project is in a Git repository and pushed to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### 2. Build Configuration

Create a `wrangler.toml` file in your project root (optional but recommended):

```toml
name = "your-project-name"
compatibility_date = "2023-01-01"
```

## Deploying to Cloudflare Pages

### 1. Connect to Cloudflare Pages

1. Log in to your Cloudflare dashboard
2. Navigate to Pages
3. Click "Create a project"
4. Choose "Connect to Git"
5. Select your GitHub repository

### 2. Configure Build Settings

Set the following build configurations in Cloudflare Pages:

- Build command: `npm run build`
- Build output directory: `.svelte-kit/cloudflare`
- Node.js version: 18 (or your preferred version)

Environment variables (if needed):
```
NODE_VERSION=18
```

### 3. Deploy

Click "Save and Deploy" to start the deployment process. Cloudflare Pages will:
1. Clone your repository
2. Install dependencies
3. Build your application
4. Deploy to their global network


## What you get out of the box

On the first successful deploy, Cloudflare Pages gives you:

- A `*.pages.dev` preview URL on every commit to the connected branch.
- Automatic preview deploys on every pull request.
- Global CDN distribution — no region to pick.
- SSR running on Cloudflare Workers, which is what `adapter-cloudflare` targets.

If you need D1 database access, KV, R2, or cron triggers from the same app, those are bindings you attach to the Pages project in **Settings → Functions → Bindings**. The adapter surfaces them as `platform.env.<BINDING>` inside your SvelteKit load and server routes — see [Using Cloudflare KV with SvelteKit](/posts/using-cloudflare-kv-in-sveltekit) and [Setting up D1 with Drizzle in Hono](/posts/setup-d1-cloudflare-worker-with-drizzle) for the two I reach for most.

## References

- [SvelteKit Cloudflare adapter](https://kit.svelte.dev/docs/adapter-cloudflare)
- [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)