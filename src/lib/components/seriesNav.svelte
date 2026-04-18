<script lang="ts">
	type SeriesData = {
		slug: string;
		title: string;
		url: string;
		parts: Post[];
		currentIndex: number;
		prev: Post | null;
		next: Post | null;
	};

	let { series, variant }: { series: SeriesData; variant: 'banner' | 'pager' } = $props();
</script>

{#if variant === 'banner'}
	<div class="font-mono text-xs text-gray-400 dark:text-gray-500">
		Part <span class="text-gray-600 dark:text-gray-300">{series.currentIndex + 1}</span> of <span class="text-gray-600 dark:text-gray-300">{series.parts.length}</span> in series:
		<a
			href={series.url}
			class="text-primary-700 dark:text-primary-200 hover:underline underline-offset-2"
		>{series.title}</a>
	</div>
{:else if variant === 'pager'}
	<nav
		aria-label="Series navigation"
		class="not-prose mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs"
	>
		{#if series.prev}
			<a
				href={series.prev.slug}
				class="block border border-primary-300 dark:border-primary-700 rounded-md p-4 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
			>
				<div class="text-gray-400 dark:text-gray-500 mb-1">&larr; Previous</div>
				<div class="text-primary-700 dark:text-primary-200">{series.prev.title}</div>
			</a>
		{:else}
			<div></div>
		{/if}
		{#if series.next}
			<a
				href={series.next.slug}
				class="block border border-primary-300 dark:border-primary-700 rounded-md p-4 hover:border-primary-500 dark:hover:border-primary-400 transition-colors sm:text-right"
			>
				<div class="text-gray-400 dark:text-gray-500 mb-1">Next &rarr;</div>
				<div class="text-primary-700 dark:text-primary-200">{series.next.title}</div>
			</a>
		{:else}
			<div></div>
		{/if}
	</nav>
{/if}
