# Blog Topics Backlog (BSTC AEO/SEO Content Engine)

How this works: two queues.

1. **Evergreen queue (`## Queue` below).** The scheduled content agent picks the **topmost unchecked topic**, drafts the post, commits and pushes it. When picked, the line is checked off so the next run picks the next one. Always keep 20+ topics queued. Evergreen SEO/AEO posts on SEA founder topics.

2. **Signals queue (`## Signals queue` at bottom).** Weekly timely news-react posts. The automated agent does NOT pick from this queue. Triggered by a human (or a separate signal run) when a news event lands. These refill the "This Week's Signal" slot on the homepage and feed BSTC Weekly.

## Editorial rules (the agent must follow)

- 1,200 to 2,200 words. Real depth, not fluff.
- Target a specific long-tail SEO query and one AEO question (a clear question with a clear, scannable answer in the first 200 words).
- Frontmatter must include: title, slug, date (today's date in YYYY-MM-DD), author "Josh Morrow", authorRole "Founder, BSTC", category, readTime, tags, excerpt, seo.title, seo.description, seo.keywords (6-10 keywords).
- Use H2 and H3 generously. Tables and bullet lists where the data fits.
- Include a TL;DR section near the top.
- End with an internal-link CTA to /events, /community, or /join, and link to 1-2 related posts on the BSTC blog.
- No em dashes anywhere. Use colons or commas.
- No emojis. No "in this article" preamble. Get to the point.
- British/international English (organisation, optimise, behaviour).
- Filename: `<slug>.md` in `content/blog/`.
- Slug is kebab-case, lowercase, no year unless the topic is dated.

## Queue (top of list runs next)

- [x] How much does it cost to live in Bali as a founder in 2026 (real numbers from BSTC members)
- [x] Bali vs Chiang Mai vs Lisbon for founders: an honest comparison
- [x] The Bali founder's tax guide: residency, NHR alternatives, and how to stay compliant
- [x] How to find a technical co-founder in Bali
- [x] Setting up a PT PMA in Indonesia: the real founder playbook
- [x] Best Bali villas for founder retreats and team offsites
- [x] How to run a hackathon in Bali: lessons from BSTC Hackathon Edition #1
- [ ] Bali angel investors: who's actually writing cheques in 2026
- [x] The SEA founder's guide to Singapore VCs: who invests, cheque sizes, how to pitch
- [x] Jakarta vs Bali for founders in 2026: capital, talent, and lifestyle compared
- [ ] Bangkok for tech founders: the honest 2026 guide (cost, visas, ecosystem)
- [ ] Manila vs Cebu: where should English-speaking founders build in the Philippines
- [ ] Kuala Lumpur for founders: the underrated SEA hub (MDEC, tax, visas)
- [ ] Ho Chi Minh City vs Hanoi: two founder hubs, two very different plays
- [ ] Da Nang for founders: Vietnam's quiet builder city
- [ ] How to hire engineers in Vietnam in 2026 (salaries, channels, EOR vs entity)
- [ ] How to hire engineers in the Philippines in 2026 (Cebu, Manila, remote)
- [ ] Tax residency playbook for SEA founders: Indonesia, Singapore, Thailand compared
- [ ] The state of Southeast Asia VC: who's deploying, what stage, what thesis
- [ ] Pre-seed to Series A in Southeast Asia: a 2026 founder's playbook
- [ ] Cross-border team setup in Southeast Asia: PT PMA vs Singapore Pte Ltd vs EOR
- [ ] The state of crypto and Web3 in Bali (2026)
- [ ] How to raise a pre-seed round from Southeast Asia
- [ ] Building an AI agency in Bali: the BSTC operator playbook
- [ ] Why Singapore founders are relocating to Bali in 2026
- [ ] Best cafes in Canggu for founder deep work
- [ ] How to hire your first 5 employees as a solo founder in Bali
- [ ] How to build distribution from Bali when your customers are in the US
- [ ] B2B SaaS pricing strategies for founders in emerging markets
- [ ] How BSTC vetted 12 dev shops in Indonesia: who actually delivers
- [ ] The founder's guide to Indonesian banking: Wise, Jenius, BCA, and what to actually use
- [ ] Visa runs are dead: the new reality of staying in Bali long-term
- [ ] How to get Indonesian press coverage for your startup
- [ ] The community-led growth playbook: lessons from BSTC's first 2,500 members
- [ ] How to host a tech event in Bali: venues, sponsors, logistics
- [ ] Indonesia's e-commerce founder boom: who's winning in 2026
- [ ] The Bali founder's guide to mental health and avoiding burnout
- [ ] How to find a co-working space that matches your work style
- [ ] Building a Discord vs WhatsApp community in Southeast Asia
- [ ] The honest cost of running monthly tech events (BSTC's open books)
- [ ] How to write a technical job post that actually attracts senior engineers
- [ ] Bali's solo founder economy: 2026 trends report
- [ ] What we learned from 12 months of How I Build with AI sessions

## Recently published (auto-appended by the agent)

- 2026-04-08 — best-coworking-spaces-bali-founders-2026
- 2026-04-08 — hiring-developers-indonesia-founders-guide-2026
- 2026-04-08 — cost-of-living-bali-founder-2026
- 2026-04-08 — bali-vs-chiang-mai-vs-lisbon-founders-2026
- 2026-04-09 — bali-founder-tax-guide-2026
- 2026-04-10 — find-technical-cofounder-bali
- 2026-04-14 — pt-pma-indonesia-founder-playbook-2026
- 2026-04-15 — best-bali-villas-founder-retreats-team-offsites-2026
- 2026-04-16 — how-to-run-tech-hackathon-bali-operator-playbook
- 2026-04-20 — bali-vs-jakarta-for-founders-2026
- 2026-04-20 — singapore-vcs-guide-southeast-asia-founders-2026
- 2026-04-23 — end-of-subsidised-ai-claude-code-pricing-sea-founders-2026

## Signals queue (weekly timely posts)

Signals are news-react posts tied to a specific triggering event. They refill the "This Week's Signal" slot on the homepage and feed BSTC Weekly. The automated agent does NOT pick from this queue. A human (or a separately triggered signal run) picks the best-fit item when the triggering event happens.

Signal editorial rules:

- 800 to 1,500 words. Shorter than evergreen. Punchy.
- Publish within 48 hours of the triggering event. Stale signals are worthless.
- Category must be "thought-leadership" (the homepage signal module filters on this).
- Frontmatter otherwise identical to evergreen rules above.
- Structure in this order: news lede (what happened in 2 paragraphs), TL;DR bullets, why it happened, why it matters, what it specifically means for Southeast Asia founders, 3-5 step actionable takeaway, 1-sentence close.
- If you cannot tie the signal to the SEA founder lens in the first third of the post, it is not a BSTC signal. Skip it.
- Include a comparison table or stat callout near the top. Signals get screenshotted and shared; give the reader something to screenshot.
- Reference primary sources (Anthropic docs, GitHub changelog, research PDFs, etc.) not aggregator commentary.
- Same style constraints: no em dashes, no emojis, British English, no preamble.

Candidate signals (top runs next when the trigger fires):

- [ ] GitHub Copilot moves agent mode to token-based billing: the parallel signal to Claude Code leaving Pro
- [ ] Mozilla Thunderbolt for SEA teams: why self-hosted enterprise AI just became viable in Jakarta, Bangkok, HCMC
- [ ] Chinese frontier coding models for SEA founders in 2026: GLM-4.6 vs Kimi K2 vs Qwen 3.x compared on real tasks
- [ ] What BSTC members actually pay for AI in 2026: community survey on tools, spend, and pricing trajectory
- [ ] OpenAI Codex rate-limit tightening: the third data point in the AI subsidy unwind
- [ ] The PwC 2026 AI Performance Study read for SEA founders: where the 74% of gains are actually landing

## Recently published signals (auto-appended)

- 2026-04-23 — end-of-subsidised-ai-claude-code-pricing-sea-founders-2026
