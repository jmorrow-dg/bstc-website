"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
import { getAttribution } from "@/lib/attribution";

export default function EventRsvpCapture({
  eventSlug,
  eventTitle,
  rsvpUrl,
}: {
  eventSlug: string;
  eventTitle: string;
  rsvpUrl: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          name: formData.get("name") || undefined,
          eventSlug,
          eventTitle,
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      track("event_rsvp_captured", { event: eventSlug });
      setSubmitted(true);
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="p-6 rounded-lg border border-brand-red/20 bg-brand-red/5">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={18} className="text-brand-red" />
          <p className="font-semibold text-brand-white">
            You&apos;re on the list — we&apos;ll send you a reminder.
          </p>
        </div>
        <p className="text-sm text-brand-grey mb-4">
          One last step: lock in your spot on MeetUp so we can plan capacity.
        </p>
        <a
          href={rsvpUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("meetup_rsvp_opened", { event: eventSlug })}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red"
        >
          Confirm RSVP on MeetUp
          <ExternalLink size={16} />
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-lg border border-white/10 bg-white/[0.02]"
    >
      <p className="font-semibold text-brand-white mb-1">Save your spot</p>
      <p className="text-sm text-brand-grey mb-4">
        Drop your email and we&apos;ll send you the RSVP link plus a reminder
        before the event.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          className="flex-1 px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          className="flex-1 px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Saving..." : "RSVP"}
          {!loading && <ArrowRight size={14} />}
        </button>
      </div>
      {error && (
        <p className="text-sm text-brand-red mt-3">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
