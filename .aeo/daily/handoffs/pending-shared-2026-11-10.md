# Decisions for Josh, 10 Nov 2026

Lane 2, schema (BSTC-1). Draft only. Nothing here is a merge, a deploy, or a message.

1. End times. `endDate` is set only where the event file already has `endTime` (dinners #39 to #41 at 20:30, How I AI editions 18 to 22 at 21:00). Dinners #42 to #50 say 18:30 and have no end time in the file. Older How I AI editions and the networking nights also have no `endTime`. `public/llms.txt` on draft #42 says the dinner series runs 6:30 PM to 8:30 PM and How I AI closes at 9:00 PM. Say yes if those series times should be written into the event files that lack `endTime`. Until then, schema omits `endDate` for them.

2. Organiser. `EVENT_ORGANIZER.name` is still empty, so BSTC is not named as organiser. Where an event file has no `organizer` field, schema uses the host in that file's venue line (the text before the comma). That fills dinners #42 to #50, flagship May, flagship June, and the April networking night with Yema Kitchen, without editing those markdown files. Confirm this, or fill the host partner in `EVENT_ORGANIZER`.

3. Street address. Dinners #42 to #50 do not get `venueAddress`. The street lines exist on dinners #39 to #41 and in #42's `llms.txt` (Yema: Jl. Tanah Barak No.31, Canggu. Seoul Soul Project: Jl. Canggu Padang Linjong No.61, Canggu). Say yes if every Yema dinner should carry that street address.

4. `llms-full.txt`. Proposal only, in `.aeo/daily/handoffs/bstc-1-llms-full-proposal-2026-11-10.md`. A dry run of the proposed shape is 37,239 bytes. Say yes or no. No file was added. No Search Console or sitemap submission.

5. Hackathon page. It stays `schema: false` and off the past list, which draft #42 already held. Live today it still emits an Event with none of the new fields. This branch does not put those fields on it.

6. Dinner copy. Titles (87 characters on the live crawl) and the "agency" and "Start-Up name" credit lines are untouched. Lane 3 owns them.

7. Missing inputs. `~/orca/bstc-aeo/` is not on this machine. `.aeo/daily/bstc-2-aeo-schema-2026-11-10.md` (the ownership table) and `crawl.json` were not in the box. TODO(josh): drop those in if this lane should follow a different file list. Work stayed on schema files, plus the main merge that added dinners #42 to #50 unchanged.

8. Count mismatch already on draft #42, not edited here. `public/llms.txt` on that branch says 2,735 Meetup members on 27 Oct 2026. The approved figure for this run is 2,734 on 25 Oct 2026. TODO(josh): which date and count `llms.txt` should keep.
