import { error } from "@sveltejs/kit"
import type { ServerLoadEvent } from "@sveltejs/kit"
import { getSeriesPartsBySlug } from "$lib/utils/series.utils"

export const load = async ({ params }: ServerLoadEvent) => {
    try {
        const post = await import(`../../../series/${params.slug}.md`)
        const parts = await getSeriesPartsBySlug(params.slug as string)

        return {
            content: post.default,
            meta: post.metadata,
            parts,
            url: `/series/${params.slug}`,
        }
    } catch (e) {
        throw error(404, `Could not find ${params.slug}`)
    }
}
