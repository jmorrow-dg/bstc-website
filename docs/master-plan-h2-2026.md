# BSTC Master Plan — H2 2026 (July–December)

> A 6-month execution plan for the BSTC team to run via Codex. Four workstreams: (1) Sponsorship revenue, (2) VC deal-flow partnership, (3) Podcast launch, (4) Community leadership & hiring.

---

## Context — why this plan exists

BSTC is a thriving, founder-first community (2,500+ members, 40+ countries, 4.6/5 from 116 MeetUp reviews, weekly "How I AI" + monthly Networking Nights out of Canggu, Bali). The community engine works; **monetization is the gap.** Sponsorship is live but half-wired, the podcast is built but not launched, VC relationships are ad-hoc, and the team has no dedicated community ownership. This plan converts an engaged audience into **$100–250K of H2 2026 revenue** without diluting the brand or the member experience — charge the companies, never the members.

The plan is **Bali-deep, not multi-city**: we deepen frequency, formats, and vertical tracks in Bali rather than launching new-city chapters. VC outreach builds a **deal-flow partnership** (scout/referral fees, paid VC access, sponsored VC presence) — **not** a fundraise and not dilution.

---

## North Star & 6-month targets

| Metric | Baseline (Jun 2026) | Target (Dec 2026) |
|---|---|---|
| **Revenue (H2)** | ~$0 recurring | **$100K–250K** |
| Anchor sponsors signed (Strategic/HIWA founding @ $36K/yr) | 0 | **2** |
| Community Partners (@ $9.6K/qtr) | 0 | **4** |
| Supporting sponsors (per-event @ $2K) | ad-hoc | **~20 event-slots filled** |
| Podcast | built, unlaunched | **live on Spotify/Apple/YouTube, 20+ episodes** |
| VC deal-flow partners (signed access/scout agreements) | 0 | **3–5** |
| Members | 2,500+ | **4,000+** |
| Core community hires | 0 dedicated | **3 roles + volunteer ambassador layer** |

**Revenue model to hit the floor ($100K) and stretch toward $250K:**
- 1 HIWA founding partner ($36K/yr, re-anchored — see below) + 1 Strategic Partner ($36K/yr) → ~$72K
- 4 Community Partners × $9.6K/qtr (signed across H2) → ~$77K
- ~20 Supporting slots × $2K → ~$40K
- Podcast pre-roll + VC paid-access + talent/enablement → upside toward $250K

---

## Current asset base (what we build on — verified in code)

- **Events:** weekly "How I AI" (Wed, Seoul Soul Project, 60 cap, 11 editions run); monthly Networking Night (3rd Thu, Yema Kitchen, 80 cap); Berawa drinks series; workshops (highest-rated at 4.8/5); Hackathon #1 on 14 Jun 2026.
- **Sponsorship (`src/app/sponsors/`, `src/lib/constants.ts`):** 3 live tiers — Supporting $2K/event, Community Partner $9.6K/qtr ("Most Popular"), Strategic Partner $36K/yr (2/yr, category-exclusive). HIWA founding-partner deck (`public/bstc-hiwa-cursor-proposal.html`) at $36K/yr vs $150K list. Flow: `/sponsors/apply` → Zod → `/api/sponsor-inquiry` → Airtable.
- **Content & distribution:** 27 blog posts via an automated content agent, 39-topic evergreen backlog, RSS live ("BSTC Weekly"). Newsletter API stubbed — no Beehiiv/Resend backend yet.
- **Podcast (`src/app/podcast/page.tsx`):** page live, pre-launch; 3 pillars (Builder Interviews, AI Intel Drops, Live Event Audio); **11+ HIWA sessions already recorded = a back catalogue.** Bottleneck is production, not audience.
- **Automation OS (`~/.claude/skills/`):** outbound-intelligence, content-production, proposal, pipeline-intelligence orchestrators + deal-intel swarm, on the orchestrator-base harness. MCPs wired: Apollo, Clay, Slack, Gmail, Granola, Notion, Higgsfield, Google Calendar.

### Known gaps to close (carried into workstreams)
1. **HIWA founding-partner deadline (31 May 2026) has passed** → must re-anchor the offer (new deadline, refreshed deck) before re-sending.
2. Sponsor funnel half-wired: Cal.com URL empty, no email notification on inquiry, no CRM sync, no payment/invoice flow, press + partner-logo sections empty.
3. Newsletter has no sending backend (Beehiiv/Resend) — a sponsor deliverable that doesn't yet ship.
4. Podcast needs: podcast RSS feed (separate from blog), on-site player, transcript/show-notes workflow, platform submissions.
5. No dedicated community owner — founder is the single point of failure.

---

## Workstream 1 — Sponsorship Revenue Engine *(primary revenue driver)*

**Objective:** Convert the community into $100K+ of sponsorship by closing the funnel and running systematic outbound to AI-vendor and SEA-ecosystem ICPs.

