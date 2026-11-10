# Proposal: public/llms-full.txt

Not created. Josh needs to say yes before this file is added. This branch does not add it, and it does not submit a sitemap or any URL.

## Contents

A longer sibling of `public/llms.txt` (12,282 bytes on this branch). The short file stays as it is.

- One section per URL already on the sitemap: that page's title, canonical URL, and the description already on the page.
- For each event that emits Event schema: date, start time, venue, and that entry is free, because every BSTC event is free. End time only when that event file has `endTime`. Organiser only when the schema already has one.
- No attendance figures, no prices other than free, no investor or firm names, no deal outcomes.
- The hackathon stays out while it is off the sitemap and marked `schema: false`. Repeat the existing line "Hackathons: coming soon, date TBA." Do not write it up as a past event.
- Join URL is https://www.balistartupandtech.com/join only. No WhatsApp join link, no private invite, no personal phone. Keep the contact line already in `llms.txt`.

## Size

Measured on this branch, 10 Nov 2026, as a dry run that was not written to `public/`:

- Current `public/llms.txt`: 12,282 bytes.
- 35 event lines (title, URL, date, start, end time only where the file has one, venue, "Free", existing description): 12,201 bytes.
- Header plus those event lines: 24,509 bytes.
- 35 blog lines (title, URL, existing excerpt): 12,719 bytes.
- Header, event lines, and blog lines together: 37,239 bytes.

The 36 event files are 65,763 bytes and the 35 blog files are 406,097 bytes. Copying full blog bodies would be about 0.5 MB and would duplicate pages other lanes are still editing. That shape is rejected. The useful file is about 37 KB.

## Update path

Do not hand-edit a second copy. A build step should read `content/events`, `content/blog`, and the sitemap routes, write `public/llms-full.txt`, and fail the build if it would emit a count that is not already in `src/lib/constants.ts` or on that page. Regenerate it in the same PR that adds or changes an event or a guide. `public/llms.txt` stays the short, hand-curated file.

Search Console and sitemap submission stay out of this. Those still need a separate yes.

## Left to lane 3

Titles and the "agency" and "Start-Up name" credit lines on dinners #42 to #50. This proposal does not change them.
