import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MEMBER_COOKIE, ROOMS_COOKIE } from "@/lib/members";
import { matchGroupIds } from "@/lib/community-groups";

const memberSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  whatsapp: z.string().min(1, "WhatsApp number is required"),
  linkedin: z.string().optional(),
  location: z.string().optional(),
  companyStage: z.string().optional(),
  openTo: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  building: z.string().optional(),
  // Honeypot — real users never fill this. Bots do.
  companyWebsite: z.string().optional(),
});

type MemberData = z.infer<typeof memberSchema>;

// Maps our form to Josh's Airtable column names. Empty optionals are omitted
// (single/multi-selects reject empty values).
function airtableFields(d: MemberData): Record<string, unknown> {
  const f: Record<string, unknown> = {
    "Full Name": d.fullName,
    "Email address": d.email,
    "WhatsApp Number (with country code)": d.whatsapp,
  };
  if (d.linkedin) f["LinkedIn Profile URL"] = d.linkedin;
  if (d.location) f["Location"] = d.location;
  if (d.companyStage) f["Company Stage"] = d.companyStage;
  if (d.openTo && d.openTo.length) f["What are you open to right now?"] = d.openTo;
  if (d.interests && d.interests.length) f["Interests"] = d.interests;
  if (d.building) f["What are you building?"] = d.building;
  return f;
}

// Sink 1 — Airtable (Josh's copy). Upserts on the email column. Fault-tolerant: if a column
// name doesn't exist in Josh's table, Airtable 422s naming the field — we drop it and retry so
// the rest of the record still saves. No-ops if unconfigured.
async function addToAirtable(d: MemberData) {
  const token = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_MEMBERS_TABLE || "Members";
  if (!token || !baseId) return;

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
  const fields = airtableFields(d);

  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        performUpsert: { fieldsToMergeOn: ["Email address"] },
        typecast: true,
        records: [{ fields }],
      }),
    });
    if (res.ok) return;

    const body = await res.text();
    if (res.status === 422 && body.includes("UNKNOWN_FIELD_NAME")) {
      let bad = "";
      try {
        const msg = (JSON.parse(body)?.error?.message as string) || "";
        bad = msg.match(/Unknown field name:\s*"(.+)"\s*$/)?.[1] || "";
      } catch {
        /* fall through */
      }
      if (bad && bad in fields) {
        delete fields[bad];
        continue; // retry without the offending field
      }
    }
    throw new Error(`Airtable ${res.status}: ${body}`);
  }
}

// Sink 2 — Google Sheet (Lachlan's copy), via a Google Apps Script Web App. No-ops if unconfigured.
async function addToGoogleSheet(d: MemberData) {
  const webhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhook) return;
  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: d.fullName,
      email: d.email,
      whatsapp: d.whatsapp,
      linkedin: d.linkedin || "",
      location: d.location || "",
      companyStage: d.companyStage || "",
      openTo: (d.openTo || []).join(", "),
      interests: (d.interests || []).join(", "),
      building: d.building || "",
      source: "Website member form",
    }),
  });
  if (!res.ok) throw new Error(`Google Sheet webhook ${res.status}`);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = memberSchema.parse(body);

    // Honeypot tripped: pretend success, store nothing.
    if (data.companyWebsite && data.companyWebsite.trim() !== "") {
      return NextResponse.json({ success: true, message: "You're in." }, { status: 200 });
    }

    const hasBackend = Boolean(process.env.AIRTABLE_API_KEY || process.env.GOOGLE_SHEET_WEBHOOK_URL);
    if (hasBackend) {
      // Both owned stores, best-effort — one failing never blocks the signup or the cookie.
      const results = await Promise.allSettled([addToAirtable(data), addToGoogleSheet(data)]);
      results.forEach((r) => {
        if (r.status === "rejected") console.error("Member signup sink error:", r.reason);
      });
    } else {
      console.log("Member signup (no backend configured):", data.email, "—", data.fullName);
    }

    const response = NextResponse.json(
      { success: true, message: "You're in. Welcome to BSTC." },
      { status: 200 }
    );
    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    };
    response.cookies.set(MEMBER_COOKIE, "1", cookieOpts);
    // Which WhatsApp rooms this member matched — /members renders these.
    response.cookies.set(ROOMS_COOKIE, matchGroupIds(data).join(","), cookieOpts);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    console.error("Member signup error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
