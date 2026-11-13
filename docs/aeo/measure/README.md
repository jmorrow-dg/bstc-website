# Weekly citation measurement

Tags: medium | immediate | create new | measurement | Q01 to Q18.

Run every Monday. The next check is 16 November 2026; the 9 and 10 November checks collected nothing (no engine access). Josh's assistant collects the answers. Sunday preparation does not count as a citation check. This workflow uses manual public answers, plain Node and no API calls, keys, paid tools or analytics changes.

## Frozen questions and ownership

`prompt-map.csv` freezes the 18 questions verbatim from the approved context. Each question has an owner page and, where applicable, a secondary owner. Ask each question independently in ChatGPT with search, Perplexity, Gemini, Claude and Google AI Overview: 90 observations. Q01 to Q15 measure discovery; Q16 to Q18 measure brand accuracy only. Keep those groups separate in reporting.

bstc-hub not available. P mappings remain TODO(lachlan). When its strategy/aeo baseline and 48 prompts become readable, map Q IDs to existing P01 to P48 without editing those prompts. Genuinely new questions start at P49 after mapping review. Preserve the frozen question text and past logs when the map changes.

## Prepare a run

From the repository root:

```sh
node scripts/measure/prepare-run.mjs 2026-11-09 "$HOME/orca/evidence/bstc/citations"
```

This writes a run sheet, a CSV with 90 pending slots and `collector-YYYY-MM-DD.html`, the page the collector works from. It refuses to overwrite existing files. `citation-log.csv` is a header-only template; do not commit real observations or full answers. If the evidence directory is not writable, prepare under ignored `.aeo/daily/handoffs/` and record that transfer is pending.

## Engine access (checked 13 November 2026)

The engines stop automated clients, so a person collects the answers in a normal browser. On 13 November each engine was asked Q01 once with a plain request and once in signed-out headless Chrome, with no login:

| Engine | Automated result | For the person collecting |
| --- | --- | --- |
| ChatGPT with search | App shell, then a Cloudflare verification page | Opens signed out. The link `https://chatgpt.com/?q=QUESTION&hints=search` runs the question |
| Perplexity | Cloudflare challenge (403) | `https://www.perplexity.ai/search/new?q=QUESTION` runs the question |
| Gemini | App shell; the signed-out page loads and offers a chat | No question link. Open `https://gemini.google.com/app` and paste the question |
| Claude | Cloudflare challenge (403) | Needs a signed-in account. `https://claude.ai/new?q=QUESTION` fills in the question |
| Google AI Overview | No results without a browser; headless Chrome got the "unusual traffic" page | `https://www.google.com/search?q=QUESTION&hl=en&gl=id` (English, Indonesia) |

Never script the engines, and never try to get past a bot check. A blocked engine is logged as `unavailable` with the reason. Which engines answer without an account can change, so the first question of every run doubles as an access check. Engines answer by location: write the location and any VPN in the Locale box and keep it the same each week.

## Collect with the collector page

Open `collector-YYYY-MM-DD.html` in the browser. Each question has a link into each engine and a box per engine. Paste the whole answer into its box: the page stamps the time, keeps the answer's links, and suggests whether BSTC is named (check it against what you read). Set a box to `unavailable` or `no_overview` with a note when there is no answer. The page works offline, loads nothing from pasted answers, and saves progress in the browser. Export writes `collected-YYYY-MM-DD.json`.

Then, from the repository root:

```sh
node scripts/health/crawl.mjs
node scripts/measure/collector.mjs import "$HOME/Downloads/collected-2026-11-16.json" "$HOME/orca/evidence/bstc/citations" "$HOME/orca/evidence/bstc/health-2026-11-16/crawl.json"
```

The import fills the log, writes each answer to `answers/YYYY-MM-DD/`, and takes `links_to_join` from the crawl: the cited page's own outlinks, with no extra request. A cited page that isn't in the crawl is `unknown`. It rejects any row the summary would reject and never replaces a row that already holds an observation. The rules below still apply; the page only removes the typing.

## Collect consistently

