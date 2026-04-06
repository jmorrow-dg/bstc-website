"use client";

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
              Join 2,500+ builders in our WhatsApp community
            </p>
          </div>

          {/* Button */}
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all"
            aria-label="Join WhatsApp Community"
          >
            <MessageCircle size={24} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
