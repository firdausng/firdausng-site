<script lang="ts">
    import {title} from "$lib/config";
    let { data } = $props();
</script>

<svelte:head>
    <title>{title} - Test</title>
</svelte:head>

<div class="flex flex-col gap-2 items-center relative text-primary-200 p-2 container mx-auto">
    <pre>{JSON.stringify(data.test, null, 2)}</pre>
    <p>{data.MY_VARIABLE}</p>
    <p>{data.my_secret}</p>
</div>