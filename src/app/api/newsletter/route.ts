import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email"),
  // Bots fill the hidden field; humans never see it.
  company_site: z.string().optional(),
});

// Saves the signup to the BSTC & Remote Builders master Sheet as form=notes
// (the email-only tab, field_notes_signups), the same Apps Script receiver the
// /join form uses, so footer signups reach the member database too.
//
// Required env var (set in Vercel): SHEET_ENDPOINT, the same value bstc-join uses.
// Success is only reported once the Sheet answers {"ok":true}.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = newsletterSchema.parse(body);
    if (data.company_site) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const endpoint = process.env.SHEET_ENDPOINT;
    if (!endpoint) {
      console.error("[newsletter] SHEET_ENDPOINT not set, signup NOT saved");
      return NextResponse.json(
        { success: false, message: "Sign-up is unavailable right now. Please try again later." },
        { status: 503 }
      );
    }

    const form = new URLSearchParams({
      form: "notes",
      email: data.email.toLowerCase(),
      consent: "yes",
      page: "bstc:newsletter",
    });
    const res = await fetch(endpoint, {
      method: "POST",
      body: form,
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    const saved = await res.json().catch(() => ({}));
    if (saved?.ok !== true) {
      console.error("[newsletter] Sheet did not save the signup:", saved?.error || res.status);
      return NextResponse.json(
        { success: false, message: "We couldn't save that just now. Please try again in a minute." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Subscribed successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }
    console.error("[newsletter] signup NOT saved:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
