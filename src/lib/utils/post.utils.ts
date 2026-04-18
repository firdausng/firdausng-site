export async function getPosts() {
    let posts: Post[] = []
    const paths = import.meta.glob("/src/posts/*.md", { eager: true })

    for (const path in paths) {
        const file = paths[path]
        const slug = "/posts/" + path.split("/").at(-1)?.replace(".md", "")

        if (file && typeof file === "object" && "metadata" in file && slug) {
            const metadata = file.metadata as Omit<Post, "slug">
            const post = { ...metadata, slug } satisfies Post
            if (post.published) {
                posts.push(post)
            }
        }
    }

    posts = posts.sort(
        (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
    )

    return posts
}


export async function getPostTags() {
    let posts: Post[] = []
    const paths = import.meta.glob("/src/posts/*.md", { eager: true })

    for (const path in paths) {
        const file = paths[path]
        const slug = "/posts/" + path.split("/").at(-1)?.replace(".md", "")

        if (file && typeof file === "object" && "metadata" in file && slug) {
            const metadata = file.metadata as Omit<Post, "slug">
            const post = { ...metadata, slug } satisfies Post
            if (post.published) {
                posts.push(post)
            }
        }
    }

    posts = posts.sort(
        (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
    )

    return groupPostsByCategory(posts)
}

/**
 * Returns posts most similar to `current` by Jaccard similarity over `categories`.
 * Excludes the current post, posts without categories, and posts in the same series
 * (the SeriesNav already handles intra-series navigation, so showing them again would
 * be redundant). Tie-broken by date descending. Returns [] if no candidate scores > 0.
 */
export function getRelatedPosts(current: Post, all: Post[], max = 3): Post[] {
    const currentCats = new Set(current.categories ?? [])
    if (currentCats.size === 0) return []

    const scored = all
        .filter((p) =>
            p.slug !== current.slug &&
            p.categories?.length &&
            !(current.series && p.series === current.series)
        )
        .map((p) => {
            const otherCats = new Set(p.categories ?? [])
            const intersection = [...currentCats].filter((c) => otherCats.has(c)).length
            const union = new Set([...currentCats, ...otherCats]).size
            return { post: p, score: intersection / union }
        })
        .filter((x) => x.score > 0)

    scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    })

    return scored.slice(0, max).map((x) => x.post)
}

function groupPostsByCategory(posts: Post[]) {
    // First, create pairs of [category, post] for each category in each post
    const categoryPostPairs = posts.flatMap(post =>
        post.categories?.map(category => {
            return {
                [category]: post
            };
        })
    );

    const grouped: { [p: string]: Post[] } = {};

    categoryPostPairs.filter(Boolean).forEach(item => {
        for (const key in item) {
            if (!grouped[key]) {
                grouped[key] = []; // Initialize array if key doesn't exist
            }
            grouped[key].push(item[key]); // Add the Post to the group
        }
    });
   return grouped;
}