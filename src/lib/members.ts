import { cookies } from "next/headers";

export const MEMBER_COOKIE = "bstc_member";

/**
 * Soft email-gate check. Reads the membership cookie set by /api/members.
 * Server-only (uses next/headers). Not a security boundary — the gated
 * content here is member value, not secrets. Harden to real auth later.
 */
export function isMember(): boolean {
  return cookies().get(MEMBER_COOKIE)?.value === "1";
}
