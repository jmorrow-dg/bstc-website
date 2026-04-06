import { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE.fullName}. How we collect, use, and protect your data.`,
};

export default function PrivacyPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-site mx-auto px-6">
        <div className="max-w-3xl">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Legal
          </p>
          <h1 className="text-4xl font-display font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-brand-grey mb-12">
            Last updated: 4 April 2026
          </p>

          <div className="space-y-10 text-sm text-brand-grey leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-brand-white mb-3">
                1. Data We Collect
              </h2>
              <p className="mb-3">
                We collect the following data through events, online platforms,
                and community channels:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong className="text-brand-white">Name and email</strong> — 
                  via MeetUp, event registration, and website forms
                </li>
                <li>
                  <strong className="text-brand-white">
                    Company and role
                  </strong>{" "}
                . for community relevance and aggregated demographics
                </li>
                <li>
                  <strong className="text-brand-white">
                    Event attendance
                  </strong>{" "}
                . via MeetUp RSVP and manual headcount
                </li>
                <li>
                  <strong className="text-brand-white">
                    Feedback responses
                  </strong>{" "}
                . from post-event feedback forms
                </li>
                <li>
                  <strong className="text-brand-white">Photos and videos</strong>{" "}
                . taken at events for community content
                </li>
                <li>
                  <strong className="text-brand-white">Website analytics</strong>{" "}
                . anonymous usage data via Vercel Analytics
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand-white mb-3">
                2. How We Use Your Data
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Event operations (RSVPs, attendance tracking, feedback)</li>
                <li>
                  Community communication (WhatsApp, email updates, newsletter)
                </li>
                <li>
                  Content and marketing (event photos/videos for recaps, social
                  media, website)
                </li>
                <li>
                  Sponsor reporting: aggregated, anonymous data only (e.g.,
                  &ldquo;45 attendees, 40% founders&rdquo;). Never individual
                  data.
                </li>
                <li>Website analytics (anonymous, aggregated traffic data)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand-white mb-3">
                3. What We Never Do
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong className="text-brand-white">
                    Never sell personal data
                  </strong>{" "}
                  to anyone, for any reason
                </li>
                <li>
                  <strong className="text-brand-white">
                    Never share individual member data with sponsors
                  </strong>{" "}
                . sponsors receive aggregated demographics only
                </li>
                <li>
                  <strong className="text-brand-white">
                    Never share WhatsApp group member lists
                  </strong>{" "}
                  externally
                </li>
                <li>
                  <strong className="text-brand-white">
                    Never use data for unsolicited third-party marketing
                  </strong>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand-white mb-3">
                4. Photography & Video
              </h2>
              <p className="mb-3">
                By attending a BSTC event, attendees consent to being
                photographed and filmed for community content. This is
                communicated in event descriptions and at the start of each
                event.
              </p>
              <p>
                <strong className="text-brand-white">Opt out:</strong> Tell the
                host or photographer before the event. If you appear in a
                published photo, you can request removal at any time by emailing{" "}
                {SITE.email}.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand-white mb-3">
                5. Cookies & Tracking
              </h2>
              <p className="mb-3">
                This website uses essential cookies for site functionality and
                anonymous analytics via Vercel Analytics. We do not use:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Facebook Pixel</li>
                <li>Google Ads remarketing</li>
                <li>Cross-site tracking</li>
                <li>Browser fingerprinting</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand-white mb-3">
                6. Data Retention
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Active member data: retained while membership is active
                </li>
                <li>
                  Event attendance: 24 months individually, then anonymised
                </li>
                <li>
                  Photos/videos: indefinitely unless removal requested
                </li>
                <li>Website analytics: 24 months</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand-white mb-3">
                7. Your Rights
              </h2>
              <p>
                You can request access to, correction of, or deletion of your
                personal data at any time by emailing{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-brand-red hover:text-brand-white transition-colors"
                >
                  {SITE.email}
                </a>
                . We will respond within 48 hours and complete deletion within
                30 days (except where legal retention is required).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand-white mb-3">
                8. Contact
              </h2>
              <p>
                For any privacy-related questions or requests, contact us at{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-brand-red hover:text-brand-white transition-colors"
                >
                  {SITE.email}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
