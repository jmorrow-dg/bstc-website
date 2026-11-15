"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const companySite = new FormData(e.currentTarget).get("company_site") || "";
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company_site: companySite }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success !== true) {
        setError(data.message || "Please check the email and try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setError("We couldn't reach the server. Please try again.");
      setStatus("error");
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
        <>
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
            <input
              type="text"
              name="company_site"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px" }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="gl-btn gl-btn-red"
            >
              Subscribe
            </button>
          </div>
          {status === "error" && (
            <p className="gl-news-done" role="alert">
              {error}
            </p>
          )}
        </>
      )}
    </form>
  );
}
