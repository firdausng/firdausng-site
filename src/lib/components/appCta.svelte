<script lang="ts">
	import { APPS, type AppKey } from '$lib/config/apps';

	let { app }: { app: AppKey } = $props();
	const meta = APPS[app];
</script>

<aside
	class="my-8 not-prose border border-primary-300 dark:border-primary-700 rounded-md p-5 bg-primary-50/40 dark:bg-primary-900/30 font-mono text-sm"
>
	<div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
		This post is drawn from building {meta.name}.
	</div>
	<p class="text-gray-800 dark:text-gray-200 mb-3">{meta.tagline}</p>
	<a
		href={meta.url}
		target="_blank"
		rel="noopener"
		class="inline-block text-primary-700 dark:text-primary-200 underline underline-offset-4 decoration-primary-400 hover:decoration-primary-700"
	>
		Try {meta.name} &rarr;
	</a>
</aside>
