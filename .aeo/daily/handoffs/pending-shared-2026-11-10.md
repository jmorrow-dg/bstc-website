# Decisions for Josh, 10 Nov 2026

Lane 5, prompt BSTC-3. Nothing below has been done. Draft only. No merge, no deploy, no Search Console write, no Vercel change.

1. Apex redirect. `https://balistartupandtech.com/` returns HTTP 307 to `https://www.balistartupandtech.com/` (checked 10 Nov 2026, 15:47 WITA). Change that Vercel domain setting from 307 to 308 (permanent)? Yes or no.
2. Sitemap submission. Live `/sitemap.xml` has 100 URLs. The lane prompt states that Search Console lists no sitemap. Submit `https://www.balistartupandtech.com/sitemap.xml` in Search Console? Yes or no. This run did not submit it.
3. Host impression window. The lane prompt gives 33 impressions on the apex and 238 on www, and a separate 13 Oct 2026 to 9 Nov 2026 baseline of 42 clicks, 1,741 impressions, CTR 2.41%, position 6.58. 33 plus 238 is 271, not 1,741. Confirm the date window for 33 and 238, and whether that split is the same property total. TODO(josh). This machine has no Search Console access, so the figures were not re-queried.
4. Citation engines. Q01 to Q18 across ChatGPT with search, Perplexity, Gemini, Claude and Google AI Overview are logged as 90 unavailable slots on 10 Nov 2026. No signed-in session was available, and a web search proxy was not used. Who should collect the 90 answers, and on which machine? Do not read the unavailable log as "BSTC was not cited."
5. Context gap. `~/orca/bstc-aeo/` and `.aeo/daily/support/` were not on this machine. The attached inputs were the 10 Nov status note and the crawl summary only. The day's file ownership table was not in the repo or the zip. Confirm lane 5 still owns the draft #41 measurement files. TODO(josh).
6. Where the main merge sits. `origin/main` `ef65f0d` is merged into this stacked branch only. It was not pushed onto held draft #41. Say if you want that merge on #41 itself.