1. Use a fresh conversation for each exact question; no BSTC context, leading follow-ups or prior answers. For Google, enter the exact question in search and record whether an AI Overview appears. Do not substitute ordinary search snippets for an overview.
2. Record the time including timezone, such as `2026-11-09T09:00:00+08:00`, the model label shown (or `not shown`), search mode and locale. Use the same locale and settings across runs where possible; record changes. For ChatGPT, search must be enabled. If any engine's search feature is unavailable, record that limitation.
3. Save the complete public answer and its citation destinations in an untracked `answers/` file. Include the exact prompt, time, engine and environment. Avoid private account details and member data. Screenshots can supplement the transcript.
4. Score the observed answer manually. Do not infer mention or citation from an owner's page being in the prompt map. Do not make additional API calls.
5. Open the cited BSTC page read-only. Inspect whether it has a visible link whose destination is the owned `https://www.balistartupandtech.com/join` or its relative `/join` equivalent, including query strings. Record the check time. Do not submit the form. If the page cannot be inspected, record `unknown`.
6. For Q16 to Q18, note inaccuracies against approved facts: joining uses /join; joining and events are free; people pay for their food and drinks; How I AI details come from the approved context. Do not rewrite the question to improve an answer.

## CSV fields

| Field | Meaning |
| --- | --- |
| run_date | Scheduled check date, YYYY-MM-DD |
| question_id | Q01 to Q18 |
| engine | Exact engine label from the prepared CSV |
| status | pending, complete, unavailable, or no_overview (Google only) |
| observed_at | Observation timestamp with timezone; required except pending |
| model | Model label displayed, or not shown |
| search_mode | Search setting actually used; record unavailable where relevant |
| locale | Language and country/region used |
| named_bstc | yes or no for a complete answer; yes means BSTC or its full name clearly identifies this community |
| linked_url | Exact BSTC hyperlink in the answer, blank when absent |
| cited_page | Destination of the primary BSTC citation, blank when absent; preserve all additional citations in the answer evidence and notes |
| links_to_join | yes, no, unknown, or not_applicable when there is no cited page |
| join_checked_at | Timestamp with timezone for yes/no join checks |
| answer_file | Relative path to the saved complete answer and citations |
| notes | Limitations, additional links, inaccuracies, or reason for unavailable/no_overview |

A slot that was never run gets `status=unavailable`, the time it was marked, and the note `not collected: no engine access`. Never fill a slot from a guess or from a web search proxy check; a proxy result can rank work but is not an engine answer.

Do not treat missing observations as negative answers. Leave outcome fields blank for pending, unavailable and no_overview rows. A completed answer with no mention can legitimately have named_bstc=no, empty links, and links_to_join=not_applicable. A hyperlink without a clear name can have named_bstc=no and a linked URL. Record what was shown.

Use standard CSV quoting for commas, quotes and multiline notes. The summary rejects malformed fields, duplicate observations, unknown question/engine identifiers and contradictory check states. One row per date, question and engine. Preserve any rerun as a separate evidence file and explain which run is reported; do not cherry-pick or silently overwrite.

## Summarise and report

```sh
node scripts/measure/citation-summary.mjs "$HOME/orca/evidence/bstc/citations/citation-log-2026-11-09.csv" 2026-11-09
```

CSV goes to stdout; coverage counts and limitations go to stderr. The output includes every question and engine, including missing slots. The script validates recorded fields but does not independently verify transcript truth or fetch cited pages. Review the source evidence before reporting.

Use `weekly-note-template.md` to place citation results next to owned signups. Until Lachlan shares the scoreboard path, report **no scoreboard figure yet**. Never substitute estimates, invent a target or claim causal signup improvement from citation changes. Search Console and GA4 may be read once Josh grants access (Josh, 1 Nov 2026). Never submit a sitemap, URL or IndexNow ping.

## Daily site health run

Read-only checks of the live site, plain Node, no dependencies. Evidence goes to `~/orca/evidence/bstc/health-YYYY-MM-DD/` (WITA date) and is never committed.

```sh
node scripts/health/crawl.mjs                 # every sitemap URL: summary.md, crawl.csv, crawl.json
node scripts/health/live-checks.mjs           # endpoints, known live issues, perks and member offer counts
node scripts/health/crawl-diff.mjs OLD/crawl.json NEW/crawl.json NEW/crawl-diff.md
```

Run the crawl first; live checks read its `crawl.json`. `summary.md` compares each metric with the baseline in `crawl.mjs`; update that baseline only when the daily prompt gives a new one. The diff lists added and removed URLs and every changed field, including the inbound pages each URL lost or gained. Expect many `lastmod` rows after a deploy: static pages carry the build time.

The accessibility columns (`htmlLang`, `imgNoAlt`, `unnamedLinks`, `unnamedButtons`, `headingSkips`) and `hiddenOnLoad` come from server HTML. They catch missing names and structure, not contrast, focus order or anything that needs a browser. They don't replace Lighthouse, which needs 10 GiB or more free disk.
