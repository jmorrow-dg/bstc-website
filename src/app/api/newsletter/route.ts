import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email"),
});

// Adds the subscriber to a Resend audience.
//
// Required env vars (set in Vercel):
//   RESEND_API_KEY       Resend API key
//   RESEND_AUDIENCE_ID   Target audience for BSTC Weekly
//
// A missing key returns an error rather than a silent success. Telling someone
// they are subscribed when the address was never stored is worse than failing.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = newsletterSchema.parse(body);

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!apiKey || !audienceId) {
      console.error(
        "[newsletter] RESEND_API_KEY or RESEND_AUDIENCE_ID not set — signup NOT stored:",
        data.email,
      );
      return NextResponse.json(
        {
          success: false,
          message: "Sign-up is temporarily unavailable. Please try again shortly.",
        },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.contacts.create({
      email: data.email,
      audienceId,
      unsubscribed: false,
    });

    if (error) {
      console.error("[newsletter] Resend error — signup NOT stored:", error, data.email);
      return NextResponse.json(
        {
          success: false,
          message: "Sign-up is temporarily unavailable. Please try again shortly.",
        },
        { status: 502 },
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
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
