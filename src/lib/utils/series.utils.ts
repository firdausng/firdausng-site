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