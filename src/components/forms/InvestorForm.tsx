"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { ArrowRight, CheckCircle } from "lucide-react";
import { getAttribution } from "@/lib/attribution";

export default function InvestorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/investors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          linkedinUrl: formData.get("linkedinUrl") || "",
          firm: formData.get("firm") || undefined,
          investorType: formData.get("investorType"),
          checkSize: formData.get("checkSize") || undefined,
          focus: formData.get("focus") || undefined,
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      track("investor_submitted");
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
          You&apos;re on the Investor List
        </h2>
        <p className="text-brand-grey max-w-md mx-auto">
          We&apos;ll be in touch with curated dealflow, founder intros, and
          invites to investor-only sessions. Check your inbox for your
          community invite.
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
            placeholder="you@fund.com"
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-grey mb-2">
            Investor type *
          </label>
          <select
            name="investorType"
            required
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white focus:border-brand-red focus:outline-none transition-colors text-sm"
          >
            <option value="">Select type</option>
            <option value="angel">Angel Investor</option>
            <option value="vc">VC Fund</option>
            <option value="family-office">Family Office</option>
            <option value="corporate">Corporate / Strategic</option>
            <option value="syndicate">Syndicate Lead</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-grey mb-2">
            Fund / Firm
          </label>
          <input
            type="text"
            name="firm"
            placeholder="Fund name (optional for angels)"
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-grey mb-2">
            Typical check size
          </label>
          <select
            name="checkSize"
            className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white focus:border-brand-red focus:outline-none transition-colors text-sm"
          >
            <option value="">Select range</option>
            <option value="under-25k">Under $25K</option>
            <option value="25k-100k">$25K – $100K</option>
            <option value="100k-500k">$100K – $500K</option>
            <option value="500k-2m">$500K – $2M</option>
            <option value="2m-plus">$2M+</option>
          </select>
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
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-grey mb-2">
          Investment focus
        </label>
        <input
          type="text"
          name="focus"
          placeholder="Stages, sectors, geographies (e.g. pre-seed/seed SaaS & AI in SEA)"
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
        {loading ? "Submitting..." : "Get Access to Dealflow"}
        {!loading && <ArrowRight size={16} />}
      </button>
    </form>
  );
}
