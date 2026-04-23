---
title: "Fixing Giscus comments: why Announcements is a trap"
date: "2026-04-19"
description: If you're manually creating a GitHub Discussion for every blog post, your Giscus category is probably the problem. The fix is four small config decisions — plus one migration footgun nobody warns you about.
categories:
  - giscus
  - sveltekit
  - github discussions
author: Me
published: true
---

I've been using [Giscus](https://giscus.app/) for comments on this blog since day one. It's lovely — comments live in GitHub Discussions, readers sign in with their GitHub account, and I don't run a database for it. But for months I'd been quietly creating a discussion by hand whenever I shipped a new post, because readers kept hitting an error when they tried to leave the first comment. Turns out my Giscus setup had three wrong defaults and one subtle gotcha that only shows up when you try to fix them.

## The symptom

First reader to comment on a new post sees "Discussion not found" and can't post. I'd log into the `firdausng/blog-comments` repo, manually create a discussion with the post's title, and the comment box would spring to life. Tolerable when you post monthly. Annoying when you're drafting several in a row.

Giscus is supposed to auto-create the discussion on first comment. If yours isn't, the config is almost certainly the cause.

## Why Announcements is a trap

The Giscus generator at giscus.app asks you to pick a "Discussion Category" near the end. The default suggestion — or the one people grab because it sounds safe — is often **Announcements**. It's a trap.

Announcements is a **restricted** discussion format in GitHub — only repo maintainers can open threads in it. That means when a regular reader tries to leave the first comment on a post, Giscus's auto-create-discussion machinery runs as *them*, not as you, and GitHub rejects the write. You get the "Discussion not found" error, and there's no way to auto-create.

The fix is to pick — or create — a category with the **"Open-Ended Discussion"** format. I added a new category called **Post Comments** to my comments repo specifically for this. Any authenticated reader can now start a thread, which means Giscus can auto-create when needed.

## The mapping decision matrix

While you're reconfiguring, pick your **mapping mode** deliberately. The giscus.app generator offers six options. Only two are worth using for a blog:

| Mapping | Breaks when you... | Verdict |
|---------|-------------------|---------|
| `url` | Change your domain | Too brittle |
| `<title>` | Fix a typo in a post title | Too brittle |
| `og:title` | Change `og:title` (same as `<title>` for most setups) | Too brittle |
| `specific` (custom term) | Pass a title that later changes | What I had; same breakage as above |
| `pathname` | Rename a post's URL slug | **Use this** |
| Specific discussion number | n/a — docs explicitly say it *"does not support automatic discussion creation"* | Don't use |

Pathname is the only one where a stable identifier (`/posts/<slug>`) is the search key. Pathnames almost never change, titles drift constantly (I edit typos months later), and the other options are one rename away from orphaning every comment on a post.

Also enable **"Use strict title matching"**. Without it, GitHub's fuzzy search might grab a "close enough" discussion — which sounds helpful but is actually terrifying. Strict means exact match or create-new. Predictable.

## The fix, in Svelte

My `src/lib/components/comment.svelte` went from this:

```svelte file=src/lib/components/comment.svelte
<script lang="ts">
    import { darkMode } from "$lib/state/theme.svelte";
    import Giscus from "@giscus/svelte";

    let { term }: { term: string } = $props();
</script>

<Giscus
    repo="firdausng/blog-comments"
    repoId="R_kgDOKBT8qg="
    category="Announcements"
    categoryId="DIC_kwDOF1L2fM4B-hVS"
    mapping="specific"
    term={term}
    theme={darkMode.value ? "dark" : "light"}
    reactionsEnabled="1"
    inputPosition="top"
    loading="lazy"
    lang="en"
/>
```

To this:

```svelte file=src/lib/components/comment.svelte
<script lang="ts">
    import { darkMode } from "$lib/state/theme.svelte";
    import Giscus from "@giscus/svelte";
</script>

<Giscus
    repo="firdausng/blog-comments"
    repoId="R_kgDOKBT8qg"
    category="Post Comments"
    categoryId="DIC_kwDOKBT8qs4C7Kcg"
    mapping="pathname"
    strict="1"
    theme={darkMode.value ? "dark" : "light"}
    reactionsEnabled="1"
    inputPosition="top"
    loading="lazy"
    lang="en"
/>
```

Three substantive changes: new category + id, `mapping="specific"` → `mapping="pathname"` with `strict="1"`, and the `term` prop drops out entirely — pathname mapping reads `window.location.pathname` on its own, no prop drilling needed. I also removed the matching `term={data.meta.title}` prop from every `<Comments />` call site in my post and series routes.

For theme I kept the existing `darkMode.value ? "dark" : "light"` override rather than accepting giscus.app's suggestion of `preferred_color_scheme`. The conditional tracks the site's dark-mode toggle live; `preferred_color_scheme` only follows the OS setting, which feels wrong when the reader has explicitly toggled light or dark on this site.

## The migration footgun

Here's the part I didn't see warned about anywhere: **switching mapping modes on an existing blog orphans every existing comment.**

Before my change, every discussion in `firdausng/blog-comments` had a title like `"Cloudflare Cron Jobs in SvelteKit"` — because `mapping="specific"` with `term={data.meta.title}` used the post's title as the search key. After the change, Giscus searches for discussions titled `/posts/cloudflare-cron-jobs-in-sveltekit` instead. No match, so it creates a fresh (empty) discussion for every post on first new comment. Existing discussions keep their comments but don't surface on the site anymore.

Two options:

1. **Do nothing.** New comments live in freshly-created discussions. Old comments stay intact in GitHub but aren't visible on the blog. For a tech blog with a handful of comments per post, this is usually fine.
2. **Rename each existing discussion** in GitHub to match the new pathname. Tedious, manual, but preserves comment continuity.

I went with option 1. The existing comment history across 15 posts wasn't substantial enough to justify 15 manual renames.

## Done

After this, the first reader to comment on any post triggers a silent auto-creation of the discussion. I'm no longer in the loop. Three config changes, one migration-aware shrug, and the comment section is back to being something I don't have to think about.
