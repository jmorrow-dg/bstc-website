import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeNewsletter } from "@/lib/newsletter";

const newsletterSchema = z.object({
  email: z.string().trim().max(254).email("Enter a valid email address").toLowerCase(),
  consent: z.literal(true),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Please submit a valid signup form." },
      { status: 400 }
    );
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Enter a valid email address and agree to receive BSTC updates.",
      },
      { status: 400 }
    );
  }

  const result = await subscribeNewsletter(parsed.data.email, {
    apiKey: process.env.RESEND_API_KEY,
    segmentId:
      process.env.RESEND_SEGMENT_ID?.trim() || process.env.RESEND_AUDIENCE_ID,
  });

  return NextResponse.json(
    { success: result.success, message: result.message },
    { status: result.status, headers: { "Cache-Control": "no-store" } }
  );
}

