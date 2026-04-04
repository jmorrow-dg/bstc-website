"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-brand-red">
        You&apos;re in. Watch your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        required
        className="flex-1 px-3 py-2 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-3 py-2 bg-brand-red hover:bg-brand-red-dark text-brand-white rounded transition-colors disabled:opacity-50"
        aria-label="Subscribe"
      >
        <Send size={14} />
      </button>
    </form>
  );
}
