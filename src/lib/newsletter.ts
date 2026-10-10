type NewsletterConfig = {
  apiKey?: string;
  segmentId?: string;
};

export type NewsletterResult = {
  status: number;
  success: boolean;
  message: string;
};

const unavailable: NewsletterResult = {
  status: 502,
  success: false,
  message: "We couldn’t complete your signup. Please try again later.",
};

const optedOut: NewsletterResult = {
  status: 409,
  success: false,
  message:
    "This address is opted out of email updates. Please contact the BSTC team if you’d like to rejoin.",
};

type Contact = { id: string; unsubscribed: boolean };

function isContact(value: unknown): value is Contact {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    "unsubscribed" in value &&
    typeof value.unsubscribed === "boolean"
  );
}

/** Persist an explicitly requested signup without changing existing opt-outs. */
export async function subscribeNewsletter(
  email: string,
  config: NewsletterConfig,
  fetcher: typeof fetch = fetch
): Promise<NewsletterResult> {
  const apiKey = config.apiKey?.trim();
  const segmentId = config.segmentId?.trim();

  if (!apiKey || !segmentId) {
    return {
      status: 503,
      success: false,
      message:
        "Email signup is temporarily unavailable. Please use our community channels or try again later.",
    };
  }

  // Global contacts are keyed by email. Audiences were renamed to Segments:
  // https://resend.com/docs/dashboard/contacts/migrating-from-audiences-to-segments
  const contactPath = `/contacts/${encodeURIComponent(email)}`;
  const signal = AbortSignal.timeout(10_000);
  const request = (path: string, init: RequestInit = {}) =>
    fetcher(`https://api.resend.com${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal,
    });

  try {
    const existing = await request(contactPath);

    if (existing.ok) {
      const contact: unknown = await existing.json();
      if (!isContact(contact)) return unavailable;
      if (contact.unsubscribed) return optedOut;

      // Adding a segment does not overwrite global or topic preferences.
      const added = await request(
        `/contacts/${encodeURIComponent(contact.id)}/segments/${encodeURIComponent(segmentId)}`,
        { method: "POST" }
      );
      if (!added.ok) return unavailable;
      const membership: unknown = await added.json();
      if (
        typeof membership !== "object" ||
        membership === null ||
        !("id" in membership) ||
        membership.id !== segmentId
      ) {
        return unavailable;
      }
    } else if (existing.status === 404) {
      const created = await request("/contacts", {
        method: "POST",
        // Deliberately omit `unsubscribed`: never force an existing contact
        // back in, including when concurrent requests find the same address.
        body: JSON.stringify({ email, segments: [{ id: segmentId }] }),
      });
      if (!created.ok) return unavailable;
      const saved: unknown = await created.json();
      if (
        typeof saved !== "object" ||
        saved === null ||
        !("id" in saved) ||
        typeof saved.id !== "string" ||
        !saved.id
      ) {
        return unavailable;
      }

      // A concurrent request may have created this contact first. Confirm
      // its actual preference before claiming the address is subscribed.
      const confirmed = await request(contactPath);
      if (!confirmed.ok) return unavailable;
      const contact: unknown = await confirmed.json();
      if (!isContact(contact)) return unavailable;
      if (contact.unsubscribed) return optedOut;
    } else {
      // Authentication, throttling and provider errors are not “not found”.
      return unavailable;
    }

    return {
      status: 200,
      success: true,
      message: "You’re on the list for BSTC event and community updates.",
    };
  } catch {
    // Do not log addresses, API credentials or provider response bodies.
    return unavailable;
  }
}
