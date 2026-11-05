# Weekly citation measurement

Tags: medium | immediate | create new | measurement | Q01 to Q18.

Run every Monday. The next check is 9 November 2026. Josh's assistant collects the answers. Sunday preparation does not count as a citation check. This workflow uses manual public answers, plain Node and no API calls, keys, paid tools or analytics changes.

## Frozen questions and ownership

`prompt-map.csv` freezes the 18 questions verbatim from the approved context. Each question has an owner page and, where applicable, a secondary owner. Ask each question independently in ChatGPT with search, Perplexity, Gemini, Claude and Google AI Overview: 90 observations. Q01 to Q15 measure discovery; Q16 to Q18 measure brand accuracy only. Keep those groups separate in reporting.

bstc-hub not available. P mappings remain TODO(lachlan). When its strategy/aeo baseline and 48 prompts become readable, map Q IDs to existing P01 to P48 without editing those prompts. Genuinely new questions start at P49 after mapping review. Preserve the frozen question text and past logs when the map changes.

## Prepare a run

From the repository root:

```sh
node scripts/measure/prepare-run.mjs 2026-11-09 "$HOME/orca/evidence/bstc/citations"
```

This writes a run sheet and CSV with 90 pending slots. It refuses to overwrite existing files. `citation-log.csv` is a header-only template; do not commit real observations or full answers. If the evidence directory is not writable, prepare under ignored `.aeo/daily/handoffs/` and record that transfer is pending.

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
