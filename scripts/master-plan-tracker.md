# BSTC Master Plan Tracker — H2 2026

Live checkbox tracker for [`docs/master-plan-h2-2026.md`](../docs/master-plan-h2-2026.md). Update weekly. Each unit is sized for a single execution pass (story-executor friendly).

**Target:** $100K–250K H2 revenue · 2 anchors · 4 Community Partners · ~20 Supporting slots · podcast live (20+ eps) · 3–5 VC partners · 3 hires.

---

## Scoreboard (update weekly)

| Metric | Target | Current |
|---|---|---|
| Revenue booked (H2) | $100K–250K | $0 |
| Anchor sponsors (@ $36K/yr) | 2 | 0 |
| Community Partners (@ $9.6K/qtr) | 4 | 0 |
| Supporting slots (@ $2K) | ~20 | 0 |
| Podcast episodes live | 20+ | 0 |
| VC deal-flow partners | 3–5 | 0 |
| Members | 4,000+ | 2,500+ |
| Core hires | 3 | 0 |

---

## Month 0 (Jun) — Fix the funnel, set up infra

- [ ] Wire `SPONSOR_CONFIG.calUrl` in `src/lib/constants.ts`
- [ ] Add email notification on `/api/sponsor-inquiry` (`src/app/api/sponsor-inquiry/route.ts`)
- [ ] Confirm Airtable env vars set in Vercel
- [ ] Add CRM mirror for inquiries (Notion/Apollo)
- [ ] Re-anchor HIWA founding deck: new deadline (31 Jul 2026) + expanded target list (Cursor, Anthropic, Vercel, Replit, ElevenLabs, Windsurf)
- [ ] Create 5 Notion databases (Sponsor, VC, Podcast, Hiring, Signals)
- [ ] Create 4 Slack channels + switch on daily pipeline briefs
- [ ] Podcast: production setup (RSS feed, on-site player, transcript workflow) + submit to Spotify/Apple/YouTube
- [ ] Seed podcast with 11+ recorded HIWA sessions
- [ ] Draft Community Lead + Producer role specs + scorecards

## Month 1 (Jul) — Launch outbound + podcast

- [ ] Build sponsor ICP list (50–80 accounts) via Apollo/Clay
- [ ] Sponsor outbound batch #1 (`outbound-intelligence-orchestrator`)
- [ ] **Close first HIWA founding partner**
- [ ] Reframe pitch to "go-to-market in SEA"
- [ ] Define VC offer + paperwork (Access Partner + scout/referral template)
- [ ] Build 20–30 SEA-active fund target list
- [ ] **Podcast public launch** + lock weekly cadence
- [ ] Open Community Lead + Producer roles; source from member base

## Month 2 (Aug) — Convert + hire

- [ ] Sponsor outbound batch #2
- [ ] **Close 2 Community Partners**
- [ ] Stand up press + partner-logo sections as logos land (hold Anthropic until approved)
- [ ] First 5–10 VC conversations (`deal-intel` briefs)
- [ ] Pilot a VC night / investor table at a Networking Night
- [ ] Sell podcast pre-roll/mid-roll; first podcast sponsor live
- [ ] Podcast clip automation (Whisper → tagger → shorts)
- [ ] **Hire Community Lead** + launch volunteer ambassador program (2 tracks)

## Month 3 (Sep) — Close anchors + ship payments

- [ ] **Close 1 Strategic Partner** (category-exclusive)
- [ ] Ship payment/invoice flow (Stripe or DocuSign, 50/50 terms)
- [ ] **Sign 3–5 VC deal-flow partners** + Notion intro tracking
- [ ] 1 paying podcast sponsor live
- [ ] **Hire Producer + Partnerships Coordinator**; start 30-60-90 onboarding

## Months 4–6 (Oct–Dec) — Steady state

- [ ] ~20 Supporting slots filled across events calendar
- [ ] Renewals motion for Q1 2027 + auto quarterly sponsor reports
- [ ] Operate VC funnel: monthly deal-flow digest, sponsored presence, first payouts
- [ ] 20+ podcast episodes + engagement reporting into renewals
- [ ] Team operating independently; founder shifts to partnerships/strategy

---

## Dependencies / sequencing notes

- **Don't scale outbound before the Month 0 funnel fixes land** — no email/CRM/payment = leaked leads.
- **Newsletter sponsor slots** require a Beehiiv/Resend backend first (carry as its own ticket).
- Code changes (funnel, podcast feed) ship as separate PRs with their own `npm run build` gate.
