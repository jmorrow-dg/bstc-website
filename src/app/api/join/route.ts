import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { captureLead, notifyLead } from "@/lib/leads";
import { attributionSchema, optionalUrl } from "@/lib/validation";

const joinSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  linkedinUrl: optionalUrl,
  role: z.string().min(1, "Role is required"),
  company: z.string().optional(),
  attribution: attributionSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = joinSchema.parse(body);

    await captureLead({
      email: data.email,
      name: data.name,
      linkedinUrl: data.linkedinUrl || undefined,
      role: data.role,
      company: data.company,
      source: "join",
      attribution: data.attribution,
      sendWelcomeEmail: true,
    });

    await notifyLead("New community member", {
      Name: data.name,
      Email: data.email,
      Role: data.role,
      Company: data.company,
      LinkedIn: data.linkedinUrl || undefined,
    });

    return NextResponse.json(
      { success: true, message: "Welcome to BSTC" },
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
