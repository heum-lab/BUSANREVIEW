import { getAllPosts, extractPlainText } from '@/lib/posts';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(): Promise<Response> {
  const posts = await getAllPosts();
  const latestDate = posts[0]?.createdAt ?? new Date().toISOString();
  const feedUrl = `${SITE_URL}/rss.xml`;

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.id}`;
      const pubDate = new Date(post.createdAt).toUTCString();
      const description = extractPlainText(post.content, 300);
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n');
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <author>${escapeXml(post.author)}</author>`,
        `      <description>${escapeXml(description)}</description>`,
        `      <content:encoded><![CDATA[${post.content}]]></content:encoded>`,
        categories,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_NAME)} 블로그</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
