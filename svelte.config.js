import adapter from "@sveltejs/adapter-auto"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { mdsvex, escapeSvelte } from "mdsvex"
import { bundledLanguages, getSingletonHighlighter } from "shiki"
import remarkUnwrapImages from "rehype-unwrap-images"
import remarkToc from "remark-toc"
import rehypeSlug from "rehype-slug"


const theme = "one-dark-pro";
/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: [".md", ".svx"],
	smartypants:true,
	highlight: {
		highlighter: async (code, lang = "text") => {
			const highlighter = await getSingletonHighlighter({
				themes: [theme],
				langs: Object.keys(bundledLanguages),
			})
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }))
			return `{@html \`${html}\` }`
		},
	},
	remarkPlugins: [remarkUnwrapImages, [remarkToc, { tight: true }]],
	rehypePlugins: [rehypeSlug],
}


/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [".svelte", ".md", ".svx"],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter(),
	},
};

export default config;
