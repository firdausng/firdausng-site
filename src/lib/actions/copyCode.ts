import type { Action } from 'svelte/action';

export const copyCode: Action<HTMLElement> = (node) => {
	const buttons: HTMLButtonElement[] = [];
	const timers = new Set<ReturnType<typeof setTimeout>>();

	node.querySelectorAll('pre').forEach((pre) => {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'copy-code-btn';
		btn.textContent = 'copy';
		btn.setAttribute('aria-label', 'Copy code to clipboard');

		btn.addEventListener('click', async () => {
			const code = pre.querySelector('code')?.textContent ?? '';
			await navigator.clipboard.writeText(code);
			btn.textContent = 'copied';
			btn.classList.add('copied');
			const t = setTimeout(() => {
				btn.textContent = 'copy';
				btn.classList.remove('copied');
				timers.delete(t);
			}, 1500);
			timers.add(t);
		});

		pre.style.position = 'relative';
		pre.appendChild(btn);
		buttons.push(btn);
	});

	return {
		destroy() {
			timers.forEach(clearTimeout);
			buttons.forEach((b) => b.remove());
		}
	};
};
