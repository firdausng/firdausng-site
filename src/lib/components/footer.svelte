<script lang="ts">
    import SocialLink from './social-link.svelte';
    import {navigations} from "$lib/config";

    const year = new Date().getFullYear();
</script>
<footer class="border-t border-primary-200 dark:border-primary-700 bg-white/90 dark:bg-primary-950/90">
    <div class="container mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between font-mono text-xs">
        <div class="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-green-400"></span>
                <span class="text-green-600 dark:text-green-400">Up</span>
            </span>
            <span class="text-primary-600 dark:text-primary-300">firdausng</span>
            <span class="hidden sm:inline">since <span class="text-gray-600 dark:text-gray-300">2012</span></span>
        </div>
        <div class="flex gap-3">
            <SocialLink />
        </div>
        <div class="flex flex-wrap items-center gap-1 text-gray-500 dark:text-gray-400">
            PORTS
            {#each navigations as nav, i (nav)}
                <a href={nav.path}
                   class="px-1 text-primary-500 hover:text-primary-400 transition-colors">
                    {5173 + i}-&gt;{nav.name.toLowerCase()}
                </a>
            {/each}
        </div>
    </div>
</footer>
