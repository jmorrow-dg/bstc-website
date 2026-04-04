"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default function SponsorApplyPage() {
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await fetch("/api/sponsor-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          website: formData.get("website"),
          tier: formData.get("tier"),
          goal: formData.get("goal"),
          message: formData.get("message"),
        }),
      });
      setSubmitted(true);
    } catch {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="py-24 md:py-32">
        <div className="max-w-site mx-auto px-6 text-center">
          <div className="text-brand-red text-5xl mb-6">&#10003;</div>
          <h1 className="text-3xl font-display font-bold mb-4">
            Thanks for Your Interest
          </h1>
          <p className="text-brand-grey max-w-md mx-auto mb-8">
            We&apos;ve received your enquiry and will be in touch within 48
            hours to discuss partnership opportunities.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
          >
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="max-w-site mx-auto px-6 pt-8">
        <Link
          href="/sponsors"
          className="inline-flex items-center gap-2 text-sm text-brand-grey hover:text-brand-white transition-colors"
        >
          <ArrowLeft size={14} />
          Sponsorship Overview
        </Link>
      </div>

      <section className="py-12 md:py-20">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Become a Sponsor
            </h1>
            <p className="text-brand-grey mb-10">
              Tell us about your company and goals. We&apos;ll get back to you
              within 48 hours with a tailored partnership proposal.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
                    name="name" placeholder="Josh Morrow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
                    name="email" placeholder="you@company.com"
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
                    required
                    className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
                    name="company" placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
                    name="website" placeholder="https://company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-grey mb-2">
                  Which tier interests you?
                </label>
                <select name="tier" className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white focus:border-brand-red focus:outline-none transition-colors text-sm">
                  <option value="">Select a tier</option>
                  <option value="supporting">
                    Supporting Sponsor (Per Event)
                  </option>
                  <option value="community">
                    Community Partner (Quarterly)
                  </option>
                  <option value="strategic">Strategic Partner (Annual)</option>
                  <option value="hiwa">
                    &quot;How I Build with AI&quot; Series Sponsor
                  </option>
                  <option value="unsure">Not sure yet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-grey mb-2">
                  What&apos;s your primary goal? *
                </label>
                <select
                  name="goal"
                  required
                  className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white focus:border-brand-red focus:outline-none transition-colors text-sm"
                >
                  <option value="">Select your goal</option>
                  <option value="brand-awareness">Brand Awareness</option>
                  <option value="lead-generation">Lead Generation</option>
                  <option value="recruitment">
                    Recruitment / Talent Access
                  </option>
                  <option value="community-building">Community Building</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-grey mb-2">
                  Anything else you&apos;d like us to know?
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm resize-none"
                  name="message" placeholder="Tell us about your company, your audience, or any specific ideas..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Enquiry"}
                {!loading && <Send size={16} />}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
