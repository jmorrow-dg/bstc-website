import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    contactSchema.parse(body); // assign to `data` when delivery is wired up

    // No delivery is wired up yet, so say so instead of reporting a fake
    // success. TODO(josh): once CONTACT_EMAIL is a working inbox, send via
    // Resend (already a dependency) and return 200 only after it succeeds:
    //   const resend = new Resend(process.env.RESEND_API_KEY);
    //   await resend.emails.send({
    //     from: "BSTC <noreply@<verified-domain>>",
    //     to: CONTACT_EMAIL,
    //     replyTo: data.email,
    //     subject: `[BSTC Contact] ${data.subject}: ${data.name}`,
    //     text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\n${data.message}`,
    //   });
    return NextResponse.json(
      { success: false, message: "Contact form delivery is not configured" },
      { status: 503 }
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
