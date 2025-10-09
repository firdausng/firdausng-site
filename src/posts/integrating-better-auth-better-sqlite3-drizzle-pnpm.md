---
title: 'Integrate Better Auth with Better SQLite3 and Drizzle'
date: "2025-10-8"
description: . 🚀
categories:
  - better auth
  - better sqlite3
  - drizzle
  - pnpm
author: Me
published: true
featured: true
---
so you want to integrate `better-auth` with `better-sqlite3` and `drizzle`? you might face this error
`Error: Could not locate the bindings file`. 

# Solution
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

# References
https://github.com/WiseLibs/better-sqlite3/issues/146

