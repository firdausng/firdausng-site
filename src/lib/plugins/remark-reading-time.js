import { toString } from 'mdast-util-to-string';

const WORDS_PER_MINUTE = 220;

/**
 * Remark plugin that estimates reading time from the post body and writes
 * `readingTime` (minutes, rounded, min 1) into vFile.data.fm so it lands
 * in the post module's exported `metadata`.
 *
 * Same constraint as remark-extract-headings: must be remark, not rehype,
 * because mdsvex serializes vFile.data.fm before user rehype plugins run.
 */
export function remarkReadingTime() {
	/**
	 * @param {any} tree
	 * @param {any} file
	 */
	return (tree, file) => {
		const text = toString(tree);
		const words = text.trim().split(/\s+/).filter(Boolean).length;
		const readingTime = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
		file.data.fm = { ...(file.data.fm ?? {}), readingTime };
	};
}
