<script lang="ts">
    import BlogCard from "$lib/components/blogCard.svelte";
    import {title} from "$lib/config";
    let { data } = $props();
</script>

<svelte:head>
    <title>{title} - blog</title>
</svelte:head>

<section class="mb-16">
    <ul class="flex flex-col items-center gap-4">
        {#each data.posts as post}
            <BlogCard {post} />
        {/each}
    </ul>
</section>