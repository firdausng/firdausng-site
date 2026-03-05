<script lang="ts">
    let { name, description, tags, url, logo, status }: {
        name: string;
        description: string;
        tags: string[];
        url: string;
        logo: string;
        status: string;
    } = $props();
</script>

<a href={url} target="_blank" rel="noopener noreferrer"
   class="block group/card rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950/80 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 overflow-hidden">

    <!-- Terminal title bar -->
    <div class="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/60 border-b border-primary-200 dark:border-primary-700">
        <span class="font-mono text-sm text-primary-600 dark:text-primary-300">~/projects/{name.toLowerCase().replace(/\s+/g, '-')}</span>
        <span class="ml-auto flex items-center gap-3 text-primary-400 dark:text-primary-500">
            <span class="text-xs">&#x2500;</span>
            <span class="text-xs">&#x25A1;</span>
            <span class="text-sm">&times;</span>
        </span>
    </div>

    <!-- Status row -->
    <div class="px-4 py-1.5 bg-primary-50/50 dark:bg-primary-900/30 border-b border-primary-100 dark:border-primary-800 font-mono text-xs flex items-center gap-4">
        <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span class="text-green-600 dark:text-green-400">Live</span>
        </span>
    </div>

    <!-- Body -->
    <div class="p-5 space-y-4">
        <div class="flex items-center gap-3">
            <img src={logo} alt="{name} logo" class="w-8 h-8 object-contain rounded" />
            <h3 class="font-mono text-xl font-bold text-primary-800 dark:text-primary-200">{name}</h3>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>

        <!-- Container labels -->
        <div class="flex flex-wrap gap-2">
            {#each tags as tag}
                <span class="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {tag}
                </span>
            {/each}
        </div>
    </div>

    <!-- Footer -->
    <div class="px-4 sm:px-5 py-3 border-t border-primary-100 dark:border-primary-800 flex flex-wrap gap-2 sm:gap-0 sm:justify-between items-center font-mono text-xs">
        <span class="text-gray-400 dark:text-gray-500">STATUS <span class="text-green-600 dark:text-green-400">{status}</span></span>
        <span class="text-gray-400 dark:text-gray-500 hidden sm:inline"><span class="text-primary-600 dark:text-primary-300">{url.replace('https://', '')}</span></span>
        <span class="text-sm text-primary-500 group-hover/card:text-primary-400 transition-colors ml-auto sm:ml-0">
            visit &rarr;
        </span>
    </div>
</a>
