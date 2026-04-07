import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";
import NewsletterSignup from "./NewsletterSignup";

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal border-t border-white/5">
      <div className="max-w-site mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="BSTC"
                width={28}
                height={28}
              />
              <span className="text-brand-red font-bold text-xl tracking-tight">
                BSTC
              </span>
            </div>
            <p className="mt-3 text-sm text-brand-grey leading-relaxed mb-4">
              The largest founder-led tech community in Bali and Southeast Asia.
            </p>
            <p className="text-xs text-brand-grey mb-2">Stay in the loop:</p>
            <NewsletterSignup />
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-grey mb-4">
              Community
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/events"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/how-i-build-with-ai"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  How I Build with AI
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  About the Community
                </Link>
              </li>
              <li>
                <Link
                  href="/leadership"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  Leadership
                </Link>
              </li>
              <li>
                <Link
                  href="/podcast"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  Podcast
                </Link>
              </li>
              <li>
                <a
                  href={SITE.memberDirectory}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  Member Directory
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-grey mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={SITE.meetup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  MeetUp
                </a>
              </li>
              <li>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-grey mb-4">
              Partners
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sponsors"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  Become a Sponsor
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-brand-grey hover:text-brand-white transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-grey">
            &copy; {new Date().getFullYear()} {SITE.fullName}. All rights
            reserved.
          </p>
          <p className="text-xs text-brand-grey">
            Canggu, Bali &middot; Southeast Asia
          </p>
        </div>
      </div>
    </footer>
  );
}
