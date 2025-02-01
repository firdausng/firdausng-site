<script lang="ts">
let {data} = $props();
let tagWithFrequency = Object.keys(data.posts).map(post => {
    return {
        label: post,
        frequency: data.posts[post].length
    }
});

const getTextSizeClass = (frequency:number) => {
    if (frequency >= 10) return 'text-2xl';
    if (frequency >= 8) return 'text-xl';
    if (frequency >= 4) return 'text-lg';
    if (frequency >= 2) return 'text-base';
    return 'text-sm';
};

</script>

<div class="container mx-auto">
<!--    <h1 class="text-2xl my-8">Tags</h1>-->
    <div class="w-full max-w-4xl mx-auto p-8">
        <h2 class="text-2xl font-bold mb-6">Tags</h2>
        <div class="flex flex-wrap gap-3">
            {#each tagWithFrequency as tag (tag.label)}
                <button
                        class={`
              ${getTextSizeClass(tag.frequency)}
              px-4 py-2
              dark:bg-primary-100 bg-primary-900
              dark:hover:bg-primary-400 hover:bg-primary-600
              dark:text-primary-900 text-primary-50
              rounded-full
              transition-all
              duration-200
              font-medium
            `}
                >
                    {tag.label} 
                </button>
            {/each}
        </div>
        <!--{JSON.stringify(tagWithFrequency, null, 2)}-->
    </div>
<!--    <ul class="list-disc">-->
<!--        {#each Object.keys(data.posts) as tag}-->
<!--            <li class="hover:underline">-->
<!--                <a href={`/tags/${tag}`}>{tag}</a>-->
<!--            </li>-->
<!--        {/each}-->
<!--    </ul>-->
</div>

