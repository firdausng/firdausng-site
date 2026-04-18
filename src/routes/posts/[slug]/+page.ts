import { error } from "@sveltejs/kit"
import type { ServerLoadEvent } from "@sveltejs/kit"
import { getSeriesMeta, getSeriesPartsBySlug } from "$lib/utils/series.utils"
import { getPosts, getRelatedPosts } from "$lib/utils/post.utils"

export const load = async ({ params }: ServerLoadEvent) => {
    try {
        const post = await import(`../../../posts/${params.slug}.md`)
        const meta = post.metadata as Post
        const currentSlug = `/posts/${params.slug}`

        let series = null
        if (meta.series) {
            const [seriesMeta, parts] = await Promise.all([
                getSeriesMeta(meta.series),
                getSeriesPartsBySlug(meta.series),
            ])

            if (seriesMeta && parts.length) {
                const currentIndex = parts.findIndex((p) => p.slug === currentSlug)
                series = {
                    slug: meta.series,
                    title: seriesMeta.title,
                    url: seriesMeta.slug,
                    parts,
                    currentIndex,
                    prev: currentIndex > 0 ? parts[currentIndex - 1] : null,
                    next: currentIndex >= 0 && currentIndex < parts.length - 1 ? parts[currentIndex + 1] : null,
                }
            }
        }

        const allPosts = await getPosts()
        const related = getRelatedPosts({ ...meta, slug: currentSlug }, allPosts, 3)

        return {
            content: post.default,
            meta,
            series,
            related,
        }
    } catch (e) {
        throw error(404, `Could not find ${params.slug}`)
    }
}
