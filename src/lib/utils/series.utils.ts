export async function getSeries() {
    let series: Post[] = []
    const paths = import.meta.glob("/src/series/*.md", { eager: true })

    for (const path in paths) {
        const file = paths[path]
        const slug = "/series/" + path.split("/").at(-1)?.replace(".md", "")

        if (file && typeof file === "object" && "metadata" in file && slug) {
            const metadata = file.metadata as Omit<Post, "slug">
            const post = { ...metadata, slug } satisfies Post
            if (post.published) {
                series.push(post)
            }
        }
    }

    series = series.sort(
        (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
    )

    return series
}

/**
 * Returns published posts whose frontmatter `series:` matches the given slug,
 * sorted by their `order` field (ascending). Posts without `order` sort last.
 */
export async function getSeriesPartsBySlug(seriesSlug: string): Promise<Post[]> {
    const parts: Post[] = []
    const paths = import.meta.glob("/src/posts/*.md", { eager: true })

    for (const path in paths) {
        const file = paths[path]
        const slug = "/posts/" + path.split("/").at(-1)?.replace(".md", "")

        if (file && typeof file === "object" && "metadata" in file && slug) {
            const metadata = file.metadata as Omit<Post, "slug">
            const post = { ...metadata, slug } satisfies Post
            if (post.published && post.series === seriesSlug) {
                parts.push(post)
            }
        }
    }

    parts.sort((a, b) => (a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY))

    return parts
}

/**
 * Returns the series index page metadata for a given series slug, or null if missing.
 */
export async function getSeriesMeta(seriesSlug: string): Promise<Post | null> {
    const paths = import.meta.glob("/src/series/*.md", { eager: true })
    const targetPath = Object.keys(paths).find((p) => p.endsWith(`/${seriesSlug}.md`))
    if (!targetPath) return null

    const file = paths[targetPath]
    if (file && typeof file === "object" && "metadata" in file) {
        const metadata = file.metadata as Omit<Post, "slug">
        return { ...metadata, slug: `/series/${seriesSlug}` } satisfies Post
    }
    return null
}