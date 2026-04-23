<script lang="ts">import { formatDate } from "$lib/utils";
import { url, title } from "$lib/config";
import { page } from "$app/state";
import Comments from "$lib/components/comment.svelte";
export let data;

$: absoluteImage = data.meta.image
    ? (data.meta.image.startsWith('http') ? data.meta.image : `${url}${data.meta.image}`)
    : null;
</script>

<!-- SEO -->
<svelte:head>
    <title>{data.meta.title}</title>

    <link rel="canonical" href={`${url}${data.url}`} />
    <meta name="description" content={data.meta.description} />

    <meta property="og:type" content="article" />
    <meta property="og:url" content={`${url}${data.url}`} />
    <meta property="og:title" content={data.meta.title} />
    <meta property="og:description" content={data.meta.description} />
    <meta property="og:site_name" content={title} />
    {#if absoluteImage}
        <meta property="og:image" content={absoluteImage} />
    {/if}

    <meta name="twitter:site" content="@firdausng_byte" />
    <meta name="twitter:creator" content="@firdausng_byte" />
    <meta name="twitter:title" content={data.meta.title} />
    <meta name="twitter:description" content={data.meta.description} />
    <meta name="twitter:card" content={absoluteImage ? 'summary_large_image' : 'summary'} />
    {#if absoluteImage}
        <meta name="twitter:image:src" content={absoluteImage} />
    {/if}
    <meta name="twitter:widgets:new-embed-design" content="on" />

    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950/80 overflow-hidden shadow-lg shadow-primary-500/5 max-w-4xl mx-auto">

        <!-- Terminal title bar -->
        <div class="flex items-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/60 border-b border-primary-200 dark:border-primary-700">
            <span class="font-mono text-xs sm:text-sm text-primary-600 dark:text-primary-300 truncate"><span class="hidden sm:inline">~/series/</span>{page.params.slug}</span>
            <span class="ml-auto flex items-center gap-3 text-primary-400 dark:text-primary-500">
                <span class="text-xs">&#x2500;</span>
                <span class="text-xs">&#x25A1;</span>
                <span class="text-sm">&times;</span>
            </span>
        </div>

        <!-- Article title -->
        <h1 class="font-mono text-xl md:text-2xl font-bold text-primary-800 dark:text-primary-200 px-6 md:px-10 pt-6 md:pt-8">{data.meta.title}</h1>

        <!-- Article meta -->
        <div class="px-6 md:px-10 pt-3 space-y-3">
            <div class="flex flex-wrap gap-2">
                {#each data.meta.categories as category}
                    <a href={`/tags/${category}`}
                       class="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors no-underline">
                        {category}
                    </a>
                {/each}
            </div>
            <div class="font-mono text-xs text-gray-400 dark:text-gray-500">
                CREATED <span class="text-gray-600 dark:text-gray-300">{formatDate(data.meta.date)}</span>
            </div>
        </div>

        <!-- Article content -->
        <article class="prose prose-lg prose-slate dark:prose-invert max-w-none px-6 md:px-10 py-6 md:py-8">
            {#if data.meta.image}
                <img src={data.meta.image} alt="blog banner" class="rounded-md" />
            {/if}

            <svelte:component this={data.content} />

            {#if data.parts && data.parts.length}
                <section class="not-prose mt-8">
                    <h2 class="font-mono text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Posts in this series</h2>
                    <ol class="space-y-2 font-mono text-sm">
                        {#each data.parts as part, i (part.slug)}
                            <li class="flex gap-3">
                                <span class="text-gray-400 dark:text-gray-500 tabular-nums">{i + 1}.</span>
                                <a
                                    href={part.slug}
                                    class="text-primary-700 dark:text-primary-200 hover:underline underline-offset-2"
                                >{part.title}</a>
                            </li>
                        {/each}
                    </ol>
                </section>
            {/if}

            <Comments />
        </article>
    </div>
</div>
