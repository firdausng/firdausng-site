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
    if (frequency >= 10) return 'text-2xl';
    if (frequency >= 8) return 'text-xl';
    if (frequency >= 4) return 'text-lg';
    if (frequency >= 2) return 'text-base';
    return 'text-sm';
};

function navigate(path: string) {
    goto(path)
}

</script>

<div class="container mx-auto">
    <div class="w-full max-w-4xl mx-auto p-8">
        <h2 class="text-2xl font-bold mb-6">Tags</h2>
        <div class="flex flex-wrap gap-3">
            {#each tagWithFrequency as tag (tag.label)}
                <button class={`
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
                        onclick={()=> navigate(`/tags/${tag.label}`)}
                >{tag.label}  ({tag.frequency})
                </button>
            {/each}
        </div>
        
        <div class="mt-4">
            {#each tagWithFrequency.sort((a, b) =>  b.frequency - a.frequency) as tag (tag)}
                <div class="my-4">
                    <h2 class="text-xl font-bold">{tag.label} ({tag.frequency})</h2>
                    <ul class="list-disc list-inside w-full">
                        {#each data.posts[tag.label] as post (post)}
                            <li class="w-full">
                                <a class="text-sm" href={`/posts/${post.slug}`}>{post.title}</a>
                            </li>
                        {/each}
                    </ul>
                    
                </div>
            {/each}
        </div>
    </div>
</div>

