import assert from "node:assert/strict";
import test from "node:test";
import {
  canRsvpToEvent,
  formatBaliEventDate,
  getBaliDate,
  getEventState,
  isValidEventDate,
} from "../src/lib/event-status.ts";

const now = new Date("2026-10-10T12:00:00Z");
const scheduled = (date, extra = {}) => ({
  date,
  status: "upcoming",
  rsvpUrl: "https://www.meetup.com/bali-start-ups-tech-community/",
  ...extra,
});

test("old upcoming entries become historical without asserting completion", () => {
  const event = scheduled("2026-06-24");
  assert.equal(getEventState(event, now), "past");
  assert.equal(canRsvpToEvent(event, now), false);
  assert.equal(event.status, "upcoming");
});

test("upcoming means today or later in Bali", () => {
  assert.equal(getEventState(scheduled("2026-10-09"), now), "past");
  assert.equal(getEventState(scheduled("2026-10-10"), now), "upcoming");
  assert.equal(getEventState(scheduled("2026-10-21"), now), "upcoming");
  assert.equal(canRsvpToEvent(scheduled("2026-10-21"), now), true);
});

test("eligibility changes at Bali midnight, eight hours ahead of UTC", () => {
  const event = scheduled("2026-10-10");
  const before = new Date("2026-10-10T15:59:59.999Z");
  const midnight = new Date("2026-10-10T16:00:00.000Z");
  assert.equal(getBaliDate(before), "2026-10-10");
  assert.equal(getBaliDate(midnight), "2026-10-11");
  assert.equal(getEventState(event, before), "upcoming");
  assert.equal(getEventState(event, midnight), "past");
  assert.equal(canRsvpToEvent(event, midnight), false);
});

test("calendar comparison handles month and year boundaries", () => {
  const yearEnd = new Date("2026-12-31T15:59:59Z");
  const newYear = new Date("2026-12-31T16:00:00Z");
  assert.equal(getEventState(scheduled("2026-12-31"), yearEnd), "upcoming");
  assert.equal(getEventState(scheduled("2026-12-31"), newYear), "past");
  assert.equal(getEventState(scheduled("2027-01-01"), newYear), "upcoming");
  assert.equal(getEventState(scheduled("2026-09-30"), now), "past");
  assert.equal(getEventState(scheduled("2026-11-01"), now), "upcoming");
});

test("completed events stay historical even if their dates are in the future", () => {
  const event = scheduled("2026-10-21", { status: "completed" });
  assert.equal(getEventState(event, now), "past");
  assert.equal(canRsvpToEvent(event, now), false);
});

test("invalid and rolled-over dates never permit registration", () => {
  for (const date of ["", "not-a-date", "2026-02-29", "2026-04-31", "2026-13-01", "2026-1-01", "2026-10-21T00:00:00Z", undefined]) {
    assert.equal(isValidEventDate(date), false, String(date));
    assert.equal(getEventState(scheduled(date), now), "unavailable", String(date));
    assert.equal(canRsvpToEvent(scheduled(date), now), false, String(date));
  }
  assert.equal(isValidEventDate("2028-02-29"), true);
  assert.equal(getEventState(scheduled("2026-10-21"), new Date("invalid")), "unavailable");
});

test("only an explicitly upcoming event with a usable RSVP URL permits registration", () => {
  for (const status of [undefined, "draft", "cancelled", "postponed"]) {
    const event = scheduled("2026-10-21", { status });
    assert.equal(getEventState(event, now), "unavailable");
    assert.equal(canRsvpToEvent(event, now), false);
  }
  for (const rsvpUrl of [undefined, "", "#", "/join", "javascript:alert(1)"]) {
    assert.equal(canRsvpToEvent(scheduled("2026-10-21", { rsvpUrl }), now), false);
  }
});

test("display dates retain the Bali calendar day regardless of server time zone", () => {
  assert.equal(formatBaliEventDate("2026-10-21"), "Wednesday, October 21, 2026");
  assert.equal(formatBaliEventDate("2026-01-01"), "Thursday, January 1, 2026");
  assert.equal(formatBaliEventDate("2026-02-29"), "Date to be confirmed");
});
