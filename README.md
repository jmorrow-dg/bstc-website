# BSTC Website — balistartupandtech.com

The Bali Startup & Tech Community website: Next.js 14 (App Router), Tailwind, markdown content, deployed on Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Lead capture architecture

Every form on the site (join, newsletter, event RSVPs, investor/startup intake, contact, sponsor) flows through `src/lib/leads.ts`:

- **Beehiiv** is the system of record. Leads are created as subscribers with custom fields (name, LinkedIn, role, company, source, event) and UTM attribution. Beehiiv also powers the newsletter, segmentation, the referral program, and (later) paid subscriptions.
- **Notification webhook** (optional) pings the team instantly for high-intent leads: contact messages, sponsor inquiries, investor and startup signups. Point `LEAD_NOTIFICATION_WEBHOOK_URL` at a Slack incoming webhook or Zapier/Make hook.
- With no env vars set, forms still work — leads are logged to the server console only. Nothing breaks in dev.

First-touch attribution (UTM params, referrer, landing page) is captured client-side by `src/components/AttributionTracker.tsx` and attached to every form submission.

### Capture surfaces

| Surface | Endpoint | What's captured |
|---|---|---|
| `/join` (the front door — all "Join" CTAs route here) | `/api/join` | name, email, LinkedIn, role, company |
| Event detail pages (RSVP gate before Meetup) | `/api/rsvp` | email, name, event |
| `/investors` | `/api/investors` | name, email, LinkedIn, firm, type, check size, focus |
| `/startups` | `/api/startups` | name, email, company, stage, raising status, pitch |
| Footer / blog / events / podcast newsletter forms | `/api/newsletter` | email + source |
| Floating WhatsApp bubble (capture before invite) | `/api/newsletter` | email |
| `/contact`, `/sponsors/apply` | `/api/contact`, `/api/sponsor-inquiry` | full inquiry + webhook notification |

## Ops setup checklist (one-time)

1. **Create the Beehiiv publication** (beehiiv.com). Copy the API key and publication ID into Vercel env vars (`BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`).
2. **Create custom fields** in Beehiiv (Settings → Subscriber data), matching the names the site sends: `Name`, `LinkedIn`, `Role`, `Company`, `Source`, `Event`, `Contact Topic`, `Investor Type`, `Check Size`, `Investment Focus`, `Stage`, `Raising`, `Website`, `Sponsor Tier`, `Sponsor Goal`. Values for missing fields are silently dropped by Beehiiv.
3. **Build the welcome automation** in Beehiiv, triggered on signup. The welcome email must contain the WhatsApp invite link and the Meetup link — the site promises "your invite arrives by email", and this automation is what delivers it.
4. **Enable Beehiiv's referral program** once the list has some volume — it's the built-in 10x growth loop.
5. **Set up the notification webhook**: create a Slack incoming webhook in the community ops channel and set `LEAD_NOTIFICATION_WEBHOOK_URL`.
6. **Later: migrate events from Meetup to Luma.** Luma captures RSVP emails natively and has an API + embeds; the event frontmatter `rsvpUrl` already supports any URL.

## Content

- Blog posts: `content/blog/*.md` (frontmatter schema in `src/lib/content.ts`)
- Events: `content/events/*.md`
- Topic backlog and editorial rules: `scripts/blog-topics-backlog.md`

## Scripts

```bash
npm run dev     # local dev server
npm run build   # production build
npm run lint    # eslint
```
