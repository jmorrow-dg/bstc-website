import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { captureLead } from "@/lib/leads";
import { attributionSchema } from "@/lib/validation";

const rsvpSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().optional(),
  eventSlug: z.string().min(1, "Event is required"),
  eventTitle: z.string().optional(),
  attribution: attributionSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = rsvpSchema.parse(body);

    await captureLead({
      email: data.email,
      name: data.name,
      source: "event-rsvp",
      attribution: {
        ...data.attribution,
        utmCampaign: data.eventSlug,
      },
      fields: { Event: data.eventTitle || data.eventSlug },
      sendWelcomeEmail: true,
    });

    return NextResponse.json(
      { success: true, message: "You're on the list" },
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
