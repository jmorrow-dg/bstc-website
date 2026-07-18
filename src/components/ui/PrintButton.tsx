"use client";

import { Download } from "lucide-react";

export default function PrintButton({
  label = "Save as PDF",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ||
        "inline-flex items-center gap-2 px-5 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm glow-red"
      }
    >
      <Download size={14} />
      {label}
    </button>
  );
}
