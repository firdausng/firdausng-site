---
title: 'Migrate cloudflare D1 to another cloudflare D1 account'
date: "2025-10-15"
description: This guide covers migrating a D1 database to another cloudflare D1 account.. 🚀
categories:
  - cloudflare D1
author: Me
published: true
featured: true
---
This guide covers migrating a D1 database from one cloudflare D1 account to another cloudflare D1 account.

## Steps
```shell
npx wrangler d1 export <database_name> --remote --output=./database.sql
npx wrangler d1 execute <new_database_name> --remote --file=./database.sql
```

you might encounter an error like this:
```cmd
no such table: main.user: SQLITE_ERROR
```

This is because the migration sql script might have not create the table in the right order. For example, the above error is because the `user_role` table is created before the `user` table.
Because the `user_role` table have foreign key constraint to the `user` table,the error will occur.

To fix this, you need to manually update the `user` table on the sql script before the `user_role` table.

## References
https://developers.cloudflare.com/d1/best-practices/import-export-data/

