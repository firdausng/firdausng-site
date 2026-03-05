<script lang="ts">
    import BlogCard from "$lib/components/blogCard.svelte";
    import {title} from "$lib/config";
    let { data } = $props();
</script>

<svelte:head>
    <title>{title} - Series</title>
</svelte:head>

<section class="container mx-auto px-4 py-8">
    <div class="flex items-center gap-3 mb-2">
        <span class="font-mono text-primary-500 dark:text-primary-400 text-sm">$</span>
        <h1 class="font-mono text-2xl md:text-3xl font-bold text-primary-800 dark:text-primary-200">ls series/</h1>
        <div class="flex-1 border-t border-dashed border-primary-200 dark:border-primary-700"></div>
        <span class="font-mono text-xs text-gray-500 dark:text-gray-400">{data.series.length} series</span>
    </div>
    <div class="flex flex-col gap-4">
        {#each data.series as post}
            <BlogCard {post} />
        {/each}
    </div>
</section>
