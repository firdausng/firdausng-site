---
title: 'Integrate Better Auth and Google One Tap with Hono and Svelte'
date: "2025-10-9"
description: A comprehensive guide to setting up Better Auth with Google One Tap authentication in a SvelteKit application using Hono and Cloudflare Workers 🚀
categories:
  - better auth
  - Google One Tap
  - hono
  - svelte
  - sveltekit
  - drizzle
  - cloudflare
  - cloudflare workers
  - cloudflare D1
author: Me
published: true
featured: true
---
This guide demonstrates how to integrate Better Auth with Hono in a SvelteKit application, including Google One Tap sign-in functionality. The stack uses Cloudflare Workers for deployment and Drizzle ORM with Cloudflare D1 for the database.

## Prerequisites

Before starting, ensure you have:

1. **SvelteKit Project**: Create a new SvelteKit project with the Cloudflare Workers adapter
   ```shell
   pnpm create cloudflare@latest my-app --framework=svelte
   ```

2. **Google OAuth Credentials**:
    - Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
    - Create an OAuth 2.0 Client ID for a web application
    - Add `http://localhost:5173/api/auth/callback/google` to Authorized redirect URIs
    - Note down your Client ID and Client Secret

3. **Environment Variables**: Create a `.dev.vars` file in your project root (we'll populate this later)

## Installation

Install the required dependencies:

```shell
# Core dependencies
pnpm add better-auth drizzle-orm hono @hono/valibot-validator valibot

# Development dependencies
pnpm add -D better-sqlite3 drizzle-kit @types/better-sqlite3
```

**Note**: `better-sqlite3` is only used during development to generate the Better Auth schema. Production uses Cloudflare D1.

## Project Structure

Create the following directory structure:

```
.
├── src/
│   ├── lib/
│   │   └── server/
│   │       ├── api/
│   │       │   └── index.ts
│   │       ├── better-auth/
│   │       │   ├── index.ts
│   │       │   └── options.ts
│   │       └── db/
│   │           ├── schema.ts
│   │           └── better-auth-schema.ts
│   ├── routes/
│   │   └── api/
│   │       └── [...path]/
│   │           └── +server.ts
│   └── app.d.ts
├── better-auth.config.ts
├── temp-betterauth.db
└── .dev.vars
```

## Configuration Files

### 1. TypeScript Types

Update `src/app.d.ts` to include Cloudflare environment bindings:

```ts
// src/app.d.ts
import type { RequestIdVariables } from "hono/request-id";

declare global {
    namespace App {
        interface Platform {
            env: Cloudflare.Env;
            cf: CfProperties;
            ctx: ExecutionContext;
        }

        interface Api {
            Bindings: Cloudflare.Env;
            Variables: RequestIdVariables;
        }
    }

    namespace Cloudflare {
        interface Env {
            DATABASE_URL: string;
            BASE_PATH: string;
            BETTER_AUTH_URL: string;
            BETTER_AUTH_SECRET: string;
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CLIENT_SECRET: string;
            ASSETS: Fetcher;
            AUTH_DB: D1Database;
        }
    }
}

export {};
```

### 2. Environment Variables

Create `.dev.vars` with your configuration:

```
BASE_PATH=http://localhost:5173
BETTER_AUTH_URL=http://localhost:5173
BETTER_AUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Important**: Generate a secure random string for `BETTER_AUTH_SECRET`. You can use:
```shell
openssl rand -base64 32
```

### 3. Better Auth Schema Generator

Create `better-auth.config.ts` (used only for schema generation):

```ts
// better-auth.config.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './src/lib/server/db/schema';

const sqlite = new Database('./temp-betterauth.db');
const db = drizzle(sqlite, { schema });

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
});
```

Create an empty SQLite database file:
```shell
touch temp-betterauth.db
```

### 4. Better Auth Options

Define your Better Auth configuration in `src/lib/server/better-auth/options.ts`:

```ts
// src/lib/server/better-auth/options.ts
import type { BetterAuthOptions } from "better-auth";

export const betterAuthOptions: BetterAuthOptions = {
    /**
     * Application name displayed in authentication flows
     */
    appName: 'My Awesome App',
    
    /**
     * Base path for Better Auth endpoints
     * @default "/api/auth"
     */
    basePath: '/api/auth',
    
    /**
     * Session configuration
     */
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
};
```

### 5. Better Auth Instance

Create the main Better Auth instance in `src/lib/server/better-auth/index.ts`:

```ts
// src/lib/server/better-auth/index.ts
import { drizzle } from "drizzle-orm/d1";
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { bearer, oneTap } from "better-auth/plugins";
import { betterAuthOptions } from './options';
import * as schema from "../db/better-auth-schema";

