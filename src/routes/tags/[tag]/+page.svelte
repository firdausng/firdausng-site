<script lang="ts">
    import BlogCard from "$lib/components/BlogCard.svelte";
    import {title} from "$lib/config";
    let { data } = $props();
</script>

<svelte:head>
    <title>{title} - blog</title>
</svelte:head>

<section class="mb-16 container mx-auto">
    <h1 class="text-center text-4xl font-bold my-8">Tag - {data.tag}</h1>
    <ul class="flex flex-col items-center gap-4">
        {#each data.posts as post}
            <BlogCard {post} />
        {/each}
    </ul>
</section>