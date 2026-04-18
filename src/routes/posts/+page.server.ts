import type { ServerLoadEvent } from "@sveltejs/kit";
import { getPosts } from "$lib/utils/post.utils"
import { getSeries, getSeriesPartsBySlug } from "$lib/utils/series.utils"

export async function load({ fetch }: ServerLoadEvent) {
    const posts: Post[] = await getPosts();

    const counts = new Map<string, number>();
    for (const p of posts) {
        for (const c of p.categories ?? []) {
            counts.set(c, (counts.get(c) ?? 0) + 1);
        }
    }
    const categories = [...counts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const seriesIndexes = await getSeries();
    const series = await Promise.all(
        seriesIndexes.map(async (s) => {
            const slug = s.slug.replace(/^\/series\//, "");
            const parts = await getSeriesPartsBySlug(slug);
            return { slug: s.slug, title: s.title, partCount: parts.length };
        })
    );

    return { posts, categories, series }
}
