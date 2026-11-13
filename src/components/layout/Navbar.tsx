"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { MEMBERS_APP_URL, signInLink } from "@/lib/members-app.mjs";

// Mobile menu keeps the two extra links the old mobile menu carried.
const MOBILE_LINKS = [
  ...NAV_LINKS,
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

// Sign in to the members' area. Null, so no link anywhere in the header,
// until MEMBERS_APP_URL is set in src/lib/members-app.mjs.
const SIGN_IN = signInLink(MEMBERS_APP_URL);

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() || "/";

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="gl-top">
      <div className={SIGN_IN ? "gl-wrap gl-top-row gl-top-row--signin" : "gl-wrap gl-top-row"}>
        <Link
          href="/"
          className="gl-brand"
          aria-label="Bali Startup and Tech, home"
        >
          <span className="gl-crest" aria-hidden="true" />
          <span className="gl-brand-name">Bali Startup &amp; Tech</span>
        </Link>

        <nav className="gl-nav" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {SIGN_IN && (
          <a href={SIGN_IN.href} className="gl-top-signin">
            {SIGN_IN.label}
          </a>
        )}

        <Link href="/join?src=nav" className="gl-btn gl-btn-red gl-top-join">
          Join the community
        </Link>

        <button
          type="button"
          className="gl-menu-btn"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          Menu
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="gl-wrap gl-menu-panel"
          aria-label="Main (mobile)"
        >
          <ul>
            {MOBILE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/join?src=nav-mobile"
            className="gl-btn gl-btn-red"
            onClick={() => setMobileOpen(false)}
          >
            Join the community
          </Link>
          {SIGN_IN && (
            <a
              href={SIGN_IN.href}
              className="gl-btn gl-btn-line"
              onClick={() => setMobileOpen(false)}
            >
              {SIGN_IN.label}
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
