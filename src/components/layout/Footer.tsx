import Link from "next/link";
import { SITE } from "@/lib/constants";
import NewsletterSignup from "./NewsletterSignup";

type FooterLink = { label: string; href: string; external?: boolean };

// Every link the footer carried before the Global league restyle, plus About,
// Perks and Remote Builders. External links keep their old targets.
const COMMUNITY: FooterLink[] = [
  { label: "Events", href: "/events" },
  { label: "How I Build with AI", href: "/how-i-build-with-ai" },
  { label: "About the community", href: "/community" },
  { label: "About", href: "/about" },
  { label: "Leadership", href: "/leadership" },
  { label: "Podcast", href: "/podcast" },
  { label: "Member directory", href: SITE.memberDirectory, external: true },
  { label: "Perks", href: "/perks" },
];

const CONNECT: FooterLink[] = [
  { label: "Meetup", href: SITE.meetup, external: true },
  { label: "Join", href: `${SITE.joinForm}?src=footer` },
  { label: "LinkedIn", href: SITE.linkedin, external: true },
  { label: "Instagram", href: SITE.instagram, external: true },
  { label: "Remote Builders", href: "https://remotebuilders.io", external: true },
];

const PARTNERS: FooterLink[] = [
  { label: "Become a sponsor", href: "/sponsors" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "FAQ", href: "/faq" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
];

function FooterColumn({
  id,
  title,
  links,
}: {
  id: string;
  title: string;
  links: FooterLink[];
}) {
  return (
    <nav className="gl-foot-col" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ) : (
              <Link href={link.href}>{link.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="gl-foot">
      <div className="gl-wrap gl-foot-grid">
        <div className="gl-foot-id">
          <Link href="/" className="gl-brand" aria-label="Bali Startup and Tech, home">
            <span className="gl-crest" aria-hidden="true" />
            <span className="gl-brand-name">Bali Startup &amp; Tech</span>
          </Link>
          {/* Confirmed true by Lachlan, 28 Oct 2026 */}
          <p>The largest founder-led tech community in Bali and Southeast Asia.</p>
          <NewsletterSignup />
        </div>
        <FooterColumn id="fc-community" title="Community" links={COMMUNITY} />
        <FooterColumn id="fc-connect" title="Connect" links={CONNECT} />
        <FooterColumn id="fc-partners" title="Partners" links={PARTNERS} />
      </div>
      <div className="gl-wrap gl-foot-base">
        <p>
          &copy; {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
        </p>
        <p>Canggu, Bali, Southeast Asia</p>
      </div>
    </footer>
  );
}