**Owner role:** Head of Partnerships (existing/Josh) + Partnerships Coordinator (hire). **Automation:** `outbound-intelligence-orchestrator` (batch prospect→ICP→one-pager→email), `deal-intel` (pre-call briefs), `proposal-orchestrator` (adapt for sponsor packages), `pipeline-intelligence-orchestrator` (daily #sponsor-pipeline brief).

**Milestones**
- **Month 0 (Jun):** Fix the funnel — wire Cal.com (`SPONSOR_CONFIG.calUrl`), add email notification on `/api/sponsor-inquiry`, confirm Airtable env vars in Vercel, add a CRM mirror (Notion/Apollo). Re-anchor HIWA founding deck with a new deadline (e.g. 31 Jul 2026) and broaden target list (Cursor, Anthropic, Vercel, Replit, ElevenLabs, Windsurf).
- **Month 1 (Jul):** Build the sponsor ICP list (50–80 accounts) via Apollo/Clay. Launch outbound batch #1. **Close first HIWA founding partner.** Reframe the pitch from "audience access" to "go-to-market in SEA" (case studies + beachhead).
- **Month 2 (Aug):** Outbound batch #2; close 2 Community Partners. Stand up the "press" and "partner logo" sections as social proof as logos land (respect the Anthropic "do not add until approved" note).
- **Month 3 (Sep):** Close 1 Strategic Partner (category-exclusive). Ship payment/invoice flow (Stripe or DocuSign-driven, 50/50 terms).
- **Months 4–6 (Oct–Dec):** Steady-state — 20+ Supporting slots filled across the events calendar, renewals motion for Q1 2027, quarterly sponsor reports auto-generated.

**6-mo target:** 2 anchors + 4 Community + ~20 Supporting → ~$150–190K.

---

## Workstream 2 — VC Deal-Flow Partnership *(no dilution)*

**Objective:** Position BSTC as SEA's highest-signal deal-flow funnel and monetize the VC relationship via (a) paid VC access/membership, (b) sponsored VC presence at events, (c) scout/referral economics on intros that convert.

**Owner role:** Head of Partnerships + founder relationships. **Automation:** `deal-intel` swarm for per-firm briefs (thesis, recent checks, portfolio, decision-makers), `outbound-intelligence-orchestrator` for VC outreach, Apollo for firm/partner sourcing, Granola for call capture.

**Milestones**
- **Month 1 (Jul):** Define the VC offer + simple paperwork: (1) "VC Access Partner" (curated founder intros + event presence, annual fee), (2) scout/referral agreement template (fee or carry-share on intros that lead to a round). Build a target list of 20–30 SEA-active funds (Singapore-heavy: BANSEA, AngelCentral networks already surface in the blog research).
- **Month 2 (Aug):** First 5–10 VC conversations using `deal-intel` pre-call briefs. Pilot a "VC night" / investor table at a Networking Night as the proof artifact.
- **Month 3 (Sep):** Sign **3–5 VC deal-flow partners.** Instrument intro tracking in Notion (founder ↔ fund ↔ outcome) so referral economics are auditable.
- **Months 4–6:** Operate the funnel — monthly curated deal-flow digest to partner VCs, sponsored investor presence at flagship events, first scout/referral payouts logged.

**Revenue stance:** Scout/referral is **pipeline, not guaranteed H2 revenue** (long payback). Paid VC access + sponsored presence is the bookable line; model it as upside toward the $250K stretch.

---

## Workstream 3 — Podcast Launch

**Objective:** Launch the podcast off the existing back catalogue and turn it into both a distribution channel and a sponsor inventory (pre-roll/mid-roll already promised in the Strategic tier).

**Owner role:** Content/Podcast Producer (hire). **Automation:** `content-production-orchestrator` (30 promo pieces/episode across LinkedIn/X/carousels/short-form), Higgsfield (cover art, clips, episode graphics), Gmail/Slack MCP for guest + announcement ops, Notion production database.

**Milestones**
- **Month 0–1 (Jun–Jul):** Production setup — generate the podcast RSS feed, add an on-site player, build the transcript/show-notes workflow, submit to Spotify/Apple/YouTube. **Seed the launch with the 11+ recorded HIWA sessions** so we launch with a catalogue, not episode one.
- **Month 1 (Jul):** Public launch. Lock weekly cadence (the "How I AI" weekly rhythm already produces source material). Run `content-production-orchestrator` per episode for promo.
- **Month 2 (Aug):** Sell pre-roll/mid-roll as add-ons in sponsor packages; first podcast sponsor live. Clip automation (Whisper → segment tagger → 60–90s shorts) to TikTok/Reels/Shorts.
- **Months 3–6:** 20+ episodes published, guest pipeline (founders, the visiting VCs from Workstream 2), engagement reporting feeding sponsor renewal conversations.

**6-mo target:** Live on all platforms, 20+ episodes, ≥1 paying podcast sponsor.

---

## Workstream 4 — Community Leadership & Hiring *(Bali-deep)*

**Objective:** Remove the founder-as-single-point-of-failure and add capacity to sustain weekly+monthly cadence, deepen vertical tracks, and support the revenue workstreams — **by function/vertical, not by new city.**

**Hiring plan (3 core roles + volunteer layer):**
1. **Community Lead / Head of Community** — owns events cadence, member experience, WhatsApp/Discord, MeetUp ops. First and most important hire.
2. **Partnerships Coordinator** — runs sponsor + VC outbound execution under the automation OS; owns the pipeline-intelligence brief.
3. **Content/Podcast Producer** — owns podcast production, clip/repurposing pipeline, the content agent + newsletter.
4. **Volunteer ambassador layer** — vertical-track leads (e.g. AI Builders track, Founders/Fundraising track) drawn from active members; recognition + perks, not payroll.

**Automation for hiring:** `outbound-intelligence-orchestrator` (source + score candidates), `deal-intel` (pre-interview briefs), `pipeline-intelligence-orchestrator` (hiring funnel brief), Apollo (sourcing), Notion (funnel), Google Calendar (scheduling). A hiring rubric (communication, leadership clarity, AI fluency, culture fit) gates the funnel.

**Milestones**
- **Month 1 (Jul):** Write role specs + scorecards; open Community Lead + Producer roles; source from within the 2,500-member base first.
- **Month 2 (Aug):** Hire Community Lead. Stand up volunteer ambassador program with the first 2 vertical tracks.
- **Month 3 (Sep):** Hire Producer + Partnerships Coordinator. 30-60-90 onboarding.
- **Months 4–6:** Team operating independently; founder shifts to partnerships/strategy.

---

## Cross-cutting — the automation/OS layer

A large team executes through the existing orchestrators rather than manual handoffs. **Month 0–1 infra setup:**
- Notion databases: Sponsor Pipeline, VC Pipeline, Podcast Production, Hiring Funnel, Signals.
- Slack channels + daily briefs: `#sponsor-pipeline`, `#vc-pipeline`, `#podcast`, `#hiring` (via `pipeline-intelligence-orchestrator`, ~7:45am).
- Optional 4 thin new skills wrapping existing ones with workstream-specific ICP gates: `sponsor-outreach`, `vc-outreach`, `podcast-launch`, `hiring` (each ~1–2 wks, 70% reuse of current harness). **Build only if manual orchestrator runs prove too slow — don't build speculatively.**

---

## Month-by-month timeline (all workstreams)

| Month | Sponsorship | VC Deal-Flow | Podcast | Community/Hiring |
|---|---|---|---|---|
| **Jun (M0)** | Fix funnel, re-anchor HIWA deck | — | Production setup, seed catalogue | Write role specs |
| **Jul (M1)** | ICP list, outbound #1, close HIWA founding | Define offer + 20–30 fund list | **Launch**, weekly cadence | Open + source 2 roles |
| **Aug (M2)** | Outbound #2, 2 Community Partners | First 5–10 VC convos, VC night | Pre-roll sold, clip automation | Hire Community Lead, ambassadors |
| **Sep (M3)** | 1 Strategic Partner, payment flow | **Sign 3–5 partners**, intro tracking | 1 paying podcast sponsor | Hire Producer + Coordinator |
| **Oct–Dec (M4–6)** | 20+ Supporting slots, renewals | Operate funnel, first payouts | 20+ episodes, reporting | Team runs independently |

---

## KPIs & reporting cadence

- **Daily:** automated pipeline briefs to Slack (sponsor / VC / hiring).
- **Weekly:** update `scripts/master-plan-tracker.md`; revenue-booked vs target; episodes shipped.
- **Monthly:** founder review against the targets table; re-forecast.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| HIWA deadline lapsed, offer feels stale | Re-anchor with new deadline + refreshed deck before any send (Month 0). |
| Over-monetizing erodes member trust | Charge companies, never members; keep the "no hard selling / 60-sec" rules sacrosanct. |
| Funnel leaks (no email/CRM/payment) | Close in Month 0 before scaling outbound — don't pour leads into a broken funnel. |
| Founder bottleneck | Front-load the Community Lead hire (Month 2). |
| Scout/referral revenue is slow | Book paid-access + sponsored-presence as the reliable VC line; treat referral as upside. |
| Newsletter promised but can't send | Stand up Beehiiv/Resend backend before selling newsletter slots. |

---

## Immediate next 14 days

1. **Sponsorship:** wire `SPONSOR_CONFIG.calUrl`, add inquiry email notification, confirm Airtable in Vercel, re-anchor HIWA deck (new deadline + expanded target list).
2. **Infra:** create the 5 Notion databases + 4 Slack channels; switch on daily pipeline briefs.
3. **Hiring:** draft Community Lead + Producer specs and scorecards.
4. **Podcast:** scope the podcast RSS feed + player + transcript workflow as the first build tickets.

Progress is tracked in [`scripts/master-plan-tracker.md`](../scripts/master-plan-tracker.md).
