<script lang="ts">
    import BlogCard from "$lib/components/blogCard.svelte";
    import {title} from "$lib/config";
    let { data } = $props();
</script>

<svelte:head>
    <title>{title} - #{data.tag}</title>
</svelte:head>

<section class="container mx-auto px-4 py-8">
    <div class="flex items-center gap-3 mb-2">
        <span class="font-mono text-primary-500 dark:text-primary-400 text-sm">$</span>
        <h1 class="font-mono text-lg md:text-3xl font-bold text-primary-800 dark:text-primary-200">ls tags/{data.tag}/</h1>
        <div class="flex-1 border-t border-dashed border-primary-200 dark:border-primary-700"></div>
        <a href="/tags" class="font-mono text-sm text-primary-500 hover:text-primary-400 transition-colors">
            all namespaces &rarr;
        </a>
    </div>
    <div class="flex flex-col gap-4">
        {#each data.posts as post}
            <BlogCard {post} />
        {/each}
    </div>
</section>
