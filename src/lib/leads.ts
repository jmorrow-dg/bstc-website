const BEEHIIV_API_URL = "https://api.beehiiv.com/v2";

export type LeadSource =
  | "newsletter"
  | "join"
  | "event-rsvp"
  | "events-notify"
  | "investor"
  | "startup"
  | "contact"
  | "sponsor"
  | "whatsapp-cta"
  | "slide-in";

export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  landingPage?: string;
}

export interface Lead {
  email: string;
  name?: string;
  linkedinUrl?: string;
  role?: string;
  company?: string;
  source: LeadSource;
  attribution?: Attribution;
  /** Extra Beehiiv custom fields, e.g. { Event: "networking-june-2026" }.
   * Field names must exist in Beehiiv (Settings → Subscriber data). */
  fields?: Record<string, string>;
  /** Triggers the Beehiiv welcome automation (which delivers the WhatsApp invite). */
  sendWelcomeEmail?: boolean;
}

/**
 * Adds a lead to the Beehiiv publication (the community's system of record).
 * No-ops with a log when BEEHIIV_API_KEY / BEEHIIV_PUBLICATION_ID are unset,
 * so forms keep working in dev and never block on the integration.
 */
export async function captureLead(lead: Lead): Promise<boolean> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.log("[leads] Beehiiv not configured, lead logged only:", {
      ...lead,
      source: lead.source,
    });
    return false;
  }

  const customFields = Object.entries({
    Name: lead.name,
    LinkedIn: lead.linkedinUrl,
    Role: lead.role,
    Company: lead.company,
    Source: lead.source,
    ...lead.fields,
  })
    .filter(([, value]) => value)
    .map(([name, value]) => ({ name, value }));

  try {
    const res = await fetch(
      `${BEEHIIV_API_URL}/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email: lead.email,
          reactivate_existing: true,
          send_welcome_email: lead.sendWelcomeEmail ?? false,
          utm_source: lead.attribution?.utmSource || lead.source,
          utm_medium: lead.attribution?.utmMedium || "website",
          utm_campaign: lead.attribution?.utmCampaign,
          referring_site: lead.attribution?.referrer || lead.attribution?.landingPage,
          custom_fields: customFields,
        }),
      }
    );

    if (!res.ok) {
      console.error("[leads] Beehiiv error:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[leads] Beehiiv request failed:", error);
    return false;
  }
}

/**
 * Posts a lead/message to LEAD_NOTIFICATION_WEBHOOK_URL so the team hears
 * about it immediately. Payload is Slack-incoming-webhook compatible (uses
 * `text`), and also works with Zapier/Make which read the raw fields.
 */
export async function notifyLead(
  title: string,
  details: Record<string, string | undefined>
): Promise<void> {
  const webhookUrl = process.env.LEAD_NOTIFICATION_WEBHOOK_URL;

  const lines = Object.entries(details)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);
  const text = `*${title}*\n${lines.join("\n")}`;

  if (!webhookUrl) {
    console.log("[leads] Notification webhook not configured:", text);
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, title, ...details }),
    });
    if (!res.ok) {
      console.error("[leads] Webhook error:", res.status, await res.text());
    }
  } catch (error) {
    console.error("[leads] Webhook request failed:", error);
  }
}
