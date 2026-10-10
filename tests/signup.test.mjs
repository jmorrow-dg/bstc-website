import assert from "node:assert/strict";
import test from "node:test";
import { CONSENT_VERSION, SIGNUP_HEADERS, parseSignup, signupRow } from "../src/lib/signup.ts";

const submissionId = "16a6fd59-b6a9-4bb1-9f97-3c3d2a672998";
const valid = {
  submissionId,
  name: "  Ada Builder  ",
  email: "  Ada+BSTC@Example.com  ",
  baliConnection: "live",
  guidelinesAccepted: true,
};

test("minimal community signup normalizes email without enrolling people in email or directory", () => {
  const parsed = parseSignup(valid);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.name, "Ada Builder");
  assert.equal(parsed.data.email, "ada+bstc@example.com");
  assert.equal(parsed.data.emailUpdatesOptIn, false);
  assert.equal(parsed.data.directoryOptIn, false);
  assert.deepEqual(parsed.data.interests, []);
});

test("community email and directory consent are independent explicit booleans", () => {
  for (const [emailUpdatesOptIn, directoryOptIn] of [[true, false], [false, true], [true, true]]) {
    const parsed = parseSignup({ ...valid, emailUpdatesOptIn, directoryOptIn });
    assert.equal(parsed.success, true);
    assert.equal(parsed.data.emailUpdatesOptIn, emailUpdatesOptIn);
    assert.equal(parsed.data.directoryOptIn, directoryOptIn);
  }
  for (const field of ["emailUpdatesOptIn", "directoryOptIn"]) {
    const parsed = parseSignup({ ...valid, [field]: "true" });
    assert.equal(parsed.success, false);
    assert.ok(parsed.fieldErrors[field]);
  }
});

test("invalid required fields, enums, links and abusive text produce field errors", () => {
  const cases = [
    ["name", " "], ["email", "not-an-email"], ["name", 123],
    ["baliConnection", "maybe"], ["guidelinesAccepted", "true"],
    ["submissionId", "not-a-uuid"], ["preferredChannel", "unknown"],
    ["interests", ["Events", "unknown"]], ["interests", "Events"],
    ["building", "x".repeat(1501)], ["website", "javascript:alert(1)"],
    ["website", "https://user:password@example.com"], ["websiteTrap", "bot-value"],
  ];
  for (const [field, value] of cases) {
    const parsed = parseSignup({ ...valid, [field]: value });
    assert.equal(parsed.success, false, field);
    assert.ok(parsed.fieldErrors[field], field);
  }
  for (const value of [null, [], "x", 42]) assert.equal(parseSignup(value).success, false);
});

test("all profile fields map to exact 24-column ledger with server-controlled metadata", () => {
  const parsed = parseSignup({
    ...valid,
    whatsappName: "Ada W", phone: "+62 123", role: "Founder", company: "Ada Co",
    website: "https://example.com", location: "Canggu", interests: ["Events", "AI & building", "Events"],
    building: "A product", lookingFor: "Co-builders", canOffer: "Introductions",
    referralSource: "A friend", referralCode: "founder-dinner", preferredChannel: "telegram",
    emailUpdatesOptIn: true, directoryOptIn: false,
    consentVersion: "forged", sourcePath: "/forged", submissionType: "newsletter",
  });
  assert.equal(parsed.success, true);
  const row = signupRow(parsed.data, "community", "2026-10-10T00:00:00.000Z");
  assert.equal(SIGNUP_HEADERS.length, 24);
  assert.equal(row.length, 24);
  const record = Object.fromEntries(SIGNUP_HEADERS.map((header, index) => [header, row[index]]));
  assert.deepEqual(record, {
    submitted_at: "2026-10-10T00:00:00.000Z", submission_id: submissionId,
    submission_type: "community", name: "Ada Builder", email: "ada+bstc@example.com",
    whatsapp_name: "Ada W", phone: "+62 123", role: "Founder", company: "Ada Co",
    website: "https://example.com", bali_connection: "live", location: "Canggu",
    interests: "Events; AI & building", building: "A product", looking_for: "Co-builders",
    can_offer: "Introductions", referral_source: "A friend", referral_code: "founder-dinner",
    preferred_channel: "telegram", email_updates_opt_in: true, directory_opt_in: false,
    guidelines_accepted: true, consent_version: CONSENT_VERSION, source_path: "/join",
  });
});

test("newsletter accepts the current email/consent contract with no implied profile or directory consent", () => {
  const parsed = parseSignup({ email: " List@Example.com ", consent: true, name: "Ignored", directoryOptIn: true }, "newsletter", submissionId);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.email, "list@example.com");
  assert.equal(parsed.data.submissionId, submissionId);
  assert.equal(parsed.data.name, "");
  assert.equal(parsed.data.emailUpdatesOptIn, true);
  assert.equal(parsed.data.directoryOptIn, false);
  assert.equal(parsed.data.guidelinesAccepted, false);
  assert.equal(signupRow(parsed.data, "newsletter", "now").at(-1), "/newsletter");
  for (const consent of [undefined, false, "true"]) {
    assert.equal(parseSignup({ email: "list@example.com", consent }, "newsletter", submissionId).success, false);
  }
});
