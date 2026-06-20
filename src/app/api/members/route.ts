import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MEMBER_COOKIE } from "@/lib/members";

const memberSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  building: z.string().optional(),
  role: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  interests: z.array(z.string()).optional(),
  // Honeypot — real users never fill this. Bots do.
  companyWebsite: z.string().optional(),
});

type MemberData = z.infer<typeof memberSchema>;

// Sink 1 — Google Sheet (Lachlan's copy), via a Google Apps Script Web App that appends a row.
// No-ops if unconfigured.
async function addToGoogleSheet(data: MemberData) {
  const webhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhook) return;
  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.email,
      name: data.name,
      company: data.company || "",
      building: data.building || "",
      role: data.role || "",
      linkedin: data.linkedin || "",
      website: data.website || "",
      interests: (data.interests || []).join(", "),
      source: "Website member hub",
    }),
  });
  if (!res.ok) throw new Error(`Google Sheet webhook ${res.status}`);
}

// Sink 2 — Airtable (Josh's copy). Upserts on Email. No-ops if unconfigured.
// Members table columns: Email, Name, Company, Building, Role, LinkedIn, Website, Interests, Source.
async function addToAirtable(data: MemberData) {
  const token = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_MEMBERS_TABLE || "Members";
  if (!token || !baseId) return;

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      performUpsert: { fieldsToMergeOn: ["Email"] },
      typecast: true,
      records: [
        {
          fields: {
            Email: data.email,
            Name: data.name,
            Company: data.company || "",
            Building: data.building || "",
            Role: data.role || "",
            LinkedIn: data.linkedin || "",
            Website: data.website || "",
            Interests: (data.interests || []).join(", "),
            Source: "Website member hub",
          },
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = memberSchema.parse(body);

    // Honeypot tripped: pretend success, store nothing.
    if (data.companyWebsite && data.companyWebsite.trim() !== "") {
      return NextResponse.json({ success: true, message: "You're in." }, { status: 200 });
    }

    const hasBackend = Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.AIRTABLE_API_KEY);
    if (hasBackend) {
      // Write to both owned stores. Best-effort — one sink failing must not block the signup,
      // and a member captured in either store is not lost.
      const results = await Promise.allSettled([addToGoogleSheet(data), addToAirtable(data)]);
      results.forEach((r) => {
        if (r.status === "rejected") console.error("Member signup sink error:", r.reason);
      });
    } else {
      console.log("Member signup (no backend configured):", data.email, "—", data.name);
    }

    const response = NextResponse.json(
      { success: true, message: "You're in. Welcome to BSTC." },
      { status: 200 }
    );
    response.cookies.set(MEMBER_COOKIE, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    console.error("Member signup error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
