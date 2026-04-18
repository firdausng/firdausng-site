<script lang="ts">
	type Category = { name: string; count: number };
	type SeriesEntry = { slug: string; title: string; partCount: number };

	let {
		categories,
		series
	}: { categories: Category[]; series: SeriesEntry[] } = $props();
</script>

<div class="space-y-6 font-mono text-xs">
	{#if categories.length}
		<section aria-labelledby="sidebar-topics-heading">
			<h2
				id="sidebar-topics-heading"
				class="text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2"
			>
				Topics
			</h2>
			<ul class="space-y-1.5">
				{#each categories as c (c.name)}
					<li class="flex justify-between gap-3">
						<a
							href={`/tags/${c.name}`}
							class="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-primary-950 truncate"
						>{c.name}</a>
						<span class="text-gray-400 dark:text-gray-600 tabular-nums">{c.count}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if series.length}
		<section aria-labelledby="sidebar-series-heading">
			<h2
				id="sidebar-series-heading"
				class="text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2"
			>
				Series
			</h2>
			<ul class="space-y-1.5">
				{#each series as s (s.slug)}
					<li class="flex justify-between gap-3">
						<a
							href={s.slug}
							class="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-primary-950 truncate"
						>{s.title}</a>
						<span class="text-gray-400 dark:text-gray-600 tabular-nums shrink-0">{s.partCount}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
