import { MetadataRoute } from "next";
import { getAllEvents, getAllBlogPosts } from "@/lib/content";

const BASE_URL = "https://balistartupandtech.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getAllEvents();
  const posts = await getAllBlogPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/how-i-build-with-ai`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/community`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/join`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/sponsors`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/sponsors/apply`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/leadership`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${BASE_URL}/events/${event.frontmatter.slug}`,
    lastModified: new Date(event.frontmatter.date),
    changeFrequency: event.frontmatter.status === "upcoming" ? "weekly" as const : "monthly" as const,
    priority: 0.7,
  }));

  const hiwaPages: MetadataRoute.Sitemap = events
    .filter((e) => e.frontmatter.type === "how-i-build-with-ai")
    .map((event) => ({
      url: `${BASE_URL}/how-i-build-with-ai/${event.frontmatter.slug}`,
      lastModified: new Date(event.frontmatter.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.frontmatter.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...eventPages, ...hiwaPages, ...blogPages];
}
