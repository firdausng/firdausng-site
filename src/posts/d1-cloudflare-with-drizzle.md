---
title: 'Cloudflare D1 Database with Drizzle and Hono API App'
date: "2025-02-02"
description: . 🚀
categories:
  - cloudflare worker
  - cloudflare D1
  - Hono
  - Drizzle
author: Me
published: false
featured: true
---
In this article I am going to take a look on some of the usage guide for Cloudflare D1 integration with Drizzle.
I am going to use Hono Web API with Cloudflare worker for all this example. You can follow the setup guide here: [Setting up D1 Database with Drizzle in a Hono Cloudflare Worker App](/posts/setup-d1-cloudflare-worker-with-drizzle)

## Add Schema
I am going to add some schemas for this article as below
```ts
import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const todo = sqliteTable("todo_definition", {
    id: int().primaryKey({ autoIncrement: true }),
    description  : text().notNull(),
    done: int({mode: "boolean"}).notNull().default(false),
    version   : text().notNull(),
    created_at : text().notNull().default(sql`(current_timestamp)`),
    updated_at : text().default(sql`(current_timestamp)`),
    metadata: text({ mode: 'json' })
})
```
Then we can proceed with drizzle migration for this
```shell
pnpm drizzle-kit generate --config=drizzle.config.ts
wrangler d1 migrations apply "Hono DB"
```

## Update Hono

```ts
import {Hono} from "hono";
import {App} from "../types";
import {drizzle} from "drizzle-orm/d1";
import {todo} from "../db/schema";

export const todoApp = new Hono<App>()

todoApp.post('', async(c) => {
    const todoData = await c.req.json();
    const db = drizzle(c.env.DB);

    try {
        const [schemaResult] = await db
            .insert(todo)
            .values({
                description: todoData.description,
                done: false,
                version: "0.0.1",
                metadata: todoData.metadata,
                
            })
            .returning();

        return  c.json(schemaResult);
    } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
    }
})
```


# References
https://developers.cloudflare.com/workers/wrangler/commands/#d1-migrations-apply

