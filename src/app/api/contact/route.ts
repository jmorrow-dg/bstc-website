import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Delivers the enquiry by email via Resend.
//
// Required env vars (set in Vercel):
//   RESEND_API_KEY   Resend API key, with bstc.community verified as a sender domain
//
// Unlike the sponsor-inquiry route, a missing key here returns an error rather
// than a silent success. A dropped contact enquiry cannot be recovered, so the
// sender needs to know it did not go through.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error(
        "[contact] RESEND_API_KEY not set — enquiry NOT delivered. Payload:",
        data,
      );
      return NextResponse.json(
        {
          success: false,
          message:
            "We could not send that right now. Please email hello@bstc.community directly.",
        },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "BSTC <noreply@bstc.community>",
      to: "hello@bstc.community",
      replyTo: data.email,
      subject: `[BSTC Contact] ${data.subject}: ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\n${data.message}`,
    });

    if (error) {
      console.error("[contact] Resend error — enquiry NOT delivered:", error, data);
      return NextResponse.json(
        {
          success: false,
          message:
            "We could not send that right now. Please email hello@bstc.community directly.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
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
