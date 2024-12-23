<script lang="ts">
    import { page } from '$app/stores';
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
    
    // Add this function to handle navigation link clicks
    function handleNavClick() {
        openMenu = false;
    }
</script>

<svelte:window {onclick} />
<div class="sticky top-0 z-50 shadow-sm shadow-primary-200 dark:shadow-primary-800 border-b-2 border-b-primary-50 dark:border-b-primary-900 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-950  dark:to-primary-900">
    <div class="container mx-auto flex py-2">
        <div>
            <a href="/">
                <img src="/images/logo.png" class="h-8" alt="firdausng logo" />
            </a>
        </div>
        <div class="hidden md:flex justify-center w-full gap-4 items-center">
            {#each navigations as nav (nav)}
                <a href={nav.path} class="block py-2 px-3 rounded bg-transparent {$page.url.pathname.startsWith(nav.path) ? 'text-primary-800 dark:text-primary-200 font-semibold underline underline-offset-4 decoration-primary-600/30': 'text-primary-900 dark:text-primary-50 '}  p-0" aria-current="page">{nav.name}</a>
            {/each}
            <SocialLink />
            <Theme />
        </div>

        <div class="flex flex-wrap md:hidden justify-end w-full gap-4 items-center">
            <button type="button" class="p-0" aria-label="Open Menu" onclick={() => openMenu = !openMenu} bind:this={burgerRef}>
                <span class="sr-only">Open Menu</span>
                <svg class="w-[30px] h-[30px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6"/>
                </svg>
            </button>
            <div class="w-full mx-2 bg-primary-50 dark:bg-primary-900 rounded-lg shadow-lg {openMenu? 'block': 'hidden'} transition-all duration-300 ease-in-out"
                 bind:this={menuRef}
            >

                {#each navigations as nav (nav)}
                    <a href={nav.path}
                       onclick={handleNavClick}
                       class="block py-2 px-3 rounded bg-transparent {$page.url.pathname.startsWith(nav.path) ? 'text-primary-800 dark:text-primary-200 font-semibold underline underline-offset-4 decoration-primary-600/30': 'text-primary-900 dark:text-primary-50 '}  p-0" aria-current="page"
                    >{nav.name}</a>
                {/each}


            </div>
        </div>

    </div>
</div>
