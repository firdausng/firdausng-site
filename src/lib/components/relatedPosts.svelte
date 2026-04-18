<script lang="ts">
	let { posts }: { posts: Post[] } = $props();
</script>

{#if posts.length}
	<section class="not-prose mt-8" aria-labelledby="related-posts-heading">
		<h2
			id="related-posts-heading"
			class="font-mono text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3"
		>
			Related posts
		</h2>
		<ul class="space-y-2">
			{#each posts as p (p.slug)}
				<li>
					<a
						href={p.slug}
						class="block border border-primary-300 dark:border-primary-700 rounded-md p-4 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
					>
						<div class="font-mono text-sm text-primary-700 dark:text-primary-200 mb-1">
							{p.title}
						</div>
						{#if p.description}
							<div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
								{p.description}
							</div>
						{/if}
						{#if p.categories?.length}
							<div class="mt-2 flex flex-wrap gap-1.5 font-mono text-[0.65rem]">
								{#each p.categories as c (c)}
									<span class="text-blue-600 dark:text-blue-300">{c}</span>
								{/each}
							</div>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}
