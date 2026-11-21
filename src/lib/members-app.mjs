// Sign in to the members' area, from the site header (desktop and the phone
// menu). Off until MEMBERS_APP_URL holds the members' area's full https
// address: while it's "", the header has no Sign in link and renders exactly
// as it did before (11 Nov 2026). Joining never needs it: /join stays open to
// everyone, with no account.
//
// Plain JavaScript, so scripts/sign-in-link.test.mjs can import it with no
// build step.

// Switching it on is its own PR: set this, and change the "it ships off" test
// in scripts/sign-in-link.test.mjs to expect the same address. Open the address
// first: only the https check below runs on it, so a wrong host still builds.
/** @type {string} */
export const MEMBERS_APP_URL = "";

export const SIGN_IN_LABEL = "Sign in";

/**
 * The header's Sign in link, or null while no address is set. A value that
 * isn't a full https address throws, so a typo fails the build instead of
 * quietly hiding the link or sending people somewhere else.
 * @param {string | null | undefined} value
 * @returns {{ label: string, href: string } | null}
 */
export function signInLink(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  let url = null;
  try {
    url = new URL(raw);
  } catch {
    // Not a full address: refused below.
  }
  if (url?.protocol !== "https:") {
    throw new Error(
      `MEMBERS_APP_URL in src/lib/members-app.mjs must be a full https:// address, or "" for no Sign in link. It is "${raw}".`,
    );
  }
  return { label: SIGN_IN_LABEL, href: url.href };
}
