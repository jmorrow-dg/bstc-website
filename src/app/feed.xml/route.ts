import { getAllBlogPosts, getAllEvents, getUpcomingEvents } from "@/lib/content";
import { SITE } from "@/lib/constants";

export const revalidate = 3600;

export async function GET() {
  const posts = await getAllBlogPosts();
  const events = await getAllEvents();
  const upcomingEvents = getUpcomingEvents(events);

  const postItems = posts.map((post) => {
    const p = post.frontmatter;
    return `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE.url}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE.url}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt}]]></description>
      <author>${p.author}</author>
      <category>${p.category}</category>
    </item>`;
  });

  const eventItems = upcomingEvents.map((event) => {
    const e = event.frontmatter;
    return `    <item>
      <title><![CDATA[Event: ${e.title}]]></title>
      <link>${SITE.url}/events/${e.slug}</link>
      <guid isPermaLink="true">${SITE.url}/events/${e.slug}</guid>
      <pubDate>${new Date(e.date).toUTCString()}</pubDate>
      <description><![CDATA[${e.description}]]></description>
      <category>event</category>
    </item>`;
  });

  const allItems = [...postItems, ...eventItems].join("\n");

  // UNVERIFIED: carried over from the live site, confirm before launch (25 Oct 2026 audit)
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.fullName} - BSTC Weekly</title>
    <link>${SITE.url}</link>
    <description>Blog posts, event updates, and founder insights from Bali Startup & Tech, a founder-led community with 2,700+ members on Meetup.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE.url}/images/logo.png</url>
      <title>${SITE.fullName}</title>
      <link>${SITE.url}</link>
    </image>
${allItems}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
