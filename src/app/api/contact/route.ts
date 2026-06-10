import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { captureLead, notifyLead } from "@/lib/leads";
import { attributionSchema } from "@/lib/validation";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attribution: attributionSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    await captureLead({
      email: data.email,
      name: data.name,
      source: "contact",
      attribution: data.attribution,
      fields: { "Contact Topic": data.subject },
    });

    await notifyLead(`New contact message: ${data.subject}`, {
      Name: data.name,
      Email: data.email,
      Subject: data.subject,
      Message: data.message,
    });

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
