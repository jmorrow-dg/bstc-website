import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface EventFrontmatter {
  title: string;
  slug: string;
  date: string;
  time: string;
  venue: string;
  type: "networking" | "roundtable" | "builder-session" | "how-i-build-with-ai";
  status: "upcoming" | "completed";
  capacity: number;
  rsvpUrl: string;
  coverImage?: string;
  description: string;
  builder?: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
    linkedin?: string;
    bio?: string;
  };
  sponsor?: {
    name: string;
    logo: string;
  };
  recap?: {
    attendees: number;
    rating: number;
    keyTakeaways: string[];
    photos: string[];
    videoUrl?: string;
    podcastUrl?: string;
    transcript?: string;
  };
  tools?: string[];
  seo?: {
    title: string;
    description: string;
    keywords?: string[];
  };
}

export interface BlogFrontmatter {
  title: string;
  slug: string;
  date: string;
  author: string;
  authorRole?: string;
  category: "event-recap" | "founder-story" | "guide" | "tools" | "thought-leadership" | "bali-tech-scene";
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  readTime?: string;
  keyTakeaways?: string[];
  faq?: { question: string; answer: string }[];
  seo?: {
    title: string;
    description: string;
    keywords?: string[];
  };
}

export interface ContentItem<T> {
  frontmatter: T;
  content: string;
  htmlContent: string;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

function getContentFiles(subdir: string): string[] {
  const dir = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

export async function getContentBySlug<T>(
  subdir: string,
  slug: string
): Promise<ContentItem<T> | null> {
  const filePath = path.join(CONTENT_DIR, subdir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const htmlContent = await markdownToHtml(content);

  return {
    frontmatter: data as T,
    content,
    htmlContent,
  };
}

export async function getAllContent<T>(
  subdir: string
): Promise<ContentItem<T>[]> {
  const files = getContentFiles(subdir);
  const items = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.md$/, "");
      return getContentBySlug<T>(subdir, slug);
    })
  );
  return items.filter(Boolean) as ContentItem<T>[];
}

export async function getAllEvents(): Promise<ContentItem<EventFrontmatter>[]> {
  const events = await getAllContent<EventFrontmatter>("events");
  return events.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export async function getEventBySlug(
  slug: string
): Promise<ContentItem<EventFrontmatter> | null> {
  return getContentBySlug<EventFrontmatter>("events", slug);
}

export async function getAllBlogPosts(): Promise<
  ContentItem<BlogFrontmatter>[]
> {
  const posts = await getAllContent<BlogFrontmatter>("blog");
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export async function getBlogPostBySlug(
  slug: string
): Promise<ContentItem<BlogFrontmatter> | null> {
  return getContentBySlug<BlogFrontmatter>("blog", slug);
}

export function getUpcomingEvents(
  events: ContentItem<EventFrontmatter>[]
): ContentItem<EventFrontmatter>[] {
  return events
    .filter((e) => e.frontmatter.status === "upcoming")
    .sort(
      (a, b) =>
        new Date(a.frontmatter.date).getTime() -
        new Date(b.frontmatter.date).getTime()
    );
}

export function getPastEvents(
  events: ContentItem<EventFrontmatter>[]
): ContentItem<EventFrontmatter>[] {
  return events.filter((e) => e.frontmatter.status === "completed");
}

export function getHIWAEvents(
  events: ContentItem<EventFrontmatter>[]
): ContentItem<EventFrontmatter>[] {
  return events.filter((e) => e.frontmatter.type === "how-i-build-with-ai");
}

export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatEventType(type: string): string {
  const labels: Record<string, string> = {
    networking: "Networking Night",
    roundtable: "Founder Roundtable",
    "builder-session": "Builder Session",
    "how-i-build-with-ai": "How I Build with AI",
  };
  return labels[type] || type;
}

// ---- Member resource hub content ----

export interface PromptFrontmatter {
  title: string;
  slug: string;
  category: "sales" | "marketing" | "product" | "fundraising" | "operations" | "ai-workflow";
  excerpt: string;
  useCase?: string;
  tags?: string[];
  author?: string;
  date: string;
}

export interface PerkFrontmatter {
  title: string;
  slug: string;
  partner?: string;
  category: "local" | "software";
  offer: string;
  url?: string;
  code?: string;
  logo?: string;
  status?: "live" | "coming-soon";
  date: string;
}

export async function getAllPrompts(): Promise<ContentItem<PromptFrontmatter>[]> {
  const prompts = await getAllContent<PromptFrontmatter>("members/prompts");
  return prompts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

export async function getPromptBySlug(
  slug: string
): Promise<ContentItem<PromptFrontmatter> | null> {
  return getContentBySlug<PromptFrontmatter>("members/prompts", slug);
}

export async function getAllPerks(): Promise<ContentItem<PerkFrontmatter>[]> {
  const perks = await getAllContent<PerkFrontmatter>("members/perks");
  // Live perks first, then coming-soon; newest within each group.
  return perks.sort((a, b) => {
    const rank = (s?: string) => (s === "coming-soon" ? 1 : 0);
    const diff = rank(a.frontmatter.status) - rank(b.frontmatter.status);
    if (diff !== 0) return diff;
    return (
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
  });
}
