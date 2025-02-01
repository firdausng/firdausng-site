export async function getPosts() {
    let posts: Post[] = []
    const paths = import.meta.glob("/src/posts/*.md", { eager: true })

    for (const path in paths) {
        const file = paths[path]
        const slug = path.split("/").at(-1)?.replace(".md", "")

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
        const slug = path.split("/").at(-1)?.replace(".md", "")

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