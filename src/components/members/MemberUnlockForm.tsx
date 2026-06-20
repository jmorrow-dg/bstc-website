"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

const inputClass =
  "w-full px-3 py-2.5 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm";

export default function MemberUnlockForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    building: "",
    companyWebsite: "", // honeypot
  });

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, interests: [] }),
      });
      if (!res.ok) throw new Error("Request failed");
      // The membership cookie is set by the response; re-render the
      // server component so it re-reads the cookie and reveals the hub.
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className={inputClass}
          placeholder="Full name *"
          value={form.name}
          onChange={update("name")}
          required
          autoComplete="name"
        />
        <input
          className={inputClass}
          type="email"
          placeholder="you@email.com *"
          value={form.email}
          onChange={update("email")}
          required
          autoComplete="email"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className={inputClass}
          placeholder="Company (optional)"
          value={form.company}
          onChange={update("company")}
        />
        <input
          className={inputClass}
          placeholder="What are you building? (optional)"
          value={form.building}
          onChange={update("building")}
        />
      </div>

      {/* Honeypot — visually hidden, off the tab order. Bots fill it; humans don't. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.companyWebsite}
            onChange={update("companyWebsite")}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors disabled:opacity-50"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Unlocking…
          </>
        ) : (
          <>
            Unlock the member hub <ArrowRight size={16} />
          </>
        )}
      </button>

      {status === "error" && (
        <p className="text-sm text-brand-red">Something went wrong. Please try again.</p>
      )}
      <p className="text-xs text-brand-grey/70">
        Free to join. We&apos;ll send community resources and event invites. No spam.
      </p>
    </form>
  );
}
