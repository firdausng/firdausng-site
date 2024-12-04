<script lang="ts">
    import SocialLink from './social-link.svelte';
    import {navigations} from "$lib/config";
    
    const year = new Date().getFullYear();
</script>
<footer class="bg-primary-50 shadow dark:bg-primary-950 ">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-primary-800 sm:text-center dark:text-primary-200">© {year} <a href="https://firdausng.com/" class="hover:underline">Firdausng™</a>. All Rights Reserved.
    </span>
        <div class="flex gap-2">
            <SocialLink />
        </div>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-primary-500 dark:text-primary-400 sm:mt-0">
            {#each navigations as nav (nav)}
                <a href={nav.path} class="hover:underline me-4 md:me-6">{nav.name}</a>
            {/each}
<!--            <li>-->
<!--                <a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a>-->
<!--            </li>-->
<!--            <li>-->
<!--                <a href="#" class="hover:underline me-4 md:me-6">Licensing</a>-->
<!--            </li>-->
<!--            <li>-->
<!--                <a href="#" class="hover:underline">Contact</a>-->
<!--            </li>-->
        </ul>
    </div>
</footer>