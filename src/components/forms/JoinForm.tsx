"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { ArrowRight, Calendar, CheckCircle, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";
import { getAttribution } from "@/lib/attribution";

const ROLES = [
  { value: "founder", label: "Startup Founder" },
  { value: "investor", label: "Investor / VC" },
  { value: "engineer", label: "Engineer / Developer" },
  { value: "operator", label: "Operator (Marketing, Sales, Product...)" },
  { value: "remote-worker", label: "Remote Worker / Digital Nomad" },
  { value: "other", label: "Other" },
];

export default function JoinForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          linkedinUrl: formData.get("linkedinUrl") || "",
          role: formData.get("role"),
          company: formData.get("company") || undefined,
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      track("join_submitted", { role: String(formData.get("role")) });
      setSubmitted(true);
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="p-8 md:p-10 rounded-lg border border-brand-red/20 bg-gradient-to-br from-brand-red/10 via-brand-charcoal to-brand-charcoal text-center">
        <CheckCircle className="w-10 h-10 text-brand-red mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
          Welcome to BSTC
        </h2>
        <p className="text-brand-grey max-w-md mx-auto mb-8">
          You&apos;re on the list. We&apos;ve emailed you your invite — and you
          can jump straight in below.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_opened", { from: "join-success" })}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red"
          >
            <MessageCircle size={18} />
            Open the WhatsApp Community
          </a>
          <a
            href={SITE.meetup}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors"
          >
            <Calendar size={18} />
            RSVP to an Event
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 md:p-10 rounded-lg border border-white/10 bg-white/[0.02] space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-grey mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-grey mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@email.com"
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-grey mb-2">
            What best describes you? *
          </label>
          <select
            name="role"
            required
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white focus:border-brand-red focus:outline-none transition-colors text-sm"
          >
            <option value="">Select your role</option>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-grey mb-2">
            Company / Project
          </label>
          <input
            type="text"
            name="company"
            placeholder="What you're building (optional)"
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-grey mb-2">
          LinkedIn
        </label>
        <input
          type="url"
          name="linkedinUrl"
          placeholder="https://linkedin.com/in/you (helps members find you)"
          className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-brand-red">
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red disabled:opacity-50"
      >
        {loading ? "Joining..." : "Join the Community — Free"}
        {!loading && <ArrowRight size={16} />}
      </button>
      <p className="text-xs text-brand-grey/70 text-center">
        Free forever. Your WhatsApp invite arrives instantly. No spam,
        unsubscribe anytime.
      </p>
    </form>
  );
}
