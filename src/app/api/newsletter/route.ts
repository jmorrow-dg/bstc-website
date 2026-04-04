import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = newsletterSchema.parse(body);

    // TODO: Add to Resend audience or Beehiiv
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.contacts.create({
    //   email: data.email,
    //   audienceId: process.env.RESEND_AUDIENCE_ID,
    // });

    console.log("Newsletter signup:", data.email);

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
