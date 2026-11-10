# Host and sitemap notes, 10 Nov 2026

Docs only. No Vercel setting was changed. No sitemap or URL was submitted. Search Console was not written to.

## What this run checked

Read only, 10 Nov 2026, 15:47 WITA (07:47 UTC).

- `https://balistartupandtech.com/` returned HTTP 307 to `https://www.balistartupandtech.com/`. Response server: Vercel. `cache-control: public, max-age=0, must-revalidate`.
- `https://www.balistartupandtech.com/` returned HTTP 200.
- `https://www.balistartupandtech.com/sitemap.xml` listed 100 URLs (`<loc>` count 100). A same-day `crawl.mjs` run also recorded 100 URLs, all HTTP 200.

## GSC baseline, 13 Oct 2026 to 9 Nov 2026

Source: the 10 Nov 2026 lane prompt. This machine has no Search Console access, so these figures were not re-queried.

| Metric | Figure |
| --- | --- |
| Clicks | 42 |
| Impressions | 1,741 |
| CTR | 2.41% |
| Average position | 6.58 |

42 divided by 1,741 is 2.41% when rounded to two decimal places. Position was not recomputed.

The same prompt states impressions on both hosts. It does not state the date window for this split. TODO(josh): confirm the window, and whether it is the same property total as the table above.

| Host | Impressions in the prompt |
| --- | --- |
| `https://balistartupandtech.com/` | 33 |
| `https://www.balistartupandtech.com/` | 238 |

33 plus 238 is 271, which is not 1,741. This note does not guess why.

The prompt also states that Search Console lists no sitemap. That screen was not opened here.

## Recommendation 1. Permanent apex redirect

Change the apex redirect from 307 (temporary) to 308 (permanent). This is a Vercel domain setting. Josh's yes is required before anyone changes it. This note does not change it.

A 307 leaves both hosts able to collect impressions. The prompt already shows impressions on the apex and on www. A 308 tells clients the www host is the permanent URL. No ranking or click forecast is claimed.

## Recommendation 2. Submit the sitemap

Submit `https://www.balistartupandtech.com/sitemap.xml` in Search Console. The live file has 100 URLs, and the prompt states that Search Console lists no sitemap. Josh's yes is required. This note does not submit the sitemap, any URL, or an IndexNow ping.

## Holds

Both recommendations wait for Josh. Until then, leave the 307 and do not submit the sitemap.
