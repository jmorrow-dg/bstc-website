import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const sponsorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().min(1, "Company is required"),
  website: z.string().url().optional().or(z.literal("")),
  tier: z.string().optional(),
  goal: z.string().min(1, "Goal is required"),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = sponsorSchema.parse(body);

    // TODO: Send email via Resend + store in Supabase
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "BSTC <noreply@bstc.community>",
    //   to: "hello@bstc.community",
    //   subject: `[BSTC Sponsor Inquiry] ${data.company} — ${data.name}`,
    //   text: `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\nWebsite: ${data.website}\nTier: ${data.tier}\nGoal: ${data.goal}\n\n${data.message}`,
    // });

    console.log("Sponsor inquiry:", data);

    return NextResponse.json(
      { success: true, message: "Inquiry received" },
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
