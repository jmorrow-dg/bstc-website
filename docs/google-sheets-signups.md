# Website signups → Google Sheets

The website owns the form and validation. Next.js API routes write directly to a
private Google Sheet using a Google service account. No Tally, Apps Script,
form-service subscription or new npm dependency is required for capture.
Standard Google API quotas and existing website hosting limits still apply.

## Connect the website once

1. In [Google Cloud Console](https://console.cloud.google.com/), select or create
   a BSTC-owned project and enable **Google Sheets API**.
2. Under **IAM & Admin → Service Accounts**, create a dedicated service account
   for BSTC signup capture. No project-wide role is needed to edit this sheet.
3. Create a JSON key for that service account if your organisation permits keys.
   Keep the downloaded key private; do not commit it or paste it into chat.
4. Open the private **BSTC — Community Signups** spreadsheet in Drive's ChatGPT
   folder. Share only that spreadsheet with the JSON file's `client_email` as
   **Editor**. Keep general access **Restricted**.
5. In the existing Vercel project, add these server-only environment variables:

   | Variable | Value |
   | --- | --- |
   | `GOOGLE_SHEETS_SPREADSHEET_ID` | The ID between `/d/` and `/edit` in the sheet URL |
   | `GOOGLE_SHEETS_TAB_NAME` | `Signups` |
   | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | JSON key's `client_email` |
   | `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | JSON key's complete `private_key`, including PEM markers |
   | `BSTC_WHATSAPP_INVITE_URL` | Tested General 2 invite; optional until ready |
   | `BSTC_TELEGRAM_URL` | Tested Telegram entry point; optional until ready |
   | `BSTC_UPDATES_URL` | Tested WhatsApp Updates Channel URL; optional until ready |

   Copy the key value with real line breaks or literal `\n` escapes, without
   JSON quotation marks around the whole value. Do not use a `NEXT_PUBLIC_`
   prefix for any variable above. Configure only trusted deployments; use a
   separate test sheet/service account for untrusted preview contributions.
6. Redeploy the website so its server functions pick up the variables. Preview
   and Production environments have separate Vercel settings.
7. Submit one registration using an organiser-controlled email. Verify all 24
   columns below, both unchecked consent choices and the returned joining links.
   Test an explicit email opt-in through the footer as well. Remove only your
   identified test rows after verification.
8. Merge and deploy the reviewed change, then repeat the check on production
   before sending the public `/join` link to the waiting list.

The Google connection in ChatGPT creates and manages the sheet; it does not give
the deployed website ongoing credentials. Until these settings are connected,
the API returns an unavailable error and the form does not claim success.

## Exact Signups schema

Keep this header row and order unchanged. The API appends A:X with `RAW` values,
so spreadsheet-looking input is stored as text rather than executed as formulas.

```text
submitted_at,submission_id,submission_type,name,email,whatsapp_name,phone,role,company,website,bali_connection,location,interests,building,looking_for,can_offer,referral_source,referral_code,preferred_channel,email_updates_opt_in,directory_opt_in,guidelines_accepted,consent_version,source_path
```

Required community fields are name, email, connection to Bali and acceptance of
the community guidelines. Profile fields are optional. Email updates and
member-directory consent are independent, unchecked choices. The newsletter-only
form records the same schema with profile fields empty and explicit email consent.
Submission time is server-generated UTC; source and submission type are set by
the endpoint. Form wording is versioned in `src/lib/signup.ts`.

The form preserves a submission UUID across retries, and the server normalizes
email addresses. This is an append-only ledger: a network interruption after an
append can leave a saved row even if the visitor sees an error. There are no
blind server retries and no guarantee of exactly-once delivery. Reconcile repeated
submission IDs and addresses before outreach; never delete history automatically.

An unchecked opt-in is not a later unsubscribe request. Respect explicit
unsubscribe/deletion requests and your email provider's suppression list. Do not
turn every row into a subscriber or re-subscribe an existing suppressed address.
The sheet stores email consent; it does not send email, verify email ownership or
publish a directory. Campaign sending and a directory are separate work.

## Operations and limits

- Keep the sheet private and grant access only to organisers and the dedicated
  service account. Store contact information only in private systems.
- The API validates field lengths and types, caps requests at 16 KB, checks
  browser origin when supplied, includes a honeypot and times out Google calls.
  These are basic controls, not bot-proof identity verification. Use the hosting
  firewall's rate limits if automated abuse becomes a problem.
- Private invitations are returned only after a confirmed append. Registrants can
  still forward them; use WhatsApp join approval and rotate leaked invitations.
- API errors do not log or reveal contact data, Google response bodies or keys.
- Missing configuration is 503; failed Google persistence is 502. No failure
  returns chat invitations or a successful registration message.
- Keep the header and tab name stable, review access periodically, and export
  private backups. Do not sort or edit the live ledger while recovering a failed
  write. Use a separate working tab for analysis.
- Sheets is a practical starting point for this backlog. At sustained high signup
  volume, move durable capture to a database and keep Sheets as an admin view.

## Retire the old form

There are no Tally links in the new website signup flow. Ask Josh for an export
of historical submissions and their original email/directory consent evidence.
Keep that export private and reconcile it separately; existing WhatsApp requests
are not newsletter opt-ins. Update any external Tally links only after production
capture is verified. Josh can then review whether that Tally subscription is used
elsewhere before cancelling it. This change does not cancel an account or import
historical records.

References: [Google service-account OAuth](https://developers.google.com/identity/protocols/oauth2/service-account)
and [Sheets values.append](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append).
