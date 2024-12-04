<script lang="ts">

    import {darkMode} from "$lib/state/theme.svelte";

    $effect(()=>{
        // Check initial theme from localStorage or system preference
        darkMode.value = localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        updateTheme();
    })

    function toggleDarkMode() {
        darkMode.value = !darkMode.value;
        updateTheme();
    }

    function updateTheme() {
        if (darkMode.value) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }
</script>
<div>
    <button
            onclick={toggleDarkMode}
            class="flex items-center justify-center p-2 rounded-lg bg-primary-50 dark:bg-primary-950 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
            aria-label="Toggle dark mode"
    >
        {#if darkMode}
            <!-- Sun icon -->
            <svg class="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        {:else}
            <!-- Moon icon -->
            <svg class="w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        {/if}
    </button>
</div>