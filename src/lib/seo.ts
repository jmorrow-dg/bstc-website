import type { Metadata } from "next";

// The root layout appends " | BSTC" to every page title. Titles that already
// name BSTC (many event and post SEO titles do) skip the template, so search
// results don't show "| BSTC Bali | BSTC".
export function pageTitle(title: string): Metadata["title"] {
  return /\bBSTC\b/.test(title) ? { absolute: title } : title;
}
