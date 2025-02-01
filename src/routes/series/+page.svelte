<script lang="ts">
    import BlogCard from "$lib/components/blogCard.svelte";
    import {title} from "$lib/config";
    let { data } = $props();
</script>

<svelte:head>
    <title>{title} - Series</title>
</svelte:head>

<section class="mb-16 container mx-auto">
    <h1 class="text-center text-4xl font-bold my-8">Posts</h1>
    <ul class="flex flex-col items-center gap-8">
        {#each data.series as post}
            <BlogCard {post} />
        {/each}
    </ul>
</section>  