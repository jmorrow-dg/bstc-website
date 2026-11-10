# Merge order and readiness board, 10 Nov 2026

Review only. Nothing here was merged, closed, marked ready, or pushed onto another PR branch. Main is `ef65f0d` (merge of #46, 9 Nov 2026, 8:59am WITA). Checked 10 Nov 2026, 4:14pm to 4:19pm WITA.

bstc-hub not available (GitHub returned 404 for `lachlanmcritchie/bstc-hub`). Questions stay Q01 to Q18.

This file is the release plan. Josh decides. Lachlan merges only what Josh has said yes to.

## Inventory

15 open PRs. GitHub reported every one `MERGEABLE` / `CLEAN` against its own base at 4:19pm WITA. `CLEAN` against the base is not a clean merge against the other open PRs. Heads below were re-fetched from origin.

| PR | Draft | Base | Head | Contains `ef65f0d` | Behind main | Role |
|---|---|---|---|---|---|---|
| [#42](https://github.com/jmorrow-dg/bstc-website/pull/42) | yes | `main` | `eb2e1f9` | no | 2 commits (#46 only) | Lane 2 schema parent |
| [#49](https://github.com/jmorrow-dg/bstc-website/pull/49) | yes | #42 branch | `43d5dae` | yes | 0 | Lane 2 stack tip. Event schema, ItemList |
| [#39](https://github.com/jmorrow-dg/bstc-website/pull/39) | yes | `main` | `7e9aa06` | no | 6 commits (#38, #44, #46) | Lane 3 content parent |
| [#51](https://github.com/jmorrow-dg/bstc-website/pull/51) | yes | #39 branch | `48fb7c8` | yes | 0 | Lane 3 stack tip. Titles, metas, dinners #42 to #50 |
| [#40](https://github.com/jmorrow-dg/bstc-website/pull/40) | yes | `main` | `2032c02` | no | 2 | Lane 4 homepage |
| [#41](https://github.com/jmorrow-dg/bstc-website/pull/41) | yes | `main` | `e056774` | no | 2 | Lane 5 measure parent |
| [#53](https://github.com/jmorrow-dg/bstc-website/pull/53) | yes | #41 branch | `cf872e0` | yes | 0 | Lane 5 stack tip. 100 URL baseline, citation log |
| [#45](https://github.com/jmorrow-dg/bstc-website/pull/45) | yes | `main` | `9c1c501` | no | 2 | Leftovers. Branch `08a-site-release`, not a lane topic branch |
| [#47](https://github.com/jmorrow-dg/bstc-website/pull/47) | yes | `main` | `27fd64b` | yes | 0 | FAQ venues and investors |
| [#48](https://github.com/jmorrow-dg/bstc-website/pull/48) | **no** | `main` | `7ee3d77` | yes | 0 | Josh's Event schema: venue organiser, contributor, `offers.validFrom` |
| [#31](https://github.com/jmorrow-dg/bstc-website/pull/31) | no | `main` | `45ad7d6` | no | 18 | How I AI deck. Out of this release |
| [#29](https://github.com/jmorrow-dg/bstc-website/pull/29) | no | `main` | `6ac5c29` | no | 20 | Newsletter capture. Off limits |
| [#27](https://github.com/jmorrow-dg/bstc-website/pull/27) | no | `main` | `7b4558c` | no | 22 | How I AI deck. Out of this release |
| [#8](https://github.com/jmorrow-dg/bstc-website/pull/8) | no | `main` | `7e38197` | no | 80 | How I AI deck. Leave open |
| [#7](https://github.com/jmorrow-dg/bstc-website/pull/7) | no | `main` | `7a6213f` | no | 80 | How I AI deck. Leave open |

No newer open PR appeared after this list.

Stack ancestry, checked with `git merge-base --is-ancestor`:

- #42 `eb2e1f9` is an ancestor of #49. #49 also merges main.
- #39 `7e9aa06` is an ancestor of #51. #51 also merges main.
- #41 `e056774` is an ancestor of #53. #53 also merges main.

Merging a stack tip straight into `main` would drag the parent commits in with it. Land the parent PR first, then retarget the child onto `main` and merge the child. This review did not retarget any PR.

#48 commits are authored by Josh Morrow (10 Nov 2026, 3:46pm to 3:54pm WITA). The PR body records a 10 Nov 2026, 3:52pm WITA ruling: "Venue on all, BSTC team as moderator." That ruling is quoted from the PR. This review did not confirm it anywhere else.

## Readiness board

Josh's yes is pending on every row. A GitHub `CLEAN` badge means the PR merges into its base today. It does not mean the site QA gate passed tonight.

| Order | PR | Ships | Gate tonight | Risk Lachlan must check | Yes |
|---|---|---|---|---|---|
| 1 | #42 | Schema, check-jsonld, robots, sitemap lastmod, `/blog` and `/bali-vs` titles, `/events` CTA to `/join`, previous and next links, `STATS.totalMembers` 3900. Hackathon file stays, with `schema: false` and `pastList: false` (so the sitemap filter drops it). | Not re-run. 8 Nov claim: tsc, lint, build, check-jsonld passed. 375px and 1280px renders were not run then, and were not run tonight. | Previous and next template links sit beside #39's in-body "Previous edition" / "Next edition" lines. Both would render. `public/llms.txt` also changes in #47. | Pending |
| 2a or 2b | #48 or #49 | One Event schema implementation. See the fork below. | Not re-run. | The two PRs conflict. Landing both needs a hand merge. | Pending |
| 3 | #39 | Event and blog corrections, Edition 23 with an empty RSVP, hackathon page deletion, credit line on the older dinners. Does not edit dinners #42 to #50. | Not re-run. QA has been incomplete since 5 Nov. | One real conflict with #42: `content/events/hackathon-edition-1.md`. Take the deletion. #39 does not contain #38, #44, or #46. GitHub can still merge it into today's main. The test merge did, with that one conflict. | Pending |
| 4 | #51 | Short titles and metas on four posts and `/perks`. Dinner #42 to #50 titles, metas, and the credit line. Opening copy on those pages. | Not re-run. #51's handoff says a production build checked title and description length. This review did not rebuild. | Also rewrites the `/perks` lede and `perksMetaDescription`. Those files are unowned. Visible copy. GitHub's file list also shows homepage, FAQ, community, and `llms.txt` because #39 lacks #38 and #44. The #51 commit itself does not change those four against main. | Pending |
| 5 | #45 | `/community` join answer, perk example eligibility, dash rewrites on `/privacy` and `/sponsors`. | Not re-run. | Join answer is not the same sentence as the live "Are events free?" answer. Branch is not a lane topic branch. `src/app/community/page.tsx` is lane 2's file. Privacy, sponsors, and `perks.json` are unowned. | Pending |
| 6 | #40 | Homepage: free events wording, hackathon card removed, entity block, upcoming board. | Not re-run. 8 Nov local QA did not run. Vercel preview build was the only build named then. | Homepage copy. The new free answer is not the same sentences as live `/faq`. Card removal is part of the hackathon release. | Pending |
| 7 | #41 | Crawler, citation tooling, footer and 404 links, PageTransition, hackathon redirect to `/events`. | Not re-run. 8 Nov claim: tests and mobile Lighthouse passed. 1280px renders were not run. | Redirect must ship in the same release as the #39 deletion. Crawler baseline in this parent is the 8 Nov 91 URL set. #53 raises it to 100. | Pending |
| 8 | #53 | Crawler baseline 100 URLs. Citation log for 10 Nov. Host and sitemap note. | Not re-run. | Log is 90 slots, all `unavailable`, note `not collected: no engine access`, stamped 2026-11-10T16:05:00+08:00. Zero answers. That is not a citation result. | Pending |
| 9 | #47 | Two FAQ answers: Canggu venues, and where to meet investors. One `llms.txt` line. | Not re-run. | New copy includes 100+ countries, 50+ events, 4.7 from 155 Meetup ratings, and "100+ founders, operators, and VCs in the room every week". Those figures are still waiting on one confirmation before they go into new copy. | Pending |
| Hold | #48 if 2b, or #49 if 2a | The schema PR that was not chosen. | n/a | Leave open. Combining it later is a new commit, not a blind merge. | Pending |

Out of this release, on purpose:

| PR | Board |
|---|---|
| #29 | Off limits. It edits `src/app/api/newsletter/route.ts` and `NewsletterSignup.tsx`. Leave it open. It shares no files with the PRs above. |
| #7, #8 | Leave open and untouched (1 Nov). Deck files only. |
| #27, #31 | Deck files only. No ruling recorded here. Leave open. They share no files with the AEO PRs. |

## Proposed merge order

Every step waits on Josh's yes. The hackathon pieces (#42's unlist, #39's deletion, #40's card, #41's redirect) are one release. If Josh says yes to only some of those four, merge none of them.

Scratch merges were local, from `origin/main`, with `--no-ff`, and were not pushed.

1. **#42** into `main`. Test: clean.
2. **Schema fork**, immediately after #42, before #39:
   - **Path A.** #48 into that tree. Test against #42: clean. #49 then conflicts and stays open.
   - **Path B.** Retarget #49 onto `main` and merge it. Test against #42: clean. #48 then conflicts and stays open.
3. **#39** into that tree. Test: one conflict, `content/events/hackathon-edition-1.md` (modified on #42, deleted on #39). Resolution used in the scratch merge: take the deletion. The other shared event files auto-merged. Dinner #41 kept #42's `endTime`, `venueAddress`, and `organizer: "Yema Kitchen"` and #39's title, meta, and credit line.
4. **#51** after #39 is retargeted. Test on top of #42 + #49 + #39: the only conflict was `.aeo/daily/handoffs/pending-shared-2026-11-10.md`. No product conflict. If Path A skipped #49, #51 is the first branch to add that handoff file, so this particular conflict moves to step 8 (#53).
5. **#45**. Test: clean on the stacked tree, including after #51.
6. **#40**. Test: clean on the stacked tree.
7. **#41**. Test: clean. This is the step that completes the hackathon release (page deleted, unlisted, card gone, `/events/hackathon-edition-1` redirecting to `/events`).
8. **#53** after #41 is retargeted. Test: conflict only on `.aeo/daily/handoffs/pending-shared-2026-11-10.md`.
9. **#47**. Test: clean, including against #42's `public/llms.txt`. Held on the new figures even though git is clean.

Handoff conflicts are notes, not site copy. Keep both texts or drop the `.aeo/daily/handoffs/` files from the release. Do not use them to pick a product winner.

### Schema fork, in plain terms

#49 (on top of #42) adds `isAccessibleForFree`, a contributor pointing at the organisation, an organiser taken from the event file or the venue name, `endDate` only when the file already has `endTime`, and an ItemList of Event on `/events`. Offer currency on that branch is IDR. It also keeps #42's previous and next links.

#48 adds `announced` on 17 event files (dinners #39 to #50 and five How I AI files) and emits `offers.validFrom` from that timestamp. Organiser is the venue. Contributor is the BSTC organisation. It does not add `isAccessibleForFree`, `endDate`, or the ItemList. The conflicting offer currency side is USD.

Tested conflicts when the second of those two is merged after the first:

- `src/lib/schema.ts` (1 hunk)
- `src/app/events/[slug]/page.tsx` (2 hunks)
- `src/app/how-i-build-with-ai/[slug]/page.tsx` (2 hunks)

#48's own commit message says it merges cleanly with #42. That part is true. It does not merge cleanly with #49.

#48's only `package.json` change is a `"test"` script pointing at `tests/event-schema.test.mjs`. No dependency was added. `package.json` is still an off-limits file for lane branches. This change is on Josh's PR.

## Conflicts found

| When | Files | Product? | Resolution in the scratch merge |
|---|---|---|---|
| #39 after #42 (with or without #49) | `content/events/hackathon-edition-1.md` | Yes | Take the deletion. #42 had set `schema: false` and `pastList: false`. #39 removes the file. Josh's 1 Nov ruling is to remove the page. |
| #51 after #49 | `.aeo/daily/handoffs/pending-shared-2026-11-10.md` | No | Handoff notes from two lanes. |
| #53 after #49 or #51 | `.aeo/daily/handoffs/pending-shared-2026-11-10.md` | No | Same handoff path on #49, #51, and #53. |
| #48 after #49, and #49 after #48 | `src/lib/schema.ts`, `src/app/events/[slug]/page.tsx`, `src/app/how-i-build-with-ai/[slug]/page.tsx` | Yes | No scratch resolution. Leave the unchosen PR open. |
| #48 after #42, either order | none | | Clean. |
| #40, #45, #47, #41 on the stacked tree | none | | Clean. |
| #48 then #51, dinners only | none | | Clean. Dinner #42 kept #51's title, meta, and credit line and #48's `announced` timestamp. |

24 event files are edited by both #42 and #39. Apart from the hackathon deletion, git auto-merged them in the scratch run. Auto-merge is not a wording review. Dinner #41 is the sample that was read: both the schema frontmatter and the credit line survived.

## Shared files, including the nine #46 dinners

#46 added only these files, now on main:

- `content/events/networking-drinks-dinner-canggu-42.md`
- `content/events/networking-drinks-dinner-canggu-43.md`
- `content/events/networking-drinks-dinner-canggu-44.md`
- `content/events/networking-drinks-dinner-canggu-45.md`
- `content/events/networking-drinks-dinner-canggu-46.md`
- `content/events/networking-drinks-dinner-canggu-47.md`
- `content/events/networking-drinks-dinner-canggu-48.md`
- `content/events/networking-drinks-dinner-canggu-49.md`
- `content/events/networking-drinks-dinner-canggu-50.md`

Live check at 4:19pm WITA: homepage 200, `/events/networking-drinks-dinner-canggu-42` 200, `/events/networking-drinks-dinner-canggu-50` 200, sitemap `<loc>` count 100. Full page text and JSON-LD were not re-crawled tonight.

What each PR actually does to those nine files, compared with `main` (not compared with a parent that lacks #46):

| PR | Dinners #42 to #50 versus main |
|---|---|
| #39 | No edit. Lachlan's 9 Nov note is not done on this parent. |
| #42 | No edit. `endTime`, `venueAddress`, and `organizer` were added on older files such as dinner #41, not on #42 to #50. |
| #49 | No content edit. GitHub lists the nine files because the #42 base does not contain #46, so the main merge shows them as new. The blob matches main. Schema code still derives an organiser from the venue line, and it does not emit `endDate` because these files have no `endTime`. |
| #51 | Real edit. Title and meta shortened. Credit line set to `Locally hosted by Yema Kitchen · Moderated by Bali Startup & Tech Community.` |
| #48 | Real edit. One frontmatter line: `announced: "2026-11-09T08:59:55+08:00"`. Titles, descriptions, and the #46 credit line stay as they are on main. |
| #53 | No content edit. GitHub lists the nine files for the same base-lag reason as #49. |
| #40, #41, #45, #47 | No edit. |

Dinner #39 to #41 are a different overlap. #39 rewrites titles and the credit line. #42 adds end time, address, and organiser. #48 adds `announced`. Those three auto-merge. #51 does not need to rewrite #39 to #41; that work is already on #39.

Title pattern is not the same across the set. #39's dinner #41 SEO title is `BSTC Networking Drinks & Dinner, Canggu #41`. #51's dinner #42 SEO title is `BSTC Networking Drinks & Dinner Canggu #42`.

### Other shared product paths

Paths below are edits versus `main`, so a file that only appears because a stack base is behind main is not listed.

| Path | PRs | Test |
|---|---|---|
| 23 event markdown files under `content/events/` (the #42 and #39 overlap, minus the hackathon) | #42, #39 | Auto-merged |
| `content/events/hackathon-edition-1.md` | #42 modifies, #39 deletes | Conflict. Take deletion |
| Dinners #39 to #50 `announced` | #48 | Auto-merges with #51's title edit |
| `src/lib/schema.ts`, both event templates | #42, #49, #48 | #49 stacks cleanly on #42. #48 conflicts with #49 |
| `src/lib/content.ts`, `src/lib/constants.ts` | #42, #48 | Clean in the #42 then #48 test. #48 leaves `EVENT_ORGANIZER` empty so BSTC is not the default organiser. #42 sets `totalMembers: 3900` and keeps `members: 2700` |
| `public/llms.txt` | #42, #47 | Clean. Different lines |
| `src/app/page.tsx`, `src/app/season.css`, `src/data/home.ts` | #40 | No second writer versus main |
| `src/app/faq/page.tsx` | #47 | No second writer versus main |
| `src/app/community/page.tsx` | #45 | Lane 2 owns this file. #51 does not change it versus main |
| `src/app/privacy/page.tsx`, `src/app/sponsors/page.tsx`, `src/data/perks.json` | #45 | Unowned |
| `src/app/perks/page.tsx`, `src/lib/perks.ts` | #51 | Unowned. Visible title, meta, and lede |
| `next.config.mjs` and the measure docs and scripts | #41, then #53 | Stack. #53's own commit edits the crawler, its test, and `docs/aeo/measure/` |
| `.aeo/daily/handoffs/pending-shared-2026-11-10.md` | #49, #51, #53 | Conflict |
| `.aeo/daily/handoffs/bstc-1-pm-2026-11-10.md` | #49, and this review's handoff | Same path, different jobs. #49's file is the lane 2 schema handoff. This review's copy is the integrator handoff. Keep both texts if both branches land |

`src/app/perks/page.tsx` on #51 still describes the programmes. The meta helper drops the activation, terms, and example counts from the description so it can fit 155 characters. The handoff says the page body still carries those counts.

## Hackathon release

These four are one release:

| Piece | Where | What the tree does |
|---|---|---|
| Unlist | #42 `643929d` and frontmatter | `schema: false`, `pastList: false`. Sitemap keeps events only when `pastList !== false`. |
| Delete the page | #39 `fdfc043` | File removed. |
| Remove the home card | #40 | Card and its link removed. The formats line becomes "Hackathons: coming soon, date TBA." The hero line becomes "Hackathons coming soon." |
| Redirect | #41 `7bb0939` | `/events/hackathon-edition-1` to `/events`, permanent. The `/join` rewrite was not in that hunk. |

#49 and #53 inherit their parents, so the unlist rides with #42 (and #49 if Path B) and the redirect rides with #41 (and #53).

## Off-limits check

No AEO draft above edits `src/app/api/**`, `NewsletterSignup.tsx`, `JoinSrcCarry.tsx`, `WhatsAppCTA.tsx`, `.env*`, `REVIEW-NOTES.md`, or the deck `pptx` / `py` files. #29 is the open PR that does, and it stays out of this order. #48 touches `package.json` only to add a test script.

## Citation log

#53 holds `docs/aeo/measure/citation-log-2026-11-10.csv` and the matching summary. 90 slots (Q01 to Q18, five engines). Status on every row: unavailable. Note on every row: `not collected: no engine access`. Observed at 2026-11-10T16:05:00+08:00. Named-BSTC is blank, not a "no". This review did not collect answers and does not turn that log into a score.

## QA gate

Not run tonight. No `npm ci`, tsc, lint, build, check-jsonld, or viewport render. Disk was not the reason (plenty of free space). This pass is the merge-order review. A missing check is not a pass. Heads to re-gate, if Josh wants a build before a yes, are the SHAs in the inventory table.

Mechanical `integrator:` fixes: none. #49, #51, #53, and #48 all have commits in the last three hours. This lane was also told not to push to any other PR branch.

## Decisions for Josh

1. Schema path. Path A lands #48 after #42 and leaves #49 open. Path B lands #49 after #42 and leaves #48 open. The other PR's extra fields (validFrom and `announced`, or free / endDate / ItemList / IDR) need a hand replay. A git merge of both stops on three files.
2. Confirm the 10 Nov, 3:52pm WITA line quoted on #48 ("Venue on all, BSTC team as moderator"), and whether "all" includes upcoming events. The 1 Nov ruling covered past events.
3. Yes or no on the hackathon release as one set: #42, #39, #40, #41. A partial yes should merge none of the four.
4. Yes or no on #51. It is the dinner #42 to #50 title, meta, and credit follow-through. It also changes the `/perks` title, description, and opening.
5. Yes or no on #45. The `/community` join answer now says joining and every event are free, and that people pay for their own food and drinks. The live "Are events free?" sentence is "Every BSTC event is free, and joining is free. You order and pay for your own food and drinks at the venue." They are not the same words. The branch is `08a-site-release`.
6. Yes or no on #47. New FAQ copy uses 100+ countries, 50+ events, a 4.7 rating from 155 ratings, and a weekly room of 100+ founders, operators, and VCs. It also answers Canggu founder events as How I AI at Seoul Soul Project and Networking Drinks & Dinner at Yema Kitchen.
7. Are Founder Dinners and Networking Night the same event? Live `/faq` still lists them separately. #46 and #51 call the Thursday series Networking Drinks & Dinner. #47 uses that name and does not mention Founder Dinners.
8. Dinner #42 to #50 after the chosen schema path: titles and the credit line change only if #51 lands. `endDate` still will not appear, because no PR adds `endTime` to those nine files. `validFrom` appears only if #48 lands. Is that split acceptable?
9. #40's homepage free answer is not the live `/faq` wording. Yes or no on that homepage copy, including the entity block.
10. Figures still waiting before they go into new copy: 1,200+ on WhatsApp, 100+ countries, 50+ events, and the 4.7 rating. Existing live lines stay. "Season 2" stays out of new copy. Edition 23 stays held until an RSVP exists. `llms-full.txt` was not added (#49 left a proposal only). Scoreboard location, Search Console and GA4 access, and the GitHub handle confirmation are still open. #7 and #8 stay open. #27 and #31 have no ruling. #29 stays out of this release.
