<script lang="ts">
	import { formatDate } from "$lib/utils.js";

	let { post }: { post: Post } = $props();

	const visibleCategories = $derived((post.categories ?? []).slice(0, 3));
	const extraCategoryCount = $derived(Math.max(0, (post.categories?.length ?? 0) - 3));
</script>

<a
	class="flex flex-col h-full group/card rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-primary-950/80 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-primary-950"
	href={post.slug}
>
	<!-- Terminal title bar -->
	<div class="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/60 border-b border-primary-200 dark:border-primary-700">
		<span class="font-mono text-xs text-primary-600 dark:text-primary-300 truncate">
			<span class="hidden sm:inline">~/posts/</span>{post.slug.replace(/^\/posts\//, '')}
		</span>
		<span class="ml-auto flex items-center gap-2 text-primary-400 dark:text-primary-500 shrink-0">
			<span class="text-[0.65rem]">&#x2500;</span>
			<span class="text-[0.65rem]">&#x25A1;</span>
			<span class="text-xs">&times;</span>
		</span>
	</div>

	<!-- Body -->
	<div class="flex-1 p-4 space-y-2">
		<h3 class="font-mono text-base font-bold text-primary-800 dark:text-primary-200 line-clamp-2" data-toc-ignore>
			{post.title}
		</h3>
		{#if post.description}
			<p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
				{post.description}
			</p>
		{/if}

		{#if visibleCategories.length}
			<div class="flex flex-wrap gap-1.5 pt-1">
				{#each visibleCategories as category (category)}
					<span class="font-mono text-[0.65rem] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
						{category}
					</span>
				{/each}
				{#if extraCategoryCount > 0}
					<span class="font-mono text-[0.65rem] px-1.5 py-0.5 text-gray-500 dark:text-gray-400">
						+{extraCategoryCount} more
					</span>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Footer -->
	<div class="px-4 py-2.5 border-t border-primary-100 dark:border-primary-800 font-mono text-[0.65rem] text-gray-400 dark:text-gray-500">
		CREATED <span class="text-gray-600 dark:text-gray-300">{formatDate(post.date)}</span>
	</div>
</a>
