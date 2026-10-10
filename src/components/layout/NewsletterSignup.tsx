"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";

export default function NewsletterSignup() {
  const id = useId();
  const submissionId = useRef<string>();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !consent || status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      submissionId.current ??= crypto.randomUUID();
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent, submissionId: submissionId.current }),
      });
      const result = await response.json();
      if (!response.ok || result?.success !== true) {
        setStatus("error");
        setMessage(
          typeof result?.message === "string"
            ? result.message
            : "We couldn’t complete your signup. Please try again later."
        );
        return;
      }
      setStatus("success");
      setMessage("Your email preference has been saved for BSTC event and community updates.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("We couldn’t complete your signup. Please try again later.");
    }
  }

  return (
    <div>
      {status !== "success" && (
        <form onSubmit={handleSubmit} className="space-y-3" aria-busy={status === "loading"}>
          <label htmlFor={`${id}-email`} className="sr-only">
            Email address for BSTC updates
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            maxLength={254}
            disabled={status === "loading"}
            aria-describedby={`${id}-message`}
            className="w-full min-w-0 px-3 py-2 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
          />
          <label className="flex items-start gap-2 text-xs text-brand-grey leading-relaxed">
            <input
              name="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              disabled={status === "loading"}
              className="mt-0.5 accent-brand-red"
            />
            <span>I agree to receive BSTC event and community emails. I can unsubscribe anytime.</span>
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-3 py-2 bg-brand-red hover:bg-brand-red-dark text-brand-white rounded transition-colors disabled:opacity-50 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            {status === "loading" ? "Signing up…" : "Get email updates"}
          </button>
          <Link href="/privacy" className="inline-block text-xs text-brand-grey underline hover:text-brand-white">
            Privacy policy
          </Link>
        </form>
      )}
      <p
        id={`${id}-message`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="mt-2 text-sm text-brand-white"
      >
        {message}
      </p>
      {status === "error" && (
        <Link href="/join" className="text-xs text-brand-grey underline hover:text-brand-white">
          Other ways to connect
        </Link>
      )}
    </div>
  );
}

