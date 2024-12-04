<script lang="ts">
	import '../app.css';
    import NavBar from '$lib/components/navBar.svelte';
    import Footer from '$lib/components/footer.svelte';
    import {title} from "$lib/config";
    
	let { children } = $props();
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
