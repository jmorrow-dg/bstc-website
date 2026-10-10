import { handleSignupRequest, signupConfigFromEnvironment } from "@/lib/google-sheets";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleSignupRequest(request, "community", signupConfigFromEnvironment());
}
