import { Metadata } from "next";
import {
  MessageCircle,
  Calendar,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Join BSTC",
  description:
    "Join Bali Startup & Tech Community — 2,500+ founders, engineers, and operators. Free to join. Three steps: WhatsApp, MeetUp, Show up.",
};

export default function JoinPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              Join Us
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Three Steps.
              <br />
              <span className="text-brand-red">That&apos;s It.</span>
            </h1>
            <p className="text-lg text-brand-grey">
              No application form. No membership fee. No gatekeeping. If
              you&apos;re building something, you belong here.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center p-8 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="text-brand-red font-mono text-sm mb-4">
                Step 01
              </div>
              <MessageCircle className="w-8 h-8 text-brand-red mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brand-white mb-3">
                Join WhatsApp
              </h3>
              <p className="text-sm text-brand-grey mb-6">
                Our WhatsApp community is where ongoing conversations happen.
                Event announcements, community highlights, and real connections.
              </p>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm"
              >
                Join WhatsApp
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Step 2 */}
            <div className="text-center p-8 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="text-brand-red font-mono text-sm mb-4">
                Step 02
              </div>
              <Calendar className="w-8 h-8 text-brand-red mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brand-white mb-3">
                RSVP on MeetUp
              </h3>
              <p className="text-sm text-brand-grey mb-6">
                Our events are listed on MeetUp. RSVP to secure your spot — it
                helps us plan capacity and means you won&apos;t miss out.
              </p>
              <a
                href={SITE.meetup}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
              >
                Join MeetUp
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Step 3 */}
            <div className="text-center p-8 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="text-brand-red font-mono text-sm mb-4">
                Step 03
              </div>
              <CheckCircle className="w-8 h-8 text-brand-red mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brand-white mb-3">
                Show Up
              </h3>
              <p className="text-sm text-brand-grey mb-6">
                Come on time, wear your name tag, do your 60-second intro. The
                host will make sure you meet the right people. No pitch decks
                needed.
              </p>
              <a
                href="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
              >
                See Events
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            Your First Event
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              {
                title: "Arrive a few minutes early",
                desc: "Events start on time. Grab a drink and find the host — they'll be near the entrance welcoming people.",
              },
              {
                title: "Grab a name tag",
                desc: "Write your name and what you're building. It helps people connect with you and start conversations.",
              },
              {
                title: "Do your 60-second intro",
                desc: "When it's your turn: name, what you're building, what you need. Keep it under 60 seconds. No selling.",
              },
              {
                title: "Let the host connect you",
                desc: "The host will float around making introductions. If you're stuck, just ask — they'll connect you with someone relevant.",
              },
              {
                title: "No hard selling",
                desc: "Don't corner people with pitches. Don't hand out business cards unless asked. Build genuine connections.",
              },
              {
                title: "Submit feedback after",
                desc: "You'll get a feedback link. Your input directly shapes future events. We take it seriously.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-lg border border-white/5 bg-white/[0.02]"
              >
                <div className="text-brand-red font-mono text-sm mt-0.5 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-semibold text-brand-white text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-grey">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Stay Connected
          </h2>
          <p className="text-brand-grey max-w-lg mx-auto mb-8">
            Follow us on LinkedIn and Instagram for event recaps, founder
            stories, and community updates.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
            >
              LinkedIn
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
            >
              Instagram
            </a>
            <a
              href={SITE.meetup}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
            >
              MeetUp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
