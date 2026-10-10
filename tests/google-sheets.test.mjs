import assert from "node:assert/strict";
import { generateKeyPairSync, verify } from "node:crypto";
import test from "node:test";
import { handleSignupRequest, saveSignup, signupConfigFromEnvironment } from "../src/lib/google-sheets.ts";
import { parseSignup } from "../src/lib/signup.ts";

// Locally generated test key only. Every OAuth and Sheets request is mocked.
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});
let account = 0;
const config = () => ({
  spreadsheetId: "bstc-test-sheet",
  serviceAccountEmail: `test-${++account}@example.iam.gserviceaccount.com`,
  privateKey,
});
const input = {
  submissionId: "16a6fd59-b6a9-4bb1-9f97-3c3d2a672998", name: "Ada", email: "ada@example.com",
  baliConnection: "live", guidelinesAccepted: true,
};
const signup = parseSignup(input).data;
const token = () => Response.json({ access_token: "test-access-token", expires_in: 3600 });
const appended = (updatedRows = 1) => Response.json({ spreadsheetId: "bstc-test-sheet", updates: { updatedRows } });

function provider(responses) {
  const calls = [];
  return {
    calls,
    fetcher: async (url, init) => {
      calls.push({ url, ...init });
      const response = responses.shift();
      assert.ok(response, "Unexpected network call");
      if (response instanceof Error) throw response;
      return response;
    },
  };
}

function request(body, options = {}) {
  return new Request(options.url || "https://preview.vercel.app/api/community/signup", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://preview.vercel.app", ...options.headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("missing or malformed configuration never writes or reports success", async () => {
  for (const incomplete of [{}, { spreadsheetId: "sheet" }, { ...config(), privateKey: "broken-key" }, { ...config(), spreadsheetId: "../invalid" }]) {
    const mock = provider([]);
    const result = await saveSignup(signup, "community", incomplete, mock.fetcher);
    assert.equal(result.status, 503);
    assert.equal(result.success, false);
    assert.equal(mock.calls.length, 0);
  }
});

test("OAuth assertion has a verified RS256 signature, narrow scope and bounded lifetime", async () => {
  const settings = config();
  const mock = provider([token(), appended()]);
  const now = Date.parse("2026-10-10T00:00:00Z");
  const result = await saveSignup(signup, "community", settings, mock.fetcher, now);
  assert.equal(result.success, true);
  const exchange = mock.calls[0];
  assert.equal(exchange.url, "https://oauth2.googleapis.com/token");
  assert.equal(exchange.method, "POST");
  const form = new URLSearchParams(exchange.body);
  assert.equal(form.get("grant_type"), "urn:ietf:params:oauth:grant-type:jwt-bearer");
  const parts = form.get("assertion").split(".");
  assert.deepEqual(JSON.parse(Buffer.from(parts[0], "base64url")), { alg: "RS256", typ: "JWT" });
  const claims = JSON.parse(Buffer.from(parts[1], "base64url"));
  assert.equal(claims.iss, settings.serviceAccountEmail);
  assert.equal(claims.scope, "https://www.googleapis.com/auth/spreadsheets");
  assert.equal(claims.aud, exchange.url);
  assert.equal(claims.iat, now / 1000);
  assert.equal(claims.exp - claims.iat, 3600);
  assert.equal(verify("RSA-SHA256", Buffer.from(parts.slice(0, 2).join(".")), publicKey, Buffer.from(parts[2], "base64url")), true);
});

test("append uses RAW text, a quoted tab range and one complete row without reading the Sheet", async () => {
  const mock = provider([token(), appended()]);
  const injected = { ...signup, name: '=IMPORTXML("https://example.com", "//x")', phone: "+621234" };
  const result = await saveSignup(injected, "community", { ...config(), tabName: "Member's Signups" }, mock.fetcher);
  assert.equal(result.success, true);
  assert.equal(mock.calls.length, 2);
  const append = mock.calls[1];
  const url = new URL(append.url);
  assert.equal(url.searchParams.get("valueInputOption"), "RAW");
  assert.equal(url.searchParams.get("insertDataOption"), "INSERT_ROWS");
  assert.ok(decodeURIComponent(url.pathname).endsWith("/'Member''s Signups'!A:X:append"));
  assert.equal(append.headers.Authorization, "Bearer test-access-token");
  const body = JSON.parse(append.body);
  assert.equal(body.range, "'Member''s Signups'!A:X");
  assert.equal(body.values.length, 1);
  assert.equal(body.values[0].length, 24);
  assert.equal(body.values[0][3], injected.name);
  assert.equal(body.values[0][6], injected.phone);
  for (const call of mock.calls) {
    assert.equal(call.cache, "no-store");
    assert.ok(call.signal instanceof AbortSignal);
    assert.equal(call.method, "POST");
  }
});

test("a usable access token is cached and renewed before expiry", async () => {
  const settings = config();
  const mock = provider([token(), appended(), appended(), token(), appended()]);
  const now = Date.now();
  assert.equal((await saveSignup(signup, "community", settings, mock.fetcher, now)).success, true);
  assert.equal((await saveSignup(signup, "community", settings, mock.fetcher, now + 60_000)).success, true);
  assert.equal((await saveSignup(signup, "community", settings, mock.fetcher, now + 3_550_000)).success, true);
  assert.equal(mock.calls.filter((call) => call.url.includes("oauth2")).length, 2);
  assert.equal(mock.calls.filter((call) => call.url.includes("sheets.googleapis")).length, 3);
});

