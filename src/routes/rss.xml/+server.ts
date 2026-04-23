import { getPosts } from "$lib/utils/post.utils";

const site = 'https://firdausng.com';
const feedTitle = 'Firdausng';
const feedDescription = 'Practical posts on SvelteKit, Cloudflare Workers, Drizzle + D1, and related full-stack tooling.';
const author = 'Firdaus Kamaruddin';
const authorEmail = 'firdauskamaruddin@hotmail.com';

const escapeXml = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

const toRfc822 = (value: string): string => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return new Date().toUTCString();
    return d.toUTCString();
};

export async function GET() {
    const posts = await getPosts();
    const now = new Date().toUTCString();
    const latest = posts[0] ? toRfc822(posts[0].updated ?? posts[0].date) : now;

    const items = posts
        .map((post) => {
            const link = `${site}${post.slug}`;
            const pubDate = toRfc822(post.date);
            const categories = (post.categories ?? [])
                .map((c) => `      <category>${escapeXml(c)}</category>`)
                .join('\n');
            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
${categories}
      <dc:creator>${escapeXml(author)}</dc:creator>
    </item>`;
        })
        .join('\n');

    const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${site}</link>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(feedDescription)}</description>
    <language>en</language>
    <lastBuildDate>${latest}</lastBuildDate>
    <managingEditor>${authorEmail} (${author})</managingEditor>
    <webMaster>${authorEmail} (${author})</webMaster>
${items}
  </channel>
</rss>`;

    const response = new Response(body);
    response.headers.set('Content-Type', 'application/xml; charset=utf-8');
    response.headers.set('Cache-Control', 'max-age=0, s-maxage=3600');
    return response;
}
