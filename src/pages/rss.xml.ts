import { getCollection } from 'astro:content';

const SITE = 'https://ashikur.safeshare.co';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET() {
  const pieces = (await getCollection('notebook')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const items = pieces.map((p) => `
    <item>
      <title>${esc(p.data.title)}</title>
      <link>${SITE}/notebook/${p.id}/</link>
      <guid isPermaLink="true">${SITE}/notebook/${p.id}/</guid>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
      <dc:creator>Md Ashikur Rahman</dc:creator>
      <description>${esc(p.data.summary || p.data.excerpt || '')}</description>
      ${p.data.tags.map((t) => `<category>${esc(t)}</category>`).join('')}
    </item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Notebook by Md Ashikur Rahman (Ashik)</title>
    <link>${SITE}/notebook/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Essays and notes by Md Ashikur Rahman (Ashik Ayon) from Rajshahi, Bangladesh.</description>
    <language>en</language>
    <managingEditor>ashikur.ayon190@gmail.com (Md Ashikur Rahman)</managingEditor>${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
