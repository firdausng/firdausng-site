<script lang="ts">
    import BlogCard from "$lib/components/blogCard.svelte";
    import {title} from "$lib/config";
    let { data } = $props();
</script>

<svelte:head>
    <title>{title} - Posts</title>
</svelte:head>

<section class="container mx-auto px-4 py-8">
    <div class="flex items-center gap-3 mb-2">
        <span class="font-mono text-primary-500 dark:text-primary-400 text-sm">$</span>
        <h1 class="font-mono text-lg md:text-3xl font-bold text-primary-800 dark:text-primary-200">ls posts/</h1>
        <div class="flex-1 border-t border-dashed border-primary-200 dark:border-primary-700"></div>
        <span class="font-mono text-xs text-gray-500 dark:text-gray-400">{data.posts.length} posts</span>
    </div>
    <!-- Table header -->
    <div class="hidden md:flex font-mono text-xs text-gray-400 dark:text-gray-500 gap-4 px-4 py-2 mb-2">
        <span class="w-64">TITLE</span>
        <span class="w-20">TOPIC</span>
        <span class="flex-1">DATE</span>
    </div>
    <div class="flex flex-col gap-4">
        {#each data.posts as post}
            <BlogCard {post} />
        {/each}
    </div>
</section>
