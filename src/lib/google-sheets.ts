// Server runtime only: never import this module into client components.
import { createHash, createSign, randomUUID } from "node:crypto";
import { parseSignup, signupRow } from "./signup.ts";
import type { SignupChannel, SignupInput, SubmissionType } from "./signup.ts";

export type GoogleSheetsConfig = {
  spreadsheetId?: string;
  serviceAccountEmail?: string;
  privateKey?: string;
  tabName?: string;
};

export type SignupRequestConfig = GoogleSheetsConfig & {
  siteUrl?: string;
  whatsappUrl?: string;
  telegramUrl?: string;
  updatesUrl?: string;
};

export type SaveSignupResult = { status: number; success: boolean; message: string };

const tokenCache = new Map<string, { accessToken: string; expiresAt: number }>();
const scope = "https://www.googleapis.com/auth/spreadsheets";
const tokenUrl = "https://oauth2.googleapis.com/token";
const unavailable: SaveSignupResult = {
  status: 502,
  success: false,
  message: "We couldn’t confirm your signup was saved. Please try again later.",
};
const unconfigured: SaveSignupResult = {
  status: 503,
  success: false,
  message: "Signup is temporarily unavailable. Please try again later.",
};

/** Private credentials belong in hosting settings, never NEXT_PUBLIC variables. */
export function signupConfigFromEnvironment(
  environment: Record<string, string | undefined> = process.env
): SignupRequestConfig {
  return {
    spreadsheetId: environment.GOOGLE_SHEETS_SPREADSHEET_ID,
    serviceAccountEmail: environment.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: environment.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    tabName: environment.GOOGLE_SHEETS_TAB_NAME,
    siteUrl: environment.SITE_URL || environment.NEXT_PUBLIC_SITE_URL,
    whatsappUrl: environment.BSTC_WHATSAPP_INVITE_URL,
    telegramUrl: environment.BSTC_TELEGRAM_URL,
    updatesUrl: environment.BSTC_UPDATES_URL,
  };
}

