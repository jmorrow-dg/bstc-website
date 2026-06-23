import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const sponsorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().min(1, "Company is required"),
  website: z.string().url().optional().or(z.literal("")),
  tier: z.string().optional(),
  goal: z.string().min(1, "Goal is required"),
  message: z.string().optional(),
});

type SponsorPayload = z.infer<typeof sponsorSchema>;

// Posts the inquiry to Airtable.
//
// Required env vars (set in Vercel):
//   AIRTABLE_API_KEY        Personal Access Token with data.records:write on the base
//   AIRTABLE_BASE_ID        e.g. appXXXXXXXXXXXXXX
//   AIRTABLE_TABLE_NAME     e.g. "Sponsor Inquiries" (URL-encoded automatically)
//
// Expected Airtable field schema (case-sensitive, must match column names):
//   Name (single line text)
//   Email (email)
//   Company (single line text)
//   Website (URL)
//   Tier (single line text or single select)
//   Goal (single line text or single select)
//   Message (long text)
//   Submitted At (date or created time)
//
// If env vars are missing, the route returns success and logs the payload —
// useful for local dev and the period before the Airtable base is created.
async function pushToAirtable(data: SponsorPayload) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  if (!apiKey || !baseId || !tableName) {
    console.warn(
      "[sponsor-inquiry] Airtable env vars not set — skipping write. Payload:",
      data,
    );
    return { skipped: true };
  }

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Name: data.name,
            Email: data.email,
            Company: data.company,
            Website: data.website || "",
            Tier: data.tier || "",
            Goal: data.goal,
            Message: data.message || "",
            "Submitted At": new Date().toISOString(),
          },
        },
      ],
      typecast: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable error ${res.status}: ${body}`);
  }

  return { skipped: false };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = sponsorSchema.parse(body);

    await pushToAirtable(data);

    return NextResponse.json(
      { success: true, message: "Inquiry received" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 },
      );
    }
    console.error("[sponsor-inquiry] failed:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
