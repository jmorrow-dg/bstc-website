import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { captureLead, notifyLead } from "@/lib/leads";
import { attributionSchema, optionalUrl } from "@/lib/validation";

const startupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().min(1, "Company is required"),
  website: optionalUrl,
  linkedinUrl: optionalUrl,
  stage: z.string().min(1, "Stage is required"),
  raising: z.string().min(1, "Raising status is required"),
  pitch: z.string().optional(),
  attribution: attributionSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = startupSchema.parse(body);

    await captureLead({
      email: data.email,
      name: data.name,
      linkedinUrl: data.linkedinUrl || undefined,
      role: "founder",
      company: data.company,
      source: "startup",
      attribution: data.attribution,
      fields: {
        Stage: data.stage,
        Raising: data.raising,
        ...(data.website && { Website: data.website }),
      },
      sendWelcomeEmail: true,
    });

    await notifyLead("🚀 New startup signup", {
      Name: data.name,
      Email: data.email,
      Company: data.company,
      Website: data.website || undefined,
      Stage: data.stage,
      Raising: data.raising,
      Pitch: data.pitch,
      LinkedIn: data.linkedinUrl || undefined,
    });

    return NextResponse.json(
      { success: true, message: "You're in" },
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
