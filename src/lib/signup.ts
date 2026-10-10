/** Shared form contract. This module contains no credentials or server imports. */
export const CONSENT_VERSION = "bstc-signup-2026-10-10";

export const SIGNUP_HEADERS = [
  "submitted_at", "submission_id", "submission_type", "name", "email",
  "whatsapp_name", "phone", "role", "company", "website", "bali_connection",
  "location", "interests", "building", "looking_for", "can_offer",
  "referral_source", "referral_code", "preferred_channel", "email_updates_opt_in",
  "directory_opt_in", "guidelines_accepted", "consent_version", "source_path",
] as const;

export const BALI_CONNECTION_OPTIONS = [
  { value: "live", label: "I live in Bali" },
  { value: "visiting", label: "I’m visiting Bali" },
  { value: "planning", label: "I’m planning a visit" },
  { value: "remote", label: "I’m connecting remotely" },
] as const;

export const INTEREST_OPTIONS = [
  "AI & building", "Founders & growth", "Jobs & collaboration", "Events", "Investing",
] as const;

export const PREFERRED_CHANNEL_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp discussion" },
  { value: "telegram", label: "Telegram" },
  { value: "updates", label: "Announcements" },
  { value: "events", label: "Events" },
] as const;

export type SubmissionType = "community" | "newsletter";
export type BaliConnection = (typeof BALI_CONNECTION_OPTIONS)[number]["value"];
export type PreferredChannel = (typeof PREFERRED_CHANNEL_OPTIONS)[number]["value"];
export type SignupInterest = (typeof INTEREST_OPTIONS)[number];

export type SignupInput = {
  submissionId: string;
  name: string;
  email: string;
  baliConnection: BaliConnection | "";
  guidelinesAccepted: boolean;
  whatsappName?: string;
  phone?: string;
  role?: string;
  company?: string;
  website?: string;
  location?: string;
  interests?: SignupInterest[];
  building?: string;
  lookingFor?: string;
  canOffer?: string;
  referralSource?: string;
  referralCode?: string;
  preferredChannel?: PreferredChannel | "";
  emailUpdatesOptIn?: boolean;
  directoryOptIn?: boolean;
  websiteTrap?: string;
};

export type SignupChannel = {
  id: "whatsapp" | "telegram" | "updates";
  name: string;
  url: string;
  action: string;
};

export type SignupParseResult =
  | { success: true; data: SignupInput }
  | { success: false; message: string; fieldErrors: Record<string, string> };

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Ignore unknown fields; all consent, source and timestamp metadata is set server-side. */
export function parseSignup(
  value: unknown,
  submissionType: SubmissionType = "community",
  fallbackSubmissionId?: string
): SignupParseResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { success: false, message: "Please submit a valid signup form.", fieldErrors: {} };
  }
  const body = value as Record<string, unknown>;
  const fieldErrors: Record<string, string> = {};
  const text = (key: string, max: number, required = false): string => {
    const raw = body[key];
    if (raw === undefined || raw === null) {
      if (required) fieldErrors[key] = "This field is required.";
      return "";
    }
    if (typeof raw !== "string") {
      fieldErrors[key] = "Enter text for this field.";
      return "";
    }
    const result = raw.trim();
    if (required && !result) fieldErrors[key] = "This field is required.";
    if (result.length > max) fieldErrors[key] = `Use ${max} characters or fewer.`;
    return result;
  };
  const bool = (key: string): boolean => {
    if (body[key] !== undefined && typeof body[key] !== "boolean") {
      fieldErrors[key] = "Choose whether to opt in.";
    }
    return body[key] === true;
  };

  const websiteTrap = text("websiteTrap", 200);
  if (websiteTrap) fieldErrors.websiteTrap = "Please submit a valid signup form.";
  const email = text("email", 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  const submissionId = text("submissionId", 36) || fallbackSubmissionId || "";
  if (!uuidPattern.test(submissionId)) {
    fieldErrors.submissionId = "Please reload the form and try again.";
  }

  const data: SignupInput = {
    submissionId,
    name: "",
    email,
    baliConnection: "",
    guidelinesAccepted: false,
    emailUpdatesOptIn: false,
    directoryOptIn: false,
  };

  if (submissionType === "newsletter") {
    if (body.consent !== true) fieldErrors.consent = "Agree to receive BSTC email updates.";
    data.emailUpdatesOptIn = body.consent === true;
  } else {
    data.name = text("name", 120, true);
    data.whatsappName = text("whatsappName", 120);
    data.phone = text("phone", 40);
    data.role = text("role", 120);
    data.company = text("company", 160);
    data.website = text("website", 500);
    data.location = text("location", 160);
    data.building = text("building", 1500);
    data.lookingFor = text("lookingFor", 1500);
    data.canOffer = text("canOffer", 1500);
    data.referralSource = text("referralSource", 300);
    data.referralCode = text("referralCode", 100);
    data.emailUpdatesOptIn = bool("emailUpdatesOptIn");
    data.directoryOptIn = bool("directoryOptIn");
    data.guidelinesAccepted = body.guidelinesAccepted === true;
    if (!data.guidelinesAccepted) fieldErrors.guidelinesAccepted = "Please accept the community guidelines.";

    const baliConnection = text("baliConnection", 30, true);
    if (!BALI_CONNECTION_OPTIONS.some((option) => option.value === baliConnection)) {
      fieldErrors.baliConnection = "Choose your connection to Bali.";
    } else data.baliConnection = baliConnection as BaliConnection;

    const preferredChannel = text("preferredChannel", 30);
    if (preferredChannel && !PREFERRED_CHANNEL_OPTIONS.some((option) => option.value === preferredChannel)) {
      fieldErrors.preferredChannel = "Choose one of the listed channels.";
    } else data.preferredChannel = preferredChannel as PreferredChannel | "";

    if (body.interests === undefined) data.interests = [];
    else if (
      !Array.isArray(body.interests) || body.interests.length > INTEREST_OPTIONS.length ||
      !body.interests.every((interest) => INTEREST_OPTIONS.includes(interest))
    ) {
      fieldErrors.interests = "Choose interests from the list.";
    } else data.interests = [...new Set(body.interests)] as SignupInterest[];

    if (data.website) {
      try {
        const website = new URL(data.website);
        if (!["http:", "https:"].includes(website.protocol) || website.username || website.password) throw new Error();
      } catch {
        fieldErrors.website = "Enter a full website address starting with https:// or http://.";
      }
    }
  }

  return Object.keys(fieldErrors).length
    ? { success: false, message: "Please check the highlighted fields.", fieldErrors }
    : { success: true, data };
}

/** Append-only registration ledger; a repeated submission ID can be reconciled by admins. */
export function signupRow(data: SignupInput, submissionType: SubmissionType, submittedAt: string): (string | boolean)[] {
  return [
    submittedAt, data.submissionId, submissionType, data.name, data.email,
    data.whatsappName || "", data.phone || "", data.role || "", data.company || "",
    data.website || "", data.baliConnection, data.location || "", (data.interests || []).join("; "),
    data.building || "", data.lookingFor || "", data.canOffer || "", data.referralSource || "",
    data.referralCode || "", data.preferredChannel || "", data.emailUpdatesOptIn === true,
    data.directoryOptIn === true, data.guidelinesAccepted, CONSENT_VERSION,
    submissionType === "community" ? "/join" : "/newsletter",
  ];
}