export const auth = (env: Cloudflare.Env): ReturnType<typeof betterAuth> => {
    const db = drizzle(env.AUTH_DB, { schema });

    return betterAuth({
        ...betterAuthOptions,
        database: drizzleAdapter(db, { provider: 'sqlite' }),
        baseURL: env.BETTER_AUTH_URL,
        secret: env.BETTER_AUTH_SECRET,
        
        /**
         * Enable email/password authentication
         */
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false, // Set to true in production
        },
        
        /**
         * Social authentication providers
         */
        socialProviders: {
            google: {
                clientId: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
            }
        },
        
        /**
         * Better Auth plugins
         */
        plugins: [
            bearer(), // Bearer token authentication
            oneTap(), // Google One Tap
        ],
        
        /**
         * Trusted origins for CORS
         */
        trustedOrigins: [
            env.BASE_PATH,
        ],
    });
};
```

## Hono API Setup

### 1. Create API Router

Set up your Hono router in `src/lib/server/api/index.ts`:

```ts
// src/lib/server/api/index.ts
import { Hono } from 'hono';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { auth } from "$lib/server/better-auth";

const router = new Hono<App.Api>()
    .use('*', trimTrailingSlash())
    .use(logger())
    .use('*', prettyJSON())
    .on(["POST", "GET"], "/auth/*", (c) => auth(c.env).handler(c.req.raw));

export const api = new Hono<App.Api>().route('/api', router);
```

### 2. Create SvelteKit Endpoint

Connect Hono to SvelteKit in `src/routes/[...path]/+server.ts`:

```ts
// src/routes/[...path]/+server.ts
import { api } from '$lib/server/api';
import type { RequestHandler } from "./$types";

const handler: RequestHandler = ({ request, platform }) => {
    return api.fetch(request, platform?.env, platform?.ctx);
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
```

## Database Setup

### 1. Generate Better Auth Schema

Run the Better Auth CLI to generate the database schema:

```shell
pnpm dlx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/lib/server/db/better-auth-schema.ts
```

This creates the necessary tables in `src/lib/server/db/better-auth-schema.ts`.

you might face this error `Error: Could not locate the bindings file`.

#### Solution
you need to update your package.json under `pnpm` to this
```json
{
  ...,
  "pnpm": {
    "onlyBuiltDependencies": [
      "esbuild",
      "better-sqlite3"
    ]
  }
```
Then delete your node_modules and you good to go

### 2. Create D1 Database

Create your Cloudflare D1 database:

```shell
pnpm wrangler d1 create auth-db
```

Update your `wrangler.jsonc` with the database binding:

```json
{
  "d1_databases": [
    {
      "binding": "AUTH_DB",
      "database_id": "74afa6fa-30aa-4279-953a-abcd",
      "database_name": "auth",
      "migrations_dir": "auth-migrations"
    }
  ]
}
```

### 3. Run Migrations

Apply the schema to your D1 database:

```shell
wrangler d1 migrations apply "auth" 
```

## Client Setup (Frontend)

Create a Better Auth client in your SvelteKit app:

```ts
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/svelte";
import { oneTapClient } from "better-auth/client/plugins";

export const authClient = (data) => createAuthClient({
    baseURL: data.basePath,
    plugins: [
        oneTapClient({
            clientId: data.googleClientId,
            // Optional client configuration:
            autoSelect: false,
            cancelOnTapOutside: true,
            context: "signin",
            additionalOptions: {
                // Any extra options for the Google initialize method
            },
            // Configure prompt behavior and exponential backoff:
            promptOptions: {
                baseDelay: 1000,   // Base delay in ms (default: 1000)
                maxAttempts: 5     // Maximum number of attempts before triggering onPromptNotification (default: 5)
            }
        })
    ]
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

## Usage Example

Here's a simple login page component:

```svelte
<!-- src/routes/login/+page.svelte -->
<script lang="ts">
    import { authClient } from '$lib/auth-client';
    
    async function handleGoogleSignIn() {
        await authClient.signIn.social({
            provider: 'google',
        });
    }
</script>

<div class="login-container">
    <h1>Sign In</h1>
    
    <!-- Google One Tap will appear automatically -->
    <button on:click={handleGoogleSignIn}>
        Sign in with Google
    </button>
</div>
```

## Deployment

When deploying to Cloudflare Workers:

1. Set environment variables in Cloudflare dashboard or via Wrangler:
   ```shell
   pnpm wrangler secret put BETTER_AUTH_SECRET
   pnpm wrangler secret put GOOGLE_CLIENT_ID
   pnpm wrangler secret put GOOGLE_CLIENT_SECRET
   ```

2. Update `BETTER_AUTH_URL` and `BASE_PATH` to your production domain

3. Add your production domain to Google OAuth authorized redirect URIs

4. Deploy:
   ```shell
   pnpm run deploy
   ```

## Troubleshooting

**Issue**: "Database not found" error
- **Solution**: Ensure AUTH_DB binding is correctly configured in `wrangler.toml`

**Issue**: Google One Tap not appearing
- **Solution**: Verify your domain is authorized in Google Cloud Console and the client ID matches

**Issue**: CORS errors
- **Solution**: Add your frontend domain to `trustedOrigins` in Better Auth config

## References

- [Better Auth Documentation](https://better-auth.com)
- [Hono Documentation](https://hono.dev)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [better-sqlite3 GitHub Issue #146](https://github.com/WiseLibs/better-sqlite3/issues/146)

## Conclusion

You now have a fully functional authentication system with Google One Tap integration running on Cloudflare Workers. This setup provides a secure, scalable solution with minimal latency thanks to Cloudflare's edge network.

For production use, remember to:
- Enable email verification
- Set up proper error handling
- Implement rate limiting
- Configure secure session management
- Add monitoring and logging

