"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  BALI_CONNECTION_OPTIONS,
  INTEREST_OPTIONS,
  PREFERRED_CHANNEL_OPTIONS,
  parseSignup,
  type SignupChannel,
} from "@/lib/signup";

const inputClass = "w-full rounded border border-white/15 bg-brand-charcoal px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-grey/60 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red disabled:opacity-60";
const focusClass = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red";

const profileFields = [
  { name: "whatsappName", label: "Name used on WhatsApp", maxLength: 120, autoComplete: "nickname" },
  { name: "phone", label: "WhatsApp phone number", maxLength: 40, autoComplete: "tel", type: "tel", hint: "Include your country code. Only shared with community admins." },
  { name: "role", label: "Role or area of work", maxLength: 120, autoComplete: "organization-title" },
  { name: "company", label: "Company or project", maxLength: 160, autoComplete: "organization" },
  { name: "website", label: "Website or profile link", maxLength: 500, autoComplete: "url", type: "url", placeholder: "https://" },
  { name: "location", label: "Current location", maxLength: 160, autoComplete: "address-level2" },
] as const;

const introductionFields = [
  { name: "building", label: "What are you building or working on?" },
  { name: "lookingFor", label: "What would you like help with?" },
  { name: "canOffer", label: "What can you help others with?" },
] as const;

