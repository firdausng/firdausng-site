<script lang="ts">
let {data} = $props();
</script>

<div class="container mx-auto">
    <h1 class="text-2xl">Tags</h1>
    <ul class="list-disc">
        {#each Object.keys(data.posts) as tag}
            <li class="hover:underline">
                <a href={`/tags/${tag}`}>{tag}</a>
            </li>
        {/each}
    </ul>
</div>