test("OAuth denial, malformed tokens, append denial and ambiguous writes never claim success", async () => {
  const sequences = [
    [Response.json({ private: "secret detail" }, { status: 403 })],
    [Response.json({ access_token: "token" })],
    [token(), Response.json({}, { status: 403 })],
    [token(), appended(0)], [token(), appended(2)],
    [token(), Response.json({ spreadsheetId: "other-sheet", updates: { updatedRows: 1 } })],
    [token(), new Response("invalid json")],
    [new Error("secret network detail")],
    [token(), new DOMException("Timed out", "TimeoutError")],
  ];
  for (const responses of sequences) {
    const expectedCalls = responses.length;
    const mock = provider(responses);
    const result = await saveSignup(signup, "community", config(), mock.fetcher);
    assert.equal(result.status, 502);
    assert.equal(result.success, false);
    assert.doesNotMatch(result.message, /secret|Timed out/);
    assert.equal(mock.calls.length, expectedCalls, "must not retry an uncertain append");
  }
});

test("HTTP success releases only valid configured joining links after a confirmed save", async () => {
  const mock = provider([token(), appended()]);
  const response = await handleSignupRequest(request(input), "community", {
    ...config(), whatsappUrl: "https://chat.whatsapp.com/private-test", telegramUrl: "https://t.me/bstc-test", updatesUrl: "javascript:alert(1)",
  }, mock.fetcher);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = await response.json();
  assert.equal(body.success, true);
  assert.deepEqual(body.channels.map((channel) => channel.id), ["whatsapp", "telegram"]);
  assert.equal(body.channels[0].url, "https://chat.whatsapp.com/private-test");
  assert.equal(mock.calls.length, 2);
});

test("private invitations are absent on validation, missing config and provider failures", async () => {
  for (const scenario of ["validation", "configuration", "provider"]) {
    const mock = provider(scenario === "provider" ? [token(), Response.json({}, { status: 429 })] : []);
    const settings = { ...(scenario === "configuration" ? {} : config()), whatsappUrl: "https://chat.whatsapp.com/secret-link" };
    const response = await handleSignupRequest(request(scenario === "validation" ? { ...input, email: "bad" } : input), "community", settings, mock.fetcher);
    assert.equal(response.status, scenario === "validation" ? 400 : scenario === "configuration" ? 503 : 502);
    const body = await response.text();
    assert.doesNotMatch(body, /secret-link|channels/);
  }
});

test("same-origin previews work while foreign and malformed Origins are denied before writes", async () => {
  for (const origin of ["https://unrelated.example", "null", "bad origin"]) {
    const mock = provider([]);
    const response = await handleSignupRequest(request(input, { headers: { origin } }), "community", config(), mock.fetcher);
    assert.equal(response.status, 403);
    assert.equal(mock.calls.length, 0);
  }
  const mock = provider([token(), appended()]);
  const response = await handleSignupRequest(request(input, { headers: { origin: "https://balistartupandtech.com" } }), "community", {
    ...config(), siteUrl: "https://balistartupandtech.com",
  }, mock.fetcher);
  assert.equal(response.status, 200);
});

test("honeypot, malformed bodies, unsupported media and actual oversized bodies never write", async () => {
  const cases = [
    [request({ ...input, websiteTrap: "spam" }), 400],
    [request("{bad json"), 400],
    [request(input, { headers: { "content-type": "text/plain" } }), 415],
    [request({ ...input, building: "a".repeat(17_000) }), 413],
    [request(input, { headers: { "content-length": "17000" } }), 413],
  ];
  for (const [req, status] of cases) {
    const mock = provider([]);
    const response = await handleSignupRequest(req, "community", config(), mock.fetcher);
    assert.equal(response.status, status);
    assert.equal(mock.calls.length, 0);
  }
});

test("newsletter saves explicit email consent with generated ID and releases no invitations", async () => {
  const mock = provider([token(), appended()]);
  const response = await handleSignupRequest(request({ email: " List@Example.com ", consent: true }), "newsletter", {
    ...config(), whatsappUrl: "https://chat.whatsapp.com/secret-link",
  }, mock.fetcher);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.success, true);
  assert.equal(body.channels, undefined);
  const row = JSON.parse(mock.calls[1].body).values[0];
  assert.match(row[1], /^[0-9a-f-]{36}$/);
  assert.equal(row[2], "newsletter");
  assert.equal(row[3], "");
  assert.equal(row[4], "list@example.com");
  assert.equal(row[19], true);
  assert.equal(row[20], false);
  assert.equal(row[21], false);
  assert.equal(row[23], "/newsletter");
});

test("environment reader uses server-only names for credentials and invite links", () => {
  const settings = signupConfigFromEnvironment({
    GOOGLE_SHEETS_SPREADSHEET_ID: "sheet", GOOGLE_SERVICE_ACCOUNT_EMAIL: "service@example.com",
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: "key", GOOGLE_SHEETS_TAB_NAME: "Signups", SITE_URL: "https://bstc.community",
    BSTC_WHATSAPP_INVITE_URL: "https://chat.whatsapp.com/private", NEXT_PUBLIC_BSTC_WHATSAPP_JOIN_URL: "https://example.com/old",
  });
  assert.equal(settings.spreadsheetId, "sheet");
  assert.equal(settings.whatsappUrl, "https://chat.whatsapp.com/private");
  assert.equal(settings.telegramUrl, undefined);
  assert.equal(settings.siteUrl, "https://bstc.community");
});
