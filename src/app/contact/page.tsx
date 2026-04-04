"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Connect to API route / Resend
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="py-24 md:py-32">
        <div className="max-w-site mx-auto px-6 text-center">
          <div className="text-brand-red text-5xl mb-6">&#10003;</div>
          <h1 className="text-3xl font-display font-bold mb-4">
            Message Sent
          </h1>
          <p className="text-brand-grey max-w-md mx-auto mb-8">
            We&apos;ll get back to you within 48 hours.
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
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="grid md:grid-cols-[1fr_360px] gap-16">
            {/* Form */}
            <div>
              <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
                Contact
              </p>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Get in Touch
              </h1>
              <p className="text-brand-grey mb-10">
                Questions about events, sponsorship, leadership, or anything
                else? Drop us a message.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-grey mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
                      placeholder="Your name"
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
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">
                    Subject *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white focus:border-brand-red focus:outline-none transition-colors text-sm"
                  >
                    <option value="">Select a topic</option>
                    <option value="events">Events & Attendance</option>
                    <option value="sponsorship">Sponsorship</option>
                    <option value="leadership">Becoming a Leader</option>
                    <option value="speaking">
                      Speaking / &quot;How I Build with AI&quot;
                    </option>
                    <option value="partnership">Partnerships</option>
                    <option value="media">Media & Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm resize-none"
                    placeholder="What's on your mind?"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red"
                >
                  Send Message
                  <Send size={16} />
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
                <Mail className="w-5 h-5 text-brand-red mb-3" />
                <h3 className="font-semibold text-brand-white mb-1">Email</h3>
                <p className="text-sm text-brand-grey">hello@bstc.community</p>
              </div>
              <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
                <MapPin className="w-5 h-5 text-brand-red mb-3" />
                <h3 className="font-semibold text-brand-white mb-1">
                  Location
                </h3>
                <p className="text-sm text-brand-grey">
                  Canggu, Bali, Indonesia
                </p>
                <p className="text-xs text-brand-grey mt-1">
                  Events across Canggu, Ubud, Sanur & Uluwatu
                </p>
              </div>
              <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
                <h3 className="font-semibold text-brand-white mb-2">
                  Response Time
                </h3>
                <p className="text-sm text-brand-grey">
                  We typically respond within 48 hours. For urgent event-related
                  matters, reach out via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
