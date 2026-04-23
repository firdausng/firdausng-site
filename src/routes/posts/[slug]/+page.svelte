<script lang="ts">import { formatDate } from "$lib/utils";
import { url, title } from "$lib/config";
import { page } from "$app/state";
import Comments from "$lib/components/comment.svelte";
import TableOfContents from "$lib/components/tableOfContents.svelte";
import AppCTA from "$lib/components/appCta.svelte";
import SeriesNav from "$lib/components/seriesNav.svelte";
import RelatedPosts from "$lib/components/relatedPosts.svelte";
import { copyCode } from "$lib/actions/copyCode";
export let data;

const AUTHOR = { '@type': 'Person', name: 'Firdaus Kamaruddin', url };

$: absoluteImage = data.meta.image
    ? (data.meta.image.startsWith('http') ? data.meta.image : `${url}${data.meta.image}`)
    : null;

$: jsonLd = (() => {
    const meta = data.meta;
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: meta.title,
        description: meta.description,
        datePublished: meta.date,
        dateModified: meta.updated ?? meta.date,
        author: AUTHOR,
        publisher: AUTHOR,
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}${data.url}` }
    };
    if (meta.image) {
        schema.image = meta.image.startsWith('http') ? meta.image : `${url}${meta.image}`;
    }
    if (Array.isArray(meta.categories) && meta.categories.length) {
        schema.keywords = meta.categories.join(', ');
    }
    return JSON.stringify(schema).replace(/</g, '\\u003c');
})();

$: breadcrumbLd = (() => {
    const items: Array<Record<string, unknown>> = [
        { '@type': 'ListItem', position: 1, name: 'Home', item: url },
        { '@type': 'ListItem', position: 2, name: 'Posts', item: `${url}/posts` },
    ];
    if (data.series) {
        items.push({
            '@type': 'ListItem',
            position: items.length + 1,
            name: data.series.title,
            item: `${url}${data.series.url}`,
        });
    }
    items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: data.meta.title,
        item: `${url}${data.url}`,
    });
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items,
    }).replace(/</g, '\\u003c');
})();
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

    {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
    {@html `<script type="application/ld+json">${breadcrumbLd}<\/script>`}
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="relative max-w-4xl mx-auto">
    <div class="rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950/80 overflow-hidden shadow-lg shadow-primary-500/5">

        <!-- Terminal title bar -->
        <div class="flex items-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/60 border-b border-primary-200 dark:border-primary-700">
            <span class="font-mono text-xs sm:text-sm text-primary-600 dark:text-primary-300 truncate"><span class="hidden sm:inline">~/posts/</span>{page.params.slug}</span>
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
            <div class="font-mono text-xs text-gray-400 dark:text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                <span>BY <a href="/about" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 no-underline" rel="author">Firdaus Kamaruddin</a></span>
                <span>CREATED <span class="text-gray-600 dark:text-gray-300">{formatDate(data.meta.date)}</span></span>
                {#if data.meta.updated}
                    <span>UPDATED <span class="text-gray-600 dark:text-gray-300">{formatDate(data.meta.updated)}</span></span>
                {/if}
                {#if data.meta.readingTime}
                    <span>~<span class="text-gray-600 dark:text-gray-300">{data.meta.readingTime}</span> min read</span>
                {/if}
            </div>
            {#if data.series}
                <SeriesNav series={data.series} variant="banner" />
            {/if}
        </div>

        <!-- Article content -->
        <article use:copyCode class="prose prose-lg prose-slate dark:prose-invert max-w-none px-6 md:px-10 py-6 md:py-8">
            {#if data.meta.image}
                <img src={data.meta.image} alt="blog banner" class="rounded-md" />
            {/if}

            <svelte:component this={data.content} />

            {#if data.series}
                <SeriesNav series={data.series} variant="pager" />
            {/if}

            {#if data.related && data.related.length}
                <RelatedPosts posts={data.related} />
            {/if}

            {#if data.meta.appCta}
                <AppCTA app={data.meta.appCta} />
            {/if}

            <Comments />
        </article>
    </div>

        <aside
            class="hidden xl:block absolute top-0 bottom-0 left-full ml-6 w-48"
            aria-label="On this page"
        >
            <div class="sticky top-24">
                <TableOfContents headings={data.meta.headings ?? []} />
            </div>
        </aside>
    </div>
</div>
