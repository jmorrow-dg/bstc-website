import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { captureLead, notifyLead } from "@/lib/leads";
import { attributionSchema, optionalUrl } from "@/lib/validation";

const investorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  linkedinUrl: optionalUrl,
  firm: z.string().optional(),
  investorType: z.string().min(1, "Investor type is required"),
  checkSize: z.string().optional(),
  focus: z.string().optional(),
  attribution: attributionSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = investorSchema.parse(body);

    await captureLead({
      email: data.email,
      name: data.name,
      linkedinUrl: data.linkedinUrl || undefined,
      role: "investor",
      company: data.firm,
      source: "investor",
      attribution: data.attribution,
      fields: {
        ...(data.investorType && { "Investor Type": data.investorType }),
        ...(data.checkSize && { "Check Size": data.checkSize }),
        ...(data.focus && { "Investment Focus": data.focus }),
      },
      sendWelcomeEmail: true,
    });

    await notifyLead("🔥 New investor signup", {
      Name: data.name,
      Email: data.email,
      Firm: data.firm,
      Type: data.investorType,
      "Check Size": data.checkSize,
      Focus: data.focus,
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
