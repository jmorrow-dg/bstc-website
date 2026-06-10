"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { ArrowRight, CheckCircle } from "lucide-react";
import { getAttribution } from "@/lib/attribution";

export default function StartupForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          website: formData.get("website") || "",
          linkedinUrl: formData.get("linkedinUrl") || "",
          stage: formData.get("stage"),
          raising: formData.get("raising"),
          pitch: formData.get("pitch") || undefined,
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      track("startup_submitted");
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
        <h2 className="text-2xl font-display font-bold mb-3">
          You&apos;re in the Startup Pipeline
        </h2>
        <p className="text-brand-grey max-w-md mx-auto">
          When there&apos;s a fit with investors in the community, we&apos;ll
          make the intro. Check your inbox for your community invite — and come
          meet investors in person at the next event.
        </p>
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
            placeholder="you@startup.com"
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-grey mb-2">
            Company *
          </label>
          <input
            type="text"
            name="company"
            required
            placeholder="Startup name"
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-grey mb-2">
            Website
          </label>
          <input
            type="url"
            name="website"
            placeholder="https://yourstartup.com"
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-grey mb-2">
            Stage *
          </label>
          <select
            name="stage"
            required
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white focus:border-brand-red focus:outline-none transition-colors text-sm"
          >
            <option value="">Select stage</option>
            <option value="idea">Idea / Pre-launch</option>
            <option value="pre-seed">Pre-seed</option>
            <option value="seed">Seed</option>
            <option value="series-a">Series A</option>
            <option value="series-b-plus">Series B+</option>
            <option value="bootstrapped-profitable">
              Bootstrapped & Profitable
            </option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-grey mb-2">
            Are you raising? *
          </label>
          <select
            name="raising"
            required
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white focus:border-brand-red focus:outline-none transition-colors text-sm"
          >
            <option value="">Select status</option>
            <option value="raising-now">Raising now</option>
            <option value="raising-soon">Raising in 3–6 months</option>
            <option value="not-raising">Not raising — here to connect</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-grey mb-2">
          LinkedIn
        </label>
        <input
          type="url"
          name="linkedinUrl"
          placeholder="https://linkedin.com/in/you"
          className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-grey mb-2">
          One-liner
        </label>
        <textarea
          name="pitch"
          rows={3}
          placeholder="What you're building, traction so far, and what you're looking for"
          className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm resize-none"
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
        {loading ? "Submitting..." : "Join the Startup Pipeline"}
        {!loading && <ArrowRight size={16} />}
      </button>
    </form>
  );
}
