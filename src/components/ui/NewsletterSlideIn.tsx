"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import NewsletterSignup from "@/components/layout/NewsletterSignup";

const STORAGE_KEY = "bstc_slidein_shown";
const SHOW_AGAIN_AFTER_DAYS = 7;

/** Scroll-triggered newsletter capture for long-form content.
 * Shows once per week, after the reader is 40% through the page. */
export default function NewsletterSlideIn() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const lastShown = localStorage.getItem(STORAGE_KEY);
      if (
        lastShown &&
        Date.now() - Number(lastShown) <
          SHOW_AGAIN_AFTER_DAYS * 24 * 60 * 60 * 1000
      ) {
        return;
      }
    } catch {
      return;
    }

    function onScroll() {
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.4) {
        setShow(true);
        try {
          localStorage.setItem(STORAGE_KEY, String(Date.now()));
        } catch {
          // localStorage unavailable — slide-in just shows this once
        }
        window.removeEventListener("scroll", onScroll);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-8 right-8 z-40 w-[320px] max-w-[calc(100vw-4rem)] bg-brand-charcoal border border-white/10 rounded-lg p-5 shadow-2xl"
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-3 right-3 text-brand-grey hover:text-brand-white transition-colors"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
          <p className="text-sm font-semibold text-brand-white mb-1">
            Get the BSTC briefing
          </p>
          <p className="text-xs text-brand-grey leading-relaxed mb-3">
            Bali tech scene intel, founder guides, and event invites. Weekly,
            free, no spam.
          </p>
          <NewsletterSignup source="slide-in" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
