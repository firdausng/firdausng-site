<script lang="ts">import { formatDate } from "$lib/utils";
import { url, title } from "$lib/config";
import Comments from "$lib/components/comment.svelte";
export let data;
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
    <meta property="og:image" content={data.meta.image} />

    <meta name="twitter:site" content="@firdausng_byte" />
    <meta name="twitter:creator" content="@firdausng_byte" />
    <meta name="twitter:title" content={data.meta.title} />
    <meta name="twitter:description" content={data.meta.description} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image:src" content={data.meta.image} />
    <meta name="twitter:widgets:new-embed-design" content="on" />

    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
</svelte:head>

<!--<article class="prose prose-lg prose-slate dark:prose-invert max-w-none prose-a:text-sky-600 prose-a:no-underline dark:prose-a:text-sky-300 mb-16 mx-auto">-->
<article class="prose prose-lg prose-slate dark:prose-invert mb-16 mx-auto bg-primary-50 dark:bg-primary-950 p-2">
    <!-- Title -->
    <hgroup class="flex flex-col items-center">
        <h1 class="">{data.meta.title}</h1>
        {#if data.meta.image}
            <img src={data.meta.image} alt="blog banner" class="rounded-md" />
        {/if}
        <p class="text-end text-sm">
            Published at {formatDate(data.meta.date)}
        </p>
    </hgroup>

    <!-- Tags -->
    <div class="flex flex-wrap gap-4 mb-6">
        {#each data.meta.categories as category}
            <a href={`/tags/${category}`} class="chip variant-filled-secondary no-underline"
            >&num;{category}</a
            >
        {/each}
    </div>

    <!-- Post -->
    <svelte:component this={data.content} />
    
    <Comments term={data.meta.title} />
    
</article>