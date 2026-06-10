// Client-side first-touch attribution, persisted for the session so every
// lead form can report where the visitor originally came from.

export interface ClientAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  landingPage?: string;
}

const STORAGE_KEY = "bstc_attribution";

export function storeAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const attribution: ClientAttribution = {
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      referrer: document.referrer || undefined,
      landingPage: window.location.pathname,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // sessionStorage unavailable (private mode etc.) — attribution is best-effort
  }
}

export function getAttribution(): ClientAttribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ClientAttribution) : {};
  } catch {
    return {};
  }
}
