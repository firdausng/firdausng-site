<script lang="ts">
    import {formatDate} from "$lib/utils.js";
    import {title, description, url} from "$lib/config";

    let {post}: { post: Post } = $props();
</script>

<svelte:head>
    <title>{title}</title>

    <meta name="description" content={description}/>

    <meta property="og:type" content="article"/>
    <meta property="og:url" content={`${url}/blog`}/>
    <meta property="og:title" content={title}/>
    <meta property="og:description" content={description}/>
    <meta property="og:site_name" content={title}/>
    <meta property="og:image" content="/blog-banner.webp"/>

    <meta name="twitter:site" content="@firdausng_byte"/>
    <meta name="twitter:creator" content="@firdausng_byte"/>
    <meta name="twitter:title" content={title}/>
    <meta name="twitter:description" content={description}/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:image:src" content="/blog-banner.webp"/>
    <meta name="twitter:widgets:new-embed-design" content="on"/>

    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)"/>
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)"/>
</svelte:head>

{#key post.slug}
    <a class="block group/card rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950/80 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 overflow-hidden" href={`${post.slug}`}>

        <!-- Terminal title bar -->
        <div class="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-50 dark:bg-primary-900/60 border-b border-primary-200 dark:border-primary-700">
            <span class="font-mono text-xs sm:text-sm text-primary-600 dark:text-primary-300 truncate"><span class="hidden sm:inline">~/posts/</span>{post.slug}</span>
            <span class="ml-auto flex items-center gap-3 text-primary-400 dark:text-primary-500">
                <span class="text-xs">&#x2500;</span>
                <span class="text-xs">&#x25A1;</span>
                <span class="text-sm">&times;</span>
            </span>
        </div>

        <!-- Body -->
        <div class="flex">
            {#if post.image}
                <div class="hidden md:block max-w-96 bg-cover bg-no-repeat bg-center">
                    <img class="object-cover h-full" src={post.image} alt={post.title}/>
                </div>
            {/if}

            <div class="grow p-5 space-y-4">
                <h3 class="font-mono text-xl font-bold text-primary-800 dark:text-primary-200" data-toc-ignore>{post.title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{post.description}</p>

                {#if post.categories}
                    <div class="flex flex-wrap gap-2">
                        {#each post.categories as category}
                            <span class="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                {category}
                            </span>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Footer — docker-style columns -->
        <div class="px-4 sm:px-5 py-3 border-t border-primary-100 dark:border-primary-800 flex flex-wrap gap-2 sm:gap-0 sm:justify-between items-center font-mono text-xs">
            <span class="text-gray-400 dark:text-gray-500">CREATED <span class="text-gray-600 dark:text-gray-300">{formatDate(post.date)}</span></span>
            <span class="text-gray-400 dark:text-gray-500 hidden sm:inline">BY <span class="text-gray-600 dark:text-gray-300">{post.author}</span></span>
            <span class="text-sm text-primary-500 group-hover/card:text-primary-400 transition-colors ml-auto sm:ml-0">
                read &rarr;
            </span>
        </div>
    </a>
{/key}