function signedAssertion(email: string, privateKey: string, now: number): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const issuedAt = Math.floor(now / 1000);
  const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({
    iss: email,
    scope,
    aud: tokenUrl,
    iat: issuedAt,
    exp: issuedAt + 3600,
  })}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${signer.sign(privateKey, "base64url")}`;
}

/** Write one row with RAW semantics so user-entered text cannot become a Sheets formula. */
export async function saveSignup(
  data: SignupInput,
  submissionType: SubmissionType,
  config: GoogleSheetsConfig,
  fetcher: typeof fetch = fetch,
  now: number = Date.now()
): Promise<SaveSignupResult> {
  const spreadsheetId = config.spreadsheetId?.trim();
  const email = config.serviceAccountEmail?.trim();
  const privateKey = config.privateKey?.replace(/\\n/g, "\n").trim();
  const tabName = config.tabName?.trim() || "Signups";
  if (!spreadsheetId || !/^[a-zA-Z0-9_-]+$/.test(spreadsheetId) || !email || !privateKey) {
    return unconfigured;
  }

  // A credential-specific key prevents token reuse after key rotation. Limit the
  // process-local cache; cold starts simply request another short-lived token.
  const cacheKey = createHash("sha256").update(`${email}\0${privateKey}`).digest("hex");
  const cached = tokenCache.get(cacheKey);
  let accessToken = cached && cached.expiresAt > now ? cached.accessToken : undefined;
  let assertion: string | undefined;
  if (!accessToken) {
    try {
      assertion = signedAssertion(email, privateKey, now);
    } catch {
      return unconfigured;
    }
  }

  const signal = AbortSignal.timeout(15_000);
  try {
    if (!accessToken) {
      const response = await fetcher(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: assertion!,
        }).toString(),
        cache: "no-store",
        signal,
      });
      if (!response.ok) return unavailable;
      const token: unknown = await response.json();
      if (
        !token || typeof token !== "object" || !("access_token" in token) ||
        typeof token.access_token !== "string" || !token.access_token ||
        !("expires_in" in token) || typeof token.expires_in !== "number" ||
        !Number.isFinite(token.expires_in) || token.expires_in <= 0
      ) return unavailable;
      accessToken = token.access_token;
      if (tokenCache.size >= 5) tokenCache.clear();
      tokenCache.set(cacheKey, {
        accessToken,
        expiresAt: now + (Math.min(token.expires_in, 3600) - 60) * 1000,
      });
    }

    const range = `'${tabName.replace(/'/g, "''")}'!A:X`;
    const response = await fetcher(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS&includeValuesInResponse=false`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ range, majorDimension: "ROWS", values: [signupRow(data, submissionType, new Date(now).toISOString())] }),
        cache: "no-store",
        signal,
      }
    );
    if (!response.ok) {
      // Do not automatically retry an append: an ambiguous failure may already
      // have saved a row. The stable submission ID supports reconciliation.
      if (response.status === 401) tokenCache.delete(cacheKey);
      return unavailable;
    }
    const saved: unknown = await response.json();
    if (
      !saved || typeof saved !== "object" || !("spreadsheetId" in saved) || saved.spreadsheetId !== spreadsheetId ||
      !("updates" in saved) || !saved.updates || typeof saved.updates !== "object" ||
      !("updatedRows" in saved.updates) || saved.updates.updatedRows !== 1
    ) return unavailable;

    return {
      status: 200,
      success: true,
      message: submissionType === "newsletter"
        ? "Your email signup is saved. Thanks for joining the BSTC updates list."
        : "Your community registration is saved.",
    };
  } catch {
    // Never log signup data, credentials, assertions or provider response bodies.
    return unavailable;
  }
}

function httpsUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

function joiningChannels(config: SignupRequestConfig): SignupChannel[] {
  const definitions = [
    { id: "whatsapp", name: "WhatsApp General 2", url: config.whatsappUrl, action: "Request to join General 2" },
    { id: "telegram", name: "BSTC on Telegram", url: config.telegramUrl, action: "Join Telegram" },
    { id: "updates", name: "WhatsApp Events & Updates", url: config.updatesUrl, action: "Follow updates" },
  ] as const;
  return definitions.flatMap((channel) => {
    const url = httpsUrl(channel.url);
    return url ? [{ ...channel, url }] : [];
  });
}

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function originAllowed(request: Request, siteUrl?: string): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const submittedOrigin = new URL(origin).origin;
    if (submittedOrigin === new URL(request.url).origin) return true;
    return Boolean(siteUrl && submittedOrigin === new URL(siteUrl).origin);
  } catch {
    return false;
  }
}

/** Bound actual streamed bytes as well as Content-Length before parsing JSON. */
async function readBody(request: Request): Promise<unknown> {
  const limit = 16 * 1024;
  if (Number(request.headers.get("content-length")) > limit) throw new RangeError();
  if (!request.body) throw new SyntaxError();
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw new RangeError();
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(body);
}

/** Shared HTTP boundary, kept independent of Next for realistic mocked tests. */
export async function handleSignupRequest(
  request: Request,
  submissionType: SubmissionType,
  config: SignupRequestConfig,
  fetcher: typeof fetch = fetch
): Promise<Response> {
  if (!originAllowed(request, config.siteUrl)) {
    return json({ success: false, message: "Please submit the form from the BSTC website." }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ success: false, message: "Please submit a valid signup form." }, 415);
  }

  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    return json({ success: false, message: "Please submit a valid signup form." }, error instanceof RangeError ? 413 : 400);
  }
  const parsed = parseSignup(body, submissionType, submissionType === "newsletter" ? randomUUID() : undefined);
  if (!parsed.success) {
    return json({ success: false, message: parsed.message, fieldErrors: parsed.fieldErrors }, 400);
  }

  const saved = await saveSignup(parsed.data, submissionType, config, fetcher);
  if (!saved.success) return json({ success: false, message: saved.message }, saved.status);
  return json({
    success: true,
    message: saved.message,
    ...(submissionType === "community" ? { channels: joiningChannels(config) } : {}),
  }, saved.status);
}
