<script lang="ts">
    import { page } from '$app/stores';
    import SocialLink from './social-link.svelte';
    import Theme from './theme.svelte';
    import {navigations} from "$lib/config";
    
</script>

<div class="container mx-auto flex py-2">
    <div>
        <a href="/">
            <img src="/images/logo.png" class="h-8" alt="firdausng logo" />
        </a>
    </div>
    <div class="flex justify-center w-full gap-4 items-center">
        {#each navigations as nav (nav)}
            <a href={nav.path} class="block py-2 px-3 rounded bg-transparent {$page.url.pathname.startsWith(nav.path) ? 'text-primary-800 dark:text-primary-200 font-semibold underline underline-offset-4 decoration-primary-600/30': 'text-primary-900 dark:text-primary-50 '}  p-0" aria-current="page">{nav.name}</a>
        {/each}
        <SocialLink />
        <Theme />
    </div>
    
</div>