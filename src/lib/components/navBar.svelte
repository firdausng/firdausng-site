<script lang="ts">
    import { page } from '$app/state';
    import { slide } from 'svelte/transition';
    import SocialLink from './social-link.svelte';
    import Theme from './theme.svelte';
    import {navigations} from "$lib/config";
    let openMenu = $state(false);
    let menuRef:any;
    let burgerRef:any;

    function onclick(event:MouseEvent) {
        if (openMenu && menuRef && !menuRef.contains(event.target) && !burgerRef.contains(event.target)) {
            openMenu = false;
        }
    }

    function handleNavClick() {
        openMenu = false;
    }
</script>

<svelte:window {onclick} />
<div class="sticky top-0 z-50 border-b border-primary-200 dark:border-primary-700 bg-white/90 dark:bg-primary-950/90 backdrop-blur-sm relative">
    <div class="container mx-auto flex items-center py-2 px-4">

        <!-- Logo / container identity -->
        <a href="/" class="flex items-center gap-2 font-mono text-sm shrink-0">
            <span class="w-2 h-2 rounded-full bg-green-400"></span>
            <img src="/images/logo.png" class="h-6" alt="firdausng logo" />
            <span class="text-primary-400 hidden sm:inline">/</span>
            <span class="text-primary-600 dark:text-primary-300 hidden sm:inline font-semibold">{page.url.pathname === '/' ? 'home' : page.url.pathname.slice(1).split('/')[0]}</span>
        </a>

        <!-- Desktop nav -->
        <div class="hidden md:flex justify-end w-full gap-1 items-center">
            {#each navigations.filter(n => n.featured) as nav (nav)}
                <a href={nav.path}
                   class="font-mono text-sm px-3 py-1.5 rounded-md transition-colors
                       {page.url.pathname.startsWith(nav.path)
                           ? 'bg-primary-100 dark:bg-primary-800/60 text-primary-700 dark:text-primary-200'
                           : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/40'}"
                   aria-current="page">
                    ./{nav.name.toLowerCase()}
                </a>
            {/each}
            <div class="w-px h-5 bg-primary-200 dark:bg-primary-700 mx-2"></div>
            <SocialLink />
            <Theme />
        </div>

        <!-- Mobile burger -->
        <div class="flex md:hidden justify-end w-full gap-3 items-center">
            <Theme />
            <button type="button" class="p-1.5 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/40 transition-colors" aria-label="Open Menu" onclick={(e) => { e.stopPropagation(); openMenu = !openMenu; }} bind:this={burgerRef}>
                <span class="sr-only">Open Menu</span>
                {#if openMenu}
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                {:else}
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                {/if}
            </button>
        </div>

    </div>

    <!-- Mobile floating dropdown -->
    {#if openMenu}
        <div class="md:hidden absolute left-4 right-4 top-full mt-1 z-50 rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-primary-950 shadow-xl overflow-hidden"
             transition:slide={{ duration: 200 }}
             bind:this={menuRef}>
            <!-- Title bar -->
            <div class="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/60 border-b border-primary-200 dark:border-primary-700 font-mono text-xs">
                <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-green-400"></span>
                    <span class="text-green-600 dark:text-green-400">Up</span>
                </span>
                <span class="text-primary-500">menu</span>
                <span class="ml-auto flex items-center gap-2 text-primary-400 dark:text-primary-500 shrink-0">
                    <span class="text-[10px]">&#x2500;</span>
                    <span class="text-[10px]">&#x25A1;</span>
                    <span class="text-xs">&times;</span>
                </span>
            </div>
            {#each navigations as nav (nav)}
                <a href={nav.path}
                   onclick={handleNavClick}
                   class="block font-mono text-sm py-2.5 px-4 transition-colors
                       {page.url.pathname.startsWith(nav.path)
                           ? 'bg-primary-50 dark:bg-primary-800/40 text-primary-700 dark:text-primary-200'
                           : 'text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/40'}"
                   aria-current="page">
                    <span class="text-green-500 mr-1">$</span> ./{nav.name.toLowerCase()}
                </a>
            {/each}
            <div class="flex items-center gap-4 px-4 py-2.5 border-t border-primary-100 dark:border-primary-800">
                <SocialLink />
            </div>
        </div>
    {/if}
</div>
