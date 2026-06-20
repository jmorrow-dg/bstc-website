import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = newsletterSchema.parse(body);

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (apiKey && audienceId) {
      try {
        const resend = new Resend(apiKey);
        await resend.contacts.create({
          email: data.email,
          unsubscribed: false,
          audienceId,
        });
      } catch (err) {
        // Best-effort — never fail the signup if Resend hiccups.
        console.error("Newsletter Resend error:", err);
      }
    } else {
      console.log("Newsletter signup (no backend configured):", data.email);
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
