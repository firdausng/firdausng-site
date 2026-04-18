<script lang="ts">
	interface Heading {
		depth: number;
		id: string;
		text: string;
	}

	let { headings = [] }: { headings?: Heading[] } = $props();
	let active = $state<string | null>(null);

	$effect(() => {
		if (headings.length < 3) return;

		const targets = headings
			.map((h) => document.getElementById(h.id))
			.filter((el): el is HTMLElement => el !== null);

		if (!targets.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((e) => e.isIntersecting);
				if (visible.length) {
					active = visible[0].target.id;
				}
			},
			{ rootMargin: '-20% 0% -70% 0%' }
		);

		targets.forEach((t) => observer.observe(t));
		return () => observer.disconnect();
	});
</script>

{#if headings.length >= 3}
	<nav class="font-mono text-xs space-y-1.5">
		<div class="text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">On this page</div>
		{#each headings as h (h.id)}
			<a
				href={`#${h.id}`}
				class="block transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-primary-950 {active === h.id
					? 'text-primary-700 dark:text-primary-200'
					: 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}"
				style:padding-left={`${(h.depth - 2) * 0.75}rem`}
			>
				{h.text}
			</a>
		{/each}
	</nav>
{/if}
