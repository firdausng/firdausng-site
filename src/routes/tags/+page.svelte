<script lang="ts">
import {goto} from "$app/navigation";

let {data} = $props();
let tagWithFrequency = Object.keys(data.posts).map(post => {
    return {
        label: post,
        frequency: data.posts[post].length
    }
});

const getTextSizeClass = (frequency:number) => {
    if (frequency >= 10) return 'text-lg';
    if (frequency >= 8) return 'text-base';
    if (frequency >= 4) return 'text-sm';
    return 'text-xs';
};

function navigate(path: string) {
    goto(path)
}
</script>

<div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
        <span class="font-mono text-primary-500 dark:text-primary-400 text-sm">$</span>
        <h1 class="font-mono text-lg md:text-3xl font-bold text-primary-800 dark:text-primary-200">ls tags/</h1>
        <div class="flex-1 border-t border-dashed border-primary-200 dark:border-primary-700"></div>
        <span class="font-mono text-xs text-gray-500 dark:text-gray-400">{tagWithFrequency.length} tags</span>
    </div>

    <!-- Namespace cloud -->
    <div class="flex flex-wrap gap-2 mb-10">
        {#each tagWithFrequency as tag (tag.label)}
            <button class={`${getTextSizeClass(tag.frequency)} font-mono px-3 py-1.5 rounded-lg border border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/60 transition-all duration-200 flex items-center gap-2`}
                    onclick={()=> navigate(`/tags/${tag.label}`)}>
                <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                {tag.label} <span class="text-primary-400 dark:text-primary-500">({tag.frequency})</span>
            </button>
        {/each}
    </div>

    <!-- Namespace groups -->
    <div class="space-y-4">
        {#each tagWithFrequency.sort((a, b) => b.frequency - a.frequency) as tag (tag)}
            <div class="rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950/80 overflow-hidden">
                <!-- Namespace header -->
                <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-primary-50 dark:bg-primary-900/60 border-b border-primary-200 dark:border-primary-700 font-mono text-xs">
                    <span class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-green-400"></span>
                        <span class="text-green-600 dark:text-green-400 hidden sm:inline">Active</span>
                    </span>
                    <span class="text-primary-600 dark:text-primary-300 font-semibold">{tag.label}</span>
                    <span class="text-gray-400 dark:text-gray-500">({tag.frequency})</span>
                    <span class="ml-auto flex items-center gap-2 text-primary-400 dark:text-primary-500">
                        <span class="text-[10px]">&#x2500;</span>
                        <span class="text-[10px]">&#x25A1;</span>
                        <span class="text-xs">&times;</span>
                    </span>
                </div>
                <div class="p-3 space-y-1">
                    {#each data.posts[tag.label] as post (post)}
                        <a href={`/posts/${post.slug}`}
                           class="block font-mono text-sm px-2 py-1.5 rounded hover:bg-primary-50 dark:hover:bg-primary-900/40 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></span>
                            {post.title}
                        </a>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>
