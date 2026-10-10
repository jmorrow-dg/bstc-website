# BSTC community rollout

The permanent public joining destination is `https://www.balistartupandtech.com/join`.
The website prepares the joining flow; admins still create and moderate the chats
in WhatsApp and Telegram. No group creation or invitations are automated here.

## Activate signup capture and joining options

1. Follow [the Google Sheets setup guide](google-sheets-signups.md) to connect the
   native website form to the private signup sheet. All signup code lives here;
   there is no external form builder in the joining flow.
2. Create **BSTC — General 2**, appoint moderators and enable join approval.
   Check the existing WhatsApp Community's total capacity before adding it there.
3. Create the Telegram community and **BSTC — Events & Updates** WhatsApp Channel.
   On Telegram, restrict adding community chats to admins. Use an announcements
   channel and a separate Topics group, connected with pinned links. Topics
   cannot be combined with Telegram's native linked channel-comment group.
4. Test each destination with a non-admin account. Set the server-only
   `BSTC_WHATSAPP_INVITE_URL`, `BSTC_TELEGRAM_URL` and `BSTC_UPDATES_URL` variables
   in Vercel. These links appear only after the server confirms a signup save.
   Missing links are omitted; registration does not guarantee group capacity.
5. Verify registration and newsletter opt-ins in the private sheet. Neither form
   sends emails. Use explicit consent and preserve existing unsubscribe records
   when connecting a campaign sender later. Directory consent is independent.
6. Replace promotional links on Meetup, social profiles and partner materials
   with `/join` after the production check passes. Existing General 1 members
   can stay where they are. Ask Josh for the old form export before retiring it.

## Recover the pending requests

Use the private recovery workbook and WhatsApp's live pending queue together.
Historical display labels are not stable person identifiers; the export does not
establish who is currently pending. Add live requests missing from the workbook,
check identities, assign one admin per request and verify an available contact route.

Send one contextual invitation to each verified applicant. Record invited,
joined, declined and unreachable separately. Preserve unresolved requests and
do not count an invitation as a completed join. Joining another app, joining the
directory and subscribing to email are separate member choices.

Keep the workbook and chat exports private. Never commit them to this repository
or import them into a public member directory.

## Publish the return to events

The current `/events` empty state says events are being prepared from 21 October
2026 onward. It does not claim a confirmed booking. Once local arrangements are
confirmed, add an event in `content/events/` using the existing frontmatter format.
Confirm the date, time, venue, responsible host, backup host, capacity and RSVP URL
before setting `status: upcoming`. Keep unconfirmed event drafts outside the
published content directory.

Dates use `YYYY-MM-DD` and the Bali time zone (`Asia/Makassar`, UTC+8). An upcoming
listing remains current through its Bali calendar day, then appears in the past
list. An elapsed date does not assert that the event took place. Event listings,
detail pages, homepage, RSS and sitemap revalidate hourly, so a cached page can
take approximately an hour to catch up. Invalid dates never enable RSVP buttons.
Past detail pages preserve the historical description with an archive notice;
old registration prose in that description is historical, not an active invitation.

Update the October relaunch copy when the return is confirmed or rescheduled.
Reconcile the two existing June 18 networking listings separately if they describe
the same event; this rollout preserves their original records.

## Copy for community admins

**General 2 description**

> Bali Startup & Tech: founders, builders, operators and people curious about technology in Bali. Introductions, questions and useful connections welcome. General 2 is part of the same BSTC community, with the same events and guidelines. Joining options and events: https://www.balistartupandtech.com/join

**Telegram description**

> Meet founders and builders connected to Bali. Share practical lessons on AI, products and growth; ask useful questions; find collaborators; and reconnect at local events. Start with the pinned welcome and choose the topics that interest you.

Start with General & Introductions, AI & Building, Growth & Distribution,
Jobs & Collaborations, and Show & Tell.

**Events & Updates description**

> Confirmed Bali Startup & Tech events, community news and selected member highlights. A quieter way to stay connected. Joining options: https://www.balistartupandtech.com/join

**Pinned welcome**

> Welcome to Bali Startup & Tech! Tell us your name, what you are building or working on, and one thing you would like help with—or can help others with. Be welcoming and respectful. Share useful context. Keep commercial promotion in Show & Tell and ask before sending sales messages. Protect members' personal information and contact an admin if something needs attention. You do not need to join every platform: https://www.balistartupandtech.com/join

## Release checks

- `npm test` passes on Node.js 22.18+ or 24; Google requests are mocked.
- `npm run build` succeeds with installed dependencies and existing image assets.
- Check `/join`, `/events`, the homepage and a past event on mobile and desktop.
- Validate a real organiser-controlled test signup in the private sheet after
  hosting configuration. Verify both opt-in choices and the newsletter-only row.
- Confirm errors do not display success or expose joining links.
- Confirm every available chat link works signed out and respects join approval.
- Past events do not offer RSVP buttons or current ticket offers in structured data.
- Verify production capture before sharing the public relaunch announcement.
