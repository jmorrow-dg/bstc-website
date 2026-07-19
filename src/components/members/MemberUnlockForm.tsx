"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { LOCATIONS, INTERESTS } from "@/lib/community-groups";

const STAGES = [
  "Idea / Pre-Product",
  "MVP / Early users",
  "Bootstrapped lifestyle business",
  "Revenue (pre-$10k MRR)",
];

const OPEN_TO = [
  "Networking",
  "Finding a co-founder",
  "Learning",
  "Hiring",
  "Being hired",
  "Investing",
  "Advising",
  "Just meeting people",
];

const inputClass =
  "w-full px-3 py-2.5 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm";

type FormState = {
  fullName: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  location: string;
  companyStage: string;
  building: string;
  companyWebsite: string; // honeypot
};

export default function MemberUnlockForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [openTo, setOpenTo] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    whatsapp: "",
    linkedin: "",
    location: "",
    companyStage: "",
    building: "",
    companyWebsite: "",
  });

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>) => (o: string) =>
    set((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));
  const toggleOpenTo = toggle(setOpenTo);
  const toggleInterest = toggle(setInterests);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.whatsapp.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, openTo, interests }),
      });
      if (!res.ok) throw new Error("Request failed");
      // Cookie is set by the response; re-render the server component to reveal the hub.
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
          value={form.fullName}
          onChange={update("fullName")}
          required
          autoComplete="name"
        />
        <input
          className={inputClass}
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={update("email")}
          required
          autoComplete="email"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className={inputClass}
          placeholder="WhatsApp, incl. country code *"
          value={form.whatsapp}
          onChange={update("whatsapp")}
          required
          autoComplete="tel"
        />
        <input
          className={inputClass}
          placeholder="LinkedIn URL"
          value={form.linkedin}
          onChange={update("linkedin")}
        />
      </div>

      <select
        className={`${inputClass} appearance-none`}
        value={form.location}
        onChange={update("location")}
      >
        <option value="">Where are you based? (routes you to the right rooms)</option>
        {LOCATIONS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      <select
        className={`${inputClass} appearance-none`}
        value={form.companyStage}
        onChange={update("companyStage")}
      >
        <option value="">What stage are you at? (optional)</option>
        {STAGES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div>
        <p className="text-xs text-brand-grey mb-2">What are you open to right now? (pick any)</p>
        <div className="flex flex-wrap gap-2">
          {OPEN_TO.map((o) => {
            const on = openTo.includes(o);
            return (
              <button
                type="button"
                key={o}
                onClick={() => toggleOpenTo(o)}
                aria-pressed={on}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  on
                    ? "bg-brand-red border-brand-red text-brand-white"
                    : "border-white/10 text-brand-grey hover:border-brand-red/40"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs text-brand-grey mb-2">What are you into? (picks your rooms)</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((o) => {
            const on = interests.includes(o);
            return (
              <button
                type="button"
                key={o}
                onClick={() => toggleInterest(o)}
                aria-pressed={on}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  on
                    ? "bg-brand-red border-brand-red text-brand-white"
                    : "border-white/10 text-brand-grey hover:border-brand-red/40"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>

      <textarea
        className={inputClass}
        rows={2}
        placeholder="What are you building? (optional)"
        value={form.building}
        onChange={update("building")}
      />

      {/* Honeypot — visually hidden, off the tab order. */}
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
            <Loader2 size={16} className="animate-spin" /> Joining…
          </>
        ) : (
          <>
            Join the community <ArrowRight size={16} />
          </>
        )}
      </button>

      {status === "error" && (
        <p className="text-sm text-brand-red">Something went wrong. Please try again.</p>
      )}
      <p className="text-xs text-brand-grey/70">
        Free to join. We&apos;ll add you to the community and send resources. No spam, no selling to
        members.
      </p>
    </form>
  );
}
