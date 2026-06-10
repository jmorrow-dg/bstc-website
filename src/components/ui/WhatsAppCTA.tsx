"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import { SITE } from "@/lib/constants";
import { getAttribution } from "@/lib/attribution";

export default function WhatsAppCTA() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "whatsapp-cta",
          attribution: getAttribution(),
        }),
      });
      track("whatsapp_cta_captured");
      setStatus("success");
    } catch {
      setStatus("idle");
    }
  }

  if (dismissed || SITE.whatsapp === "#") return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 left-8 z-40 flex items-end gap-3"
        >
          {/* Capture panel */}
          {open ? (
            <div className="bg-brand-charcoal border border-white/10 rounded-lg p-4 shadow-xl w-[260px] relative">
              <button
                onClick={() => setDismissed(true)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-brand-charcoal border border-white/10 rounded-full flex items-center justify-center text-brand-grey hover:text-brand-white transition-colors"
                aria-label="Dismiss"
              >
                <X size={10} />
              </button>
              {status === "success" ? (
                <>
                  <p className="text-sm text-brand-white font-medium mb-2">
                    You&apos;re in. Invite sent to your inbox.
                  </p>
                  <a
                    href={SITE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track("whatsapp_opened", { from: "floating-cta" })
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-medium rounded transition-colors"
                  >
                    Open WhatsApp now
                    <ArrowRight size={14} />
                  </a>
                </>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-xs text-brand-grey leading-relaxed mb-3">
                    Join 2,500+ builders in our WhatsApp community. Drop your
                    email and we&apos;ll send the invite.
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full px-3 py-2 mb-2 rounded bg-white/[0.03] border border-white/10 text-brand-white placeholder:text-brand-grey/50 focus:border-brand-red focus:outline-none transition-colors text-sm"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full px-3 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
                  >
                    {status === "loading" ? "Sending..." : "Get the Invite"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="hidden sm:block bg-brand-charcoal border border-white/10 rounded-lg p-3 shadow-xl max-w-[200px] relative">
              <button
                onClick={() => setDismissed(true)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-brand-charcoal border border-white/10 rounded-full flex items-center justify-center text-brand-grey hover:text-brand-white transition-colors"
                aria-label="Dismiss"
              >
                <X size={10} />
              </button>
              <p className="text-xs text-brand-grey leading-relaxed">
                Join 2,500+ builders in our WhatsApp community
              </p>
            </div>
          )}

          {/* Button */}
          <button
            onClick={() => setOpen(true)}
            className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all"
            aria-label="Join WhatsApp Community"
          >
            <MessageCircle size={24} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
