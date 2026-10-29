import { siteConfig } from "@/config/site";
import { sortedPosts } from "@/data/posts";

// Written once at build time into out/rss.xml.
export const dynamic = "force-static";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 feed of the blog, newest first, linking to the Korean post pages. */
export function GET() {
  const posts = sortedPosts();
  const items = posts
    .map((post) => {
      const link = `${siteConfig.url}/ko/blog/${post.slug}`;
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00+09:00`).toUTCString()}</pubDate>
      <description>${escape(post.summary)}</description>
${post.tags.map((tag) => `      <category>${escape(tag)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${siteConfig.author.name.en} (${siteConfig.author.alias})`)}</title>
    <link>${siteConfig.url}/ko/blog</link>
    <atom:link href="${siteConfig.social.rss}" rel="self" type="application/rss+xml" />
    <description>${escape(siteConfig.seo.description)}</description>
    <language>ko</language>
    <lastBuildDate>${posts.length ? new Date(`${posts[0].date}T00:00:00+09:00`).toUTCString() : new Date(0).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
