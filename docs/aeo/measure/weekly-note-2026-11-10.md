# Weekly citation and owned-signups note

Tags: low | days | optimise existing | measurement | Q01 to Q18.

Week beginning: 9 Nov 2026
Prepared by: lane 5, 10 Nov 2026
Evidence directory and log: `docs/aeo/measure/citation-log-2026-11-10.csv` and `docs/aeo/measure/citation-summary-2026-11-10.csv`. Copy to `~/orca/evidence/bstc/citations` is pending. That directory was not on this machine.
Frozen prompt-map version/commit: `docs/aeo/measure/prompt-map.csv` as on draft #41 (`e056774`). Question text was not edited.
Observation timestamps (WITA): `2026-11-10T16:05:00+08:00` on every slot.
Engine models, search modes and locales: blank. No engine session was opened.

## Coverage

- Discovery Q01 to Q15: 0 completed / 75 planned.
- Brand accuracy Q16 to Q18: 0 completed / 15 planned.
- Missing: 0. Pending: 0. Unavailable: 90. No overview: 0.
- Differences from the last comparable run: no earlier completed log is in the repo. This run recorded no answers.

Sample count: 90 slots (18 questions, 5 engines), 0 complete answers. Engines, each with 18 unavailable slots: ChatGPT with search, Perplexity, Gemini, Claude, Google AI Overview. Date: 2026-11-10.

## Citations

`node scripts/measure/citation-summary.mjs docs/aeo/measure/citation-log-2026-11-10.csv 2026-11-10` accepted the log. Every row is `unavailable`. Outcome fields are blank. Unavailable is not a "no" for `named_bstc`.

No answer file was saved. A web search proxy was not used. The measurement README forbids filling a slot from a proxy.

What was tried, then stopped:

- ChatGPT, Gemini and Perplexity returned an app shell or a redirect, not a public answer, and need a signed-in session.
- Claude returned HTTP 403 on two requests.
- Google's non-browser response was a JavaScript shell with no AI Overview text. One headless Chrome load of the same query produced no document within 10 minutes and was stopped. It was not retried.
- No signed-in account was available for any of the five engines.

- Discovery change from a prior comparable run: no comparable baseline.
- Brand accuracy issues: not observed.
- Cited pages without a verified `/join` path: none. No page was cited.
- Owner actions and expected acquisition effect: none from this sample. No numerical forecast.

## Owned signups

no scoreboard figure yet

TODO(lachlan): bstc-hub scoreboard path, reporting window and metric definition.

## Decisions and next steps

TODO(josh): the five engines still need a person who can open a fresh conversation for each question. Do not backfill these 90 rows from memory or from ordinary web search.

TODO(josh): Search Console and GA4 remain read only. No submission was made. The host and sitemap recommendations are in `host-and-sitemap-2026-11-10.md`.

Next three evidence-backed actions:

1. Decide the apex 307 to 308 change. Not done here.
2. Decide the sitemap submission. Not done here.
3. Collect the 90 answers on a machine with the five engines, then replace this unavailable log with that run. Do not overwrite these rows in place with guesses.
