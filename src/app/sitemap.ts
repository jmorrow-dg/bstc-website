import { MetadataRoute } from "next";
import { getAllEvents, getAllBlogPosts } from "@/lib/content";
import { CITY_COMPARISONS } from "@/data/city-comparisons";
import { SITE } from "@/lib/constants";
import { MIN_INDEXABLE_MEMBERS, getBaliMembers } from "@/lib/rb-directory";

import { getBaliDate, isValidEventDate } from "@/lib/event-status";

const BASE_URL = SITE.url;

// Daily, so /members joins the sitemap once the directory feed has enough Bali members.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = getBaliDate();
  // A future event date is not a modification, so it gets no lastmod.
  const eventLastModified = (date: string) =>
    today && isValidEventDate(date) && date <= today ? date : undefined;
  const events = await getAllEvents();
  const posts = await getAllBlogPosts();
  // /members is listed only once it has enough Bali members to be indexed.
  const { members } = await getBaliMembers();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/events`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/how-i-build-with-ai`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/community`, changeFrequency: "monthly", priority: 0.8 },
    // /join is left out: the join form it proxies serves noindex.
    { url: `${BASE_URL}/sponsors`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/sponsors/apply`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/leadership`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/perks`, changeFrequency: "weekly", priority: 0.7 },
    ...(members.length >= MIN_INDEXABLE_MEMBERS
      ? [{ url: `${BASE_URL}/members`, changeFrequency: "daily" as const, priority: 0.7 }]
      : []),
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/podcast`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/resources`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${BASE_URL}/events/${event.frontmatter.slug}`,
    lastModified: eventLastModified(event.frontmatter.updated || event.frontmatter.date),
    changeFrequency: event.frontmatter.status === "upcoming" ? "weekly" as const : "monthly" as const,
    priority: 0.7,
  }));

  // /how-i-build-with-ai/<slug> repeats /events/<slug> and canonicals to it,
  // so only the /events URL is listed.

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.frontmatter.slug}`,
    lastModified: post.frontmatter.updated || post.frontmatter.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const comparisonPages: MetadataRoute.Sitemap = CITY_COMPARISONS.map((c) => ({
    url: `${BASE_URL}/bali-vs/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...eventPages, ...blogPages, ...comparisonPages];
}
