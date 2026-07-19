import { cookies } from "next/headers";
import { COMMUNITY_GROUPS } from "./community-groups";

export const MEMBER_COOKIE = "bstc_member";
export const ROOMS_COOKIE = "bstc_rooms";

/**
 * Soft email-gate check. Reads the membership cookie set by /api/members.
 * Server-only (uses next/headers). Not a security boundary — the gated
 * content here is member value, not secrets. Harden to real auth later.
 */
export function isMember(): boolean {
  return cookies().get(MEMBER_COOKIE)?.value === "1";
}

/**
 * WhatsApp rooms matched at signup (CSV of group ids). Empty for members who
 * signed up before rooms existed — callers should fall back to showing all
 * open rooms.
 */
export function memberRooms(): string[] {
  const raw = cookies().get(ROOMS_COOKIE)?.value || "";
  const known = new Set(COMMUNITY_GROUPS.map((g) => g.id));
  return raw.split(",").filter((id) => known.has(id));
}
