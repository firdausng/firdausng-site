<script lang="ts">
	import '../app.css';
    import posthog from 'posthog-js'
    import NavBar from '$lib/components/navBar.svelte';
    import Footer from '$lib/components/footer.svelte';
    import {title} from "$lib/config";
    import {onMount} from "svelte";
    import { browser, dev } from '$app/environment';
    
	let { children } = $props();

    onMount(() => {
        if (browser && !dev) {
            posthog.init(
                'phc_iadMgugWbqGMJ0mOWNWRyQsgEUis7RQvmgcjneaUWBo',
                {
                    api_host: 'https://us.i.posthog.com',
                    person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
                }
            )
        }
        return
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="flex flex-col justify-between h-screen">
    <NavBar />
    <main class="grow">
        {@render children()}
    </main>

    <Footer />  
</div>
