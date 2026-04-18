<script lang="ts">
    import BlogCard from "$lib/components/blogCard.svelte";
    import BlogCardCompact from "$lib/components/blogCardCompact.svelte";
    import PostListSidebar from "$lib/components/postListSidebar.svelte";
    import {title} from "$lib/config";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    let { data } = $props();

    const view = $derived(page.url.searchParams.get('view') === 'grid' ? 'grid' : 'list');

    function setView(next: 'list' | 'grid') {
        if (next === view) return;
        const url = new URL(page.url);
        if (next === 'list') url.searchParams.delete('view');
        else url.searchParams.set('view', next);
        goto(url, { replaceState: true, keepFocus: true, noScroll: true });
    }
</script>

<svelte:head>
    <title>{title} - Posts</title>
</svelte:head>

<section class="container mx-auto px-4 py-8 lg:flex lg:gap-8">
    <aside class="hidden lg:block w-56 shrink-0" aria-label="Browse">
        <div class="sticky top-24">
            <PostListSidebar categories={data.categories} series={data.series} />
        </div>
    </aside>

    <div class="lg:flex-1 min-w-0">
        {#if data.categories.length}
            <nav class="lg:hidden -mx-4 px-4 mb-4 overflow-x-auto" aria-label="Topics">
                <ul class="flex gap-2 whitespace-nowrap font-mono text-xs">
                    {#each data.categories as c (c.name)}
                        <li>
                            <a
                                href={`/tags/${c.name}`}
                                class="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors no-underline"
                            >{c.name}</a>
                        </li>
                    {/each}
                </ul>
            </nav>
        {/if}

        <div class="flex items-center gap-3 mb-2">
            <span class="font-mono text-primary-500 dark:text-primary-400 text-sm">$</span>
            <h1 class="font-mono text-lg md:text-3xl font-bold text-primary-800 dark:text-primary-200">ls posts/</h1>
            <div class="flex-1 border-t border-dashed border-primary-200 dark:border-primary-700"></div>
            <span class="font-mono text-xs text-gray-500 dark:text-gray-400">{data.posts.length} posts</span>
            <div class="font-mono text-xs flex items-center gap-1.5" role="group" aria-label="View mode">
                <button
                    type="button"
                    aria-pressed={view === 'list'}
                    onclick={() => setView('list')}
                    class="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-primary-950 transition-colors {view === 'list' ? 'text-primary-700 dark:text-primary-200' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}"
                >list</button>
                <span class="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
                <button
                    type="button"
                    aria-pressed={view === 'grid'}
                    onclick={() => setView('grid')}
                    class="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-primary-950 transition-colors {view === 'grid' ? 'text-primary-700 dark:text-primary-200' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}"
                >grid</button>
            </div>
        </div>

        {#if view === 'grid'}
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {#each data.posts as post (post.slug)}
                    <BlogCardCompact {post} />
                {/each}
            </div>
        {:else}
            <!-- Table header (list view only) -->
            <div class="hidden md:flex font-mono text-xs text-gray-400 dark:text-gray-500 gap-4 px-4 py-2 mb-2">
                <span class="w-64">TITLE</span>
                <span class="w-20">TOPIC</span>
                <span class="flex-1">DATE</span>
            </div>
            <div class="flex flex-col gap-4">
                {#each data.posts as post (post.slug)}
                    <BlogCard {post} />
                {/each}
            </div>
        {/if}
    </div>
</section>
