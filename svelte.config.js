import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { mdsvex, escapeSvelte } from "mdsvex"
import { bundledLanguages, getSingletonHighlighter } from "shiki"
import remarkUnwrapImages from "rehype-unwrap-images"
import remarkToc from "remark-toc"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeExternalLinks from "rehype-external-links"
import { remarkExtractHeadings } from "./src/lib/plugins/remark-extract-headings.js"
import { remarkReadingTime } from "./src/lib/plugins/remark-reading-time.js"


const theme = "one-dark-pro";

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({
	'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]))

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: [".md", ".svx"],
	smartypants:true,
	highlight: {
		highlighter: async (code, lang = "text", meta = "") => {
			const highlighter = await getSingletonHighlighter({
				themes: [theme],
				langs: Object.keys(bundledLanguages),
			})
			const shikiHtml = highlighter.codeToHtml(code, { lang, theme })

			const fileMatch = (meta || "").match(/file=("[^"]+"|\S+)/)
			const filename = fileMatch ? fileMatch[1].replace(/^"|"$/g, '') : ''
			const showLang = lang && lang !== 'text'
			const showHeader = Boolean(filename || showLang)

			let header = ''
			if (showHeader) {
				const filePart = filename
					? `<span class="code-block-filename">${escapeHtml(filename)}</span>`
					: '<span></span>'
				const langPart = showLang
					? `<span class="code-block-lang">${escapeHtml(lang)}</span>`
					: ''
				header = `<div class="code-block-header">${filePart}${langPart}</div>`
			}

			const wrapped = `<div class="code-block">${header}${shikiHtml}</div>`
			const html = escapeSvelte(wrapped)
			return `{@html \`${html}\` }`
		},
	},
	remarkPlugins: [remarkUnwrapImages, [remarkToc, { tight: true }], remarkExtractHeadings, remarkReadingTime],
	rehypePlugins: [
		rehypeSlug,
		[rehypeAutolinkHeadings, {
			behavior: 'append',
			properties: { class: 'heading-anchor', 'aria-label': 'Permalink' },
			content: { type: 'text', value: ' #' }
		}],
		[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
	],
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
