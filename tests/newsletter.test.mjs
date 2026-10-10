import assert from "node:assert/strict";
import test from "node:test";
import { subscribeNewsletter } from "../src/lib/newsletter.ts";

// No credentials or live network calls: every provider response is mocked.
const config = { apiKey: "test-api-key", segmentId: "bstc-segment" };
const email = "member+events@example.com";
const contact = { id: "contact-1", unsubscribed: false };
const json = (body, status = 200) => Response.json(body, { status });

function mockProvider(responses) {
  const calls = [];
  return {
    calls,
    fetcher: async (url, init) => {
      calls.push({ url, ...init });
      const response = responses.shift();
      assert.ok(response, "Unexpected provider request");
      if (response instanceof Error) throw response;
      return response;
    },
  };
}

test("missing newsletter configuration never reports success or calls the provider", async () => {
  for (const incomplete of [{}, { apiKey: "key" }, { segmentId: "segment" }, { apiKey: " ", segmentId: "segment" }]) {
    let calls = 0;
    const result = await subscribeNewsletter(email, incomplete, async () => {
      calls++;
      throw new Error("Must not call provider");
    });
    assert.equal(result.status, 503);
    assert.equal(result.success, false);
    assert.equal(calls, 0);
  }
});

test("a new email is persisted in the intended segment and checked before success", async () => {
  const provider = mockProvider([
    json({ name: "not_found" }, 404),
    json({ object: "contact", id: contact.id }, 201),
    json(contact),
  ]);
  const result = await subscribeNewsletter(email, config, provider.fetcher);
  assert.equal(result.success, true);
  assert.equal(result.status, 200);
  assert.equal(provider.calls.length, 3);
  assert.equal(provider.calls[0].url, "https://api.resend.com/contacts/member%2Bevents%40example.com");
  assert.equal(provider.calls[1].url, "https://api.resend.com/contacts");
  assert.equal(provider.calls[1].method, "POST");
  assert.deepEqual(JSON.parse(provider.calls[1].body), {
    email,
    segments: [{ id: config.segmentId }],
  });
  assert.equal(provider.calls[2].url, provider.calls[0].url);
  for (const call of provider.calls) {
    assert.equal(call.headers.Authorization, "Bearer test-api-key");
    assert.equal(call.cache, "no-store");
    assert.ok(call.signal instanceof AbortSignal);
  }
});

test("a repeated signup reuses the global contact without creating or resubscribing it", async () => {
  const provider = mockProvider([json(contact), json({ id: config.segmentId })]);
  const result = await subscribeNewsletter(email, config, provider.fetcher);
  assert.equal(result.success, true);
  assert.equal(provider.calls.length, 2);
  assert.equal(provider.calls[1].url, "https://api.resend.com/contacts/contact-1/segments/bstc-segment");
  assert.equal(provider.calls[1].method, "POST");
  assert.equal(provider.calls[1].body, undefined);
});

test("an existing opt-out is preserved with no provider mutation", async () => {
  const provider = mockProvider([json({ ...contact, unsubscribed: true })]);
  const result = await subscribeNewsletter(email, config, provider.fetcher);
  assert.equal(result.status, 409);
  assert.equal(result.success, false);
  assert.equal(provider.calls.length, 1);
  assert.equal(provider.calls[0].method, undefined);
});

test("a contact created concurrently with an opt-out is not reported as subscribed", async () => {
  const provider = mockProvider([
    json({}, 404),
    json({ id: contact.id }),
    json({ ...contact, unsubscribed: true }),
  ]);
  const result = await subscribeNewsletter(email, config, provider.fetcher);
  assert.equal(result.status, 409);
  assert.equal(result.success, false);
  assert.equal("unsubscribed" in JSON.parse(provider.calls[1].body), false);
});

test("provider lookup errors are not mistaken for missing contacts", async () => {
  for (const status of [401, 403, 429, 500]) {
    const provider = mockProvider([json({ message: "private provider detail" }, status)]);
    const result = await subscribeNewsletter(email, config, provider.fetcher);
    assert.equal(result.status, 502);
    assert.equal(result.success, false);
    assert.equal(provider.calls.length, 1);
    assert.doesNotMatch(result.message, /private provider detail/);
  }
});

test("creation and segment failures never produce a false success", async () => {
  const sequences = [
    [json({}, 404), json({}, 500)],
    [json({}, 404), json({})],
    [json({}, 404), json({ id: contact.id }), json({}, 429)],
    [json(contact), json({}, 500)],
    [json(contact), json({ id: "wrong-segment" })],
  ];
  for (const responses of sequences) {
    const provider = mockProvider(responses);
    const result = await subscribeNewsletter(email, config, provider.fetcher);
    assert.equal(result.status, 502);
    assert.equal(result.success, false);
  }
});

test("missing or malformed subscription state fails closed without writing", async () => {
  for (const response of [json({ id: contact.id }), json(null), new Response("not json")]) {
    const provider = mockProvider([response]);
    const result = await subscribeNewsletter(email, config, provider.fetcher);
    assert.equal(result.status, 502);
    assert.equal(result.success, false);
    assert.equal(provider.calls.length, 1);
  }
});

test("network failures and timeouts return a safe retryable message", async () => {
  for (const error of [new Error("private network detail"), new DOMException("Timed out", "TimeoutError")]) {
    const provider = mockProvider([error]);
    const result = await subscribeNewsletter(email, config, provider.fetcher);
    assert.equal(result.status, 502);
    assert.equal(result.success, false);
    assert.doesNotMatch(result.message, /private network detail|Timed out/);
  }
});
