import { visit } from 'unist-util-visit';
import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';

/**
 * Remark plugin that walks h2/h3 headings in the markdown AST,
 * computes the same slug ids that rehype-slug will later assign,
 * and stuffs the result into vFile.data.fm.headings so it lands
 * in the post module's exported `metadata`.
 *
 * Must run as a remark plugin (not rehype) because mdsvex serializes
 * `vFile.data.fm` into the metadata script BEFORE user rehype plugins run.
 */
export function remarkExtractHeadings() {
	/**
	 * @param {any} tree
	 * @param {any} file
	 */
	return (tree, file) => {
		const slugger = new GithubSlugger();
		/** @type {{ depth: number; id: string; text: string }[]} */
		const headings = [];
		visit(tree, 'heading', (/** @type {any} */ node) => {
			if (node.depth !== 2 && node.depth !== 3) return;
			const text = toString(node).trim();
			if (!text) return;
			if (/^table of contents$/i.test(text)) return;
			const id = slugger.slug(text);
			headings.push({ depth: node.depth, id, text });
		});
		file.data.fm = { ...(file.data.fm ?? {}), headings };
	};
}
