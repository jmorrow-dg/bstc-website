"use client";

import { useState } from "react";

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

  return (
    <form onSubmit={handleSubmit} className="gl-news">
      <label htmlFor="news-email">Stay in the loop</label>
      {status === "success" ? (
        <p className="gl-news-done" role="status">
          You&apos;re in. Watch your inbox.
        </p>
      ) : (
        <div className="gl-news-row">
          <input
            id="news-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="gl-btn gl-btn-red"
          >
            Subscribe
          </button>
        </div>
      )}
    </form>
  );
}