export default function CommunitySignup() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const submissionId = useRef<string>();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [channels, setChannels] = useState<SignupChannel[]>([]);

  function showErrors(messageText: string, errors: Record<string, string> = {}) {
    setStatus("error");
    setMessage(messageText);
    setFieldErrors(errors);
    const firstField = Object.keys(errors)[0];
    if (!firstField) return;
    const element = formRef.current?.elements.namedItem(firstField);
    if (!(element instanceof HTMLElement)) return;
    if (detailsRef.current?.contains(element)) detailsRef.current.open = true;
    requestAnimationFrame(() => element.focus());
  }

  function fieldProps(name: string) {
    return {
      id: `${id}-${name}`,
      name,
      "aria-invalid": fieldErrors[name] ? true as const : undefined,
      "aria-describedby": fieldErrors[name] ? `${id}-${name}-error` : undefined,
    };
  }

  function errorFor(name: string) {
    return fieldErrors[name] ? (
      <p id={`${id}-${name}-error`} className="mt-1.5 text-sm text-red-300">{fieldErrors[name]}</p>
    ) : null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    const formData = new FormData(event.currentTarget);
    submissionId.current ||= crypto.randomUUID();
    const value = (name: string) => String(formData.get(name) || "");
    const parsed = parseSignup({
      submissionId: submissionId.current,
      name: value("name"),
      email: value("email"),
      baliConnection: value("baliConnection"),
      guidelinesAccepted: formData.get("guidelinesAccepted") === "on",
      whatsappName: value("whatsappName"),
      phone: value("phone"),
      role: value("role"),
      company: value("company"),
      website: value("website"),
      location: value("location"),
      interests: formData.getAll("interests"),
      building: value("building"),
      lookingFor: value("lookingFor"),
      canOffer: value("canOffer"),
      referralSource: value("referralSource"),
      referralCode: value("referralCode"),
      preferredChannel: value("preferredChannel"),
      emailUpdatesOptIn: formData.get("emailUpdatesOptIn") === "on",
      directoryOptIn: formData.get("directoryOptIn") === "on",
      websiteTrap: value("websiteTrap"),
    });
    if (!parsed.success) {
      showErrors(parsed.message, parsed.fieldErrors);
      return;
    }

    setStatus("loading");
    setMessage("");
    setFieldErrors({});
    try {
      const response = await fetch("/api/community/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json();
      if (!response.ok || result?.success !== true) {
        const errors: Record<string, string> = {};
        if (result?.fieldErrors && typeof result.fieldErrors === "object") {
          for (const [field, error] of Object.entries(result.fieldErrors)) {
            if (typeof error === "string") errors[field] = error;
          }
        }
        showErrors(
          typeof result?.message === "string" ? result.message : "We couldn’t save your signup. Please try again later.",
          errors
        );
        return;
      }
      setChannels(Array.isArray(result.channels) ? result.channels : []);
      setMessage("Your signup and preferences have been saved.");
      setStatus("success");
      requestAnimationFrame(() => confirmationRef.current?.focus());
    } catch {
      showErrors("We couldn’t confirm your signup. Please try again later.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-brand-red/30 bg-brand-red/5 p-6 md:p-8">
        <h3 ref={confirmationRef} tabIndex={-1} className="text-2xl font-display font-bold outline-none">Welcome to BSTC</h3>
        <p role="status" className="mt-3 text-sm text-brand-grey leading-relaxed">{message}</p>
        {channels.length > 0 ? (
          <>
            <p className="mt-6 text-sm text-brand-white">Choose where to connect. Each link opens a platform where you can join.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {channels.map((channel) => (
                <a key={channel.id} href={channel.url} target="_blank" rel="noopener noreferrer" className={`rounded border border-white/15 bg-white/[0.03] p-4 hover:border-brand-red transition-colors ${focusClass}`}>
                  <span className="block font-medium text-brand-white">{channel.name}</span>
                  <span className="mt-1 block text-sm text-brand-grey">{channel.action} ↗</span>
                </a>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-5 text-sm text-brand-grey leading-relaxed">The new chat joining links are being prepared. Check back here for updates, and explore upcoming events in the meantime.</p>
        )}
        <p className="mt-5 text-xs text-brand-grey leading-relaxed">Joining links are subject to each group’s capacity and admin approval. Saving your signup does not add you to a group automatically.</p>
        <Link href="/events" className={`mt-6 inline-block text-sm text-brand-white underline underline-offset-4 hover:text-brand-red ${focusClass}`}>Explore BSTC events</Link>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={status === "loading"} className="rounded-lg border border-white/10 bg-white/[0.02] p-6 md:p-8">
      <p className="mb-6 text-sm text-brand-grey leading-relaxed">Start with your name, email and connection to Bali. You can choose email updates and directory participation separately.</p>
      {status === "error" && <p role="alert" className="mb-6 rounded border border-red-300/30 bg-red-300/5 p-3 text-sm text-red-200">{message}</p>}
      <fieldset disabled={status === "loading"} className="space-y-6 min-w-0">
        <legend className="sr-only">Your community signup</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-name`} className="mb-2 block text-sm font-medium">Your name <span className="text-brand-grey">(required)</span></label>
            <input {...fieldProps("name")} autoComplete="name" required maxLength={120} className={inputClass} />
            {errorFor("name")}
          </div>
          <div>
            <label htmlFor={`${id}-email`} className="mb-2 block text-sm font-medium">Email <span className="text-brand-grey">(required)</span></label>
            <input {...fieldProps("email")} type="email" autoComplete="email" required maxLength={254} className={inputClass} />
            {errorFor("email")}
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-baliConnection`} className="mb-2 block text-sm font-medium">Your connection to Bali <span className="text-brand-grey">(required)</span></label>
          <select {...fieldProps("baliConnection")} defaultValue="" required className={inputClass}>
            <option value="" disabled>Choose an option</option>
            {BALI_CONNECTION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          {errorFor("baliConnection")}
        </div>

        <details ref={detailsRef} className="rounded border border-white/10 p-4 md:p-5">
          <summary className={`cursor-pointer text-sm font-medium ${focusClass}`}>Tell us a little more <span className="font-normal text-brand-grey">(optional)</span></summary>
          <p className="mt-3 text-xs text-brand-grey leading-relaxed">Help the team understand what you need, make useful introductions and match any pending WhatsApp request.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {profileFields.map((field) => (
              <div key={field.name}>
                <label htmlFor={`${id}-${field.name}`} className="mb-2 block text-sm font-medium">{field.label}</label>
                <input {...fieldProps(field.name)} type={"type" in field ? field.type : "text"} autoComplete={field.autoComplete} maxLength={field.maxLength} placeholder={"placeholder" in field ? field.placeholder : undefined} className={inputClass} />
                {"hint" in field && <p className="mt-1.5 text-xs text-brand-grey">{field.hint}</p>}
                {errorFor(field.name)}
              </div>
            ))}
          </div>
          <fieldset className="mt-6">
            <legend className="mb-3 text-sm font-medium">What interests you?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {INTEREST_OPTIONS.map((interest) => (
                <label key={interest} className="flex items-start gap-2 text-sm text-brand-grey">
                  <input type="checkbox" name="interests" value={interest} className="mt-1 accent-brand-red" aria-describedby={fieldErrors.interests ? `${id}-interests-error` : undefined} />
                  <span>{interest}</span>
                </label>
              ))}
            </div>
            {errorFor("interests")}
          </fieldset>
          <div className="mt-6 space-y-5">
            {introductionFields.map((field) => (
              <div key={field.name}>
                <label htmlFor={`${id}-${field.name}`} className="mb-2 block text-sm font-medium">{field.label}</label>
                <textarea {...fieldProps(field.name)} rows={3} maxLength={1500} className={`${inputClass} resize-y`} />
                {errorFor(field.name)}
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-referralSource`} className="mb-2 block text-sm font-medium">How did you hear about BSTC?</label>
              <input {...fieldProps("referralSource")} maxLength={300} placeholder="A friend, an event, a community…" className={inputClass} />
              {errorFor("referralSource")}
            </div>
            <div>
              <label htmlFor={`${id}-referralCode`} className="mb-2 block text-sm font-medium">Referral code, if you have one</label>
              <input {...fieldProps("referralCode")} maxLength={100} className={inputClass} />
              {errorFor("referralCode")}
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor={`${id}-preferredChannel`} className="mb-2 block text-sm font-medium">Where would you prefer to connect?</label>
            <select {...fieldProps("preferredChannel")} defaultValue="" className={inputClass}>
              <option value="">No preference</option>
              {PREFERRED_CHANNEL_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {errorFor("preferredChannel")}
          </div>
        </details>

        <div className="space-y-5 border-t border-white/10 pt-6">
          <div>
            <label className="flex items-start gap-3 text-sm leading-relaxed text-brand-grey">
              <input {...fieldProps("emailUpdatesOptIn")} type="checkbox" className="mt-1 accent-brand-red" />
              <span><span className="text-brand-white">Send me BSTC event and community emails.</span> Optional. I can unsubscribe anytime.</span>
            </label>
            {errorFor("emailUpdatesOptIn")}
          </div>
          <div>
            <label className="flex items-start gap-3 text-sm leading-relaxed text-brand-grey">
              <input {...fieldProps("directoryOptIn")} type="checkbox" className="mt-1 accent-brand-red" />
              <span><span className="text-brand-white">Include my profile in the member directory when it is available.</span> Optional. My name, work, website, location, interests and introduction can be shared with other opted-in members. My email and phone fields stay private.</span>
            </label>
            {errorFor("directoryOptIn")}
          </div>
          <div>
            <label className="flex items-start gap-3 text-sm leading-relaxed text-brand-grey">
              <input {...fieldProps("guidelinesAccepted")} type="checkbox" required className="mt-1 accent-brand-red" />
              <span>I agree to the <a href="#community-guidelines" className={`text-brand-white underline underline-offset-4 ${focusClass}`}>community guidelines</a>. <span className="text-brand-grey">(required)</span></span>
            </label>
            {errorFor("guidelinesAccepted")}
          </div>
        </div>
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${id}-websiteTrap`}>Leave this field empty</label>
          <input id={`${id}-websiteTrap`} name="websiteTrap" tabIndex={-1} autoComplete="off" maxLength={200} />
        </div>
      </fieldset>
      <p className="mt-6 text-xs text-brand-grey leading-relaxed">Your registration is saved privately for community administration. Directory sharing only applies if you opt in. Read our <Link href="/privacy" className={`underline underline-offset-4 hover:text-brand-white ${focusClass}`}>privacy policy</Link>.</p>
      <button type="submit" disabled={status === "loading"} className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-brand-red px-6 py-3 text-sm font-medium text-brand-white transition-colors hover:bg-brand-red-dark disabled:opacity-60 ${focusClass}`}>
        {status === "loading" && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />}
        {status === "loading" ? "Saving your signup…" : "Save my signup & see joining links"}
      </button>
    </form>
  );
}
