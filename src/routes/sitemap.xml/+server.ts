import { getPosts } from "$lib/utils/post.utils";
import { getSeries } from "$lib/utils/series.utils";

const site = 'https://firdausng.com';

type Entry = { path: string; lastmod?: string };

const staticEntries: Entry[] = [
    { path: '' },
    { path: '/posts' },
    { path: '/series' },
    { path: '/tags' },
    { path: '/about' },
];

const toIsoDate = (value?: string): string | undefined => {
    if (!value) return undefined;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toISOString().split('T')[0];
};

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const [posts, series] = await Promise.all([getPosts(), getSeries()]);

    const postEntries: Entry[] = posts.map((p) => ({
        path: p.slug,
        lastmod: toIsoDate(p.updated ?? p.date),
    }));

    const seriesEntries: Entry[] = series.map((s) => ({
        path: s.slug,
        lastmod: toIsoDate(s.updated ?? s.date),
    }));

    const body = sitemap([...staticEntries, ...postEntries, ...seriesEntries]);
    const response = new Response(body);
    response.headers.set('Cache-Control', 'max-age=0, s-maxage=3600');
    response.headers.set('Content-Type', 'application/xml');
    return response;
}

const sitemap = (entries: Entry[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
    .map(
        ({ path, lastmod }) => `  <url>
    <loc>${site}${path || '/'}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`
    )
    .join('\n')}
</urlset>`;
