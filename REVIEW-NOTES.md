# Global league redesign: review notes

Branch `lachlan/global-league`, prepared 25 to 26 Oct 2026 for Josh. Safe to delete once the PR is reviewed.

## What changed

- Sitewide reskin to the Season kit: paper ground, navy text, Garuda red, Big Shoulders Display and Archivo. The old Tailwind token names (`brand-charcoal`, `brand-white`, `brand-grey`) are remapped in `tailwind.config.ts`, so every page restyles without a rewrite. Translucent white utilities were mapped to navy (`ink`) equivalents.
- New Navbar and Footer: every existing link is kept. Nav adds Members and Perks. Footer adds About, Perks and Remote Builders.
- New homepage (`src/app/page.tsx`): all 13 previous blocks are kept, plus the Members, perks teaser, guides hub and visible FAQ sections.
- New `/perks` route with all 128 perks (66 open, 62 examples), filters, its own canonical and breadcrumb schema. It's in the sitemap and `llms.txt`.
- Numbers: Meetup, fetched 25 Oct 2026: 2,734 members, rating 4.7 from 155 ratings, 54 past events. The site shows 2,700+ members, 4.7 from 155 ratings and 50+ events.

## UNVERIFIED markers (claims carried over from the live site)

Every instance below is kept word for word and marked in code with `UNVERIFIED: carried over from the live site, confirm before launch (25 Oct 2026 audit)`. Each needs a decision before launch: keep, soften or source.

| File:line (marker) | Claim |
|---|---|
| src/app/page.tsx:46 | HOMEPAGE_FAQS (visible FAQ and FAQPage schema): "Southeast Asia's largest", "2,500+ funded founders", "ex-FAANG", "40+ countries", "40 to 80", "active nodes in Ubud, Sanur, and Uluwatu", "every third Thursday" |
| src/app/page.tsx:265 | Scoreboard: 40+ countries represented |
| src/app/page.tsx:366 | Networking Night format: "40-80", "Every 3rd Thursday" |
| src/app/page.tsx:387 | Who's in the room: 40 / 25 / 10 / 25 |
| src/app/page.tsx:432 | Members building at: Ex-Google, Ex-Meta, Ex-Stripe, Ex-Shopify, Ex-Uber, Ex-Grab, Ex-Sea, Ex-Gojek, YC Alumni, Techstars |
| src/app/page.tsx:748 | Visible FAQ list (same answers as line 46) |
| src/data/home.ts:3, 10, 42, 69 | Data behind the format, room and credibility blocks above |
| src/data/founders.ts:47 | Matthew Carr's bio: "across Bali nodes" (from /leadership) |
| src/components/layout/Footer.tsx:75 | "The largest founder-led tech community in Bali and Southeast Asia." |
| src/lib/constants.ts:21 | SITE.tagline "Southeast Asia's Largest Tech Community" |
| src/lib/constants.ts:24 | SITE.description: "Southeast Asia's largest", "40+ countries", "Funded founders, ex-FAANG engineers" (used in metadata and Organization schema) |
| src/lib/constants.ts:52 | STATS.countries = 40 (drives /about, /community, /sponsors and the homepage) |
| src/app/feed.xml/route.ts:38 | RSS description: "Bali's largest startup and tech community" |
| src/app/faq/page.tsx:30, 41, 52, 88, 94, 140 | FAQ answers: largest, Ubud/Sanur/Uluwatu events, ex-FAANG and funded founders, 40-80 people, every 3rd Thursday, 40+ countries |
| src/app/about/page.tsx:9 | Meta description: largest, 40+ countries |
| src/app/about/page.tsx:42 | H1 "Building Southeast Asia's #1 Tech Community" |
| src/app/about/page.tsx:46 | "builders from 40+ countries" |
| src/app/about/page.tsx:95 | "ex-FAANG engineers, funded startup founders" |
| src/app/about/page.tsx:104 | "active nodes in Ubud, Sanur, and Uluwatu. We are the largest..." |
| src/app/about/page.tsx:136 | Timeline: "Pilot nodes in Ubud and Sanur" |
| src/app/blog/page.tsx:9 | Meta description: "Southeast Asia's largest startup community" |
| src/app/contact/page.tsx:185 | "Events across Canggu, Ubud, Sanur & Uluwatu" |
| src/app/podcast/page.tsx:182 | "Engineers & developers (including ex-FAANG)" |
| src/app/sponsors/page.tsx:251, 408 | "40+ countries represented", "Based across 40+ countries" |
| src/app/community/page.tsx:98 | "the largest founder-led tech community in Bali and Southeast Asia" |
| src/app/community/page.tsx:130 | Countries stat counter |
| src/app/community/page.tsx:336 | Testimonial role "Ex-FAANG Engineer" |

These aren't marked in code, but still need checking:

- `public/llms.txt` (plain text, so it can't carry a code comment): line 3 "largest", "40+ countries", "ex-FAANG", the Ubud, Sanur and Uluwatu nodes; line 75 "nodes in Ubud, Sanur, and Uluwatu".
- `/sponsors`: "1,200+ operators on WhatsApp", "1,200+ WhatsApp Members", "100+ attendees / week", "Highest-Signal Founder Community" in the H1.
- `content/blog/*.md`: several posts repeat "largest" and the 2,500+ figure. Markdown content was left untouched.

## Other things to check

1. **Footer link targets kept as they were.** "Join" and "Member directory" still point to `SITE.joinForm` and `SITE.memberDirectory`, which are both the old Tally form. You'd probably want `/join` and `https://remotebuilders.io/directory/` instead. The homepage Members strip already links the Remote Builders directory.
2. **Homepage Join CTA now goes to `/join`** (the native form from #10) instead of the Tally URL.
3. **Homepage hero copy:** the old H1 ("Where Southeast Asia's Best Builders Actually Show Up") and the old lede are replaced by the approved H1 and lede. The old line "High-signal events. Zero noise." is kept.
4. **"Your spot in Members"** says a member gets their own page in the member directory once they've joined. That's a Remote Builders product promise: check that it holds.
5. **Member cities** (Canggu, Melbourne, London) come from each founder's Remote Builders directory profile. The live /leadership page doesn't state them.
6. **Perks:** HubSpot for Startups is one of the open programmes listed. The Airwallex offer mentions HubSpot partner perks.
7. **Pre-existing:** `/blog/living-in-bali` renders two H1s (the template's, plus a `#` heading inside the markdown).
8. **Not verified in a real browser:** rendering, font metrics and the 360px layout. Run the PR preview at 360px and in desktop widths before merging.
