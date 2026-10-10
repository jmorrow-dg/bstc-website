"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function WhatsAppCTA() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

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
          {/* Tooltip */}
          <div className="hidden sm:block bg-brand-charcoal border border-white/10 rounded-lg p-3 shadow-xl max-w-[200px] relative">
            <button
              onClick={() => setDismissed(true)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-brand-charcoal border border-white/10 rounded-full flex items-center justify-center text-brand-grey hover:text-brand-white transition-colors"
              aria-label="Dismiss"
            >
              <X size={10} />
            </button>
            <p className="text-xs text-brand-grey leading-relaxed">
              Find your way into the BSTC community
            </p>
          </div>

          {/* Button */}
          <Link
            href={SITE.joinPath}
            className="w-14 h-14 rounded-full bg-brand-red hover:bg-brand-red-dark text-white flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(200,30,30,0.4)] transition-all"
            aria-label="Join the community"
          >
            <MessageCircle size={24} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

