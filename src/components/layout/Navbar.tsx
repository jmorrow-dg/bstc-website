"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-charcoal/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-site mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-brand-red font-bold text-xl tracking-tight">
            BSTC
          </span>
          <span className="hidden sm:inline text-brand-grey text-sm">
            Bali Startup & Tech
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-brand-grey hover:text-brand-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/join"
            className="text-sm font-medium px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-brand-white rounded transition-colors"
          >
            Join Community
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-brand-grey hover:text-brand-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-charcoal border-t border-white/5 px-6 py-4 space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-brand-grey hover:text-brand-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/join"
            className="block text-center font-medium px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-brand-white rounded transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Join Community
          </Link>
        </div>
      )}
    </nav>
  );
}
