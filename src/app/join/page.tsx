import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Calendar, MessageCircle, Users } from "lucide-react";
import { SITE } from "@/lib/constants";
import { COMMUNITY_CHANNELS } from "@/lib/community";
import CommunitySignup from "@/components/community/CommunitySignup";

export const metadata: Metadata = {
  title: "Join BSTC",
  description:
    "Find your way into Bali Startup & Tech: community conversations, event updates and an optional member directory. Free to join; choose what works for you.",
  alternates: { canonical: "/join" },
};

const guidelines = [
  "Welcome local and visiting members. Be respectful and make room for different experiences.",
  "Share useful context when asking questions or posting links.",
  "Keep commercial promotion in Show & Tell. Ask before sending sales messages or adding someone to another group.",
  "Protect members’ personal information and contact an admin if something needs attention.",
];

export default function JoinPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">Bali Startup & Tech</p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Find your people.<br />
              <span className="text-brand-red">Build what&apos;s next.</span>
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed">
              Meet founders, builders and operators connected to Bali. Share
              what you are learning, find collaborators and get together at
              local events. Joining the community is free.
            </p>
          </div>
          <div className="max-w-3xl mx-auto mt-10 p-6 rounded-lg border border-brand-red/20 bg-brand-red/5">
            <h2 className="text-lg font-semibold mb-2">We&apos;re making more room</h2>
            <p className="text-sm text-brand-grey leading-relaxed">
              Our original WhatsApp discussion group has reached its 1,024-person
              limit. We are opening General 2 and new ways to stay connected.
              Register below to see the joining options that are ready.
            </p>
            <p className="text-sm text-brand-grey leading-relaxed mt-3">
              Waiting for WhatsApp access? Register here with your WhatsApp
              display name so our admins can match your request. A saved signup
              does not guarantee a place in a full group. Existing members can
              stay in General 1.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24" aria-labelledby="connection-options">
        <div className="max-w-site mx-auto px-6">
          <div className="text-center mb-10">
            <h2 id="connection-options" className="text-3xl font-display font-bold mb-3">Choose how you connect</h2>
            <p className="text-brand-grey">You do not need to join every platform.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {COMMUNITY_CHANNELS.map((channel) => (
              <article key={channel.id} className="flex flex-col p-7 rounded-lg border border-white/10 bg-white/[0.02]">
                <MessageCircle className="w-7 h-7 text-brand-red mb-5" aria-hidden="true" />
                <p className="text-xs font-medium uppercase tracking-wider text-brand-grey mb-2">{channel.purpose}</p>
                <h3 className="text-xl font-semibold mb-3">{channel.name}</h3>
                <p className="text-sm text-brand-grey leading-relaxed mb-6 flex-1">{channel.description}</p>
                <a href="#register" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm">
                  Register for joining options<ArrowRight size={16} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="register" className="pb-16 md:pb-24 scroll-mt-24" aria-labelledby="register-title">
        <div className="max-w-3xl mx-auto px-6">
          <h2 id="register-title" className="text-3xl font-display font-bold mb-3">Join the community</h2>
          <p className="text-brand-grey mb-8">Tell us a little about yourself. You choose which chats to join and whether to receive emails or share a member profile.</p>
          <CommunitySignup />
        </div>
      </section>

      <section className="py-16 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="p-7 rounded-lg border border-white/10 bg-white/[0.02]">
            <Calendar className="w-7 h-7 text-brand-red mb-5" aria-hidden="true" />
            <h2 className="text-2xl font-display font-bold mb-3">Meet in Bali</h2>
            <p className="text-brand-grey text-sm leading-relaxed mb-6">
              Practical founder conversations, live AI demos and introductions
              that help you move forward. Find confirmed dates, venues and
              registration details on our events page.
            </p>
            <Link href="/events" className="inline-flex items-center gap-2 text-brand-red hover:text-brand-white font-medium text-sm">
              See events<ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="p-7 rounded-lg border border-white/10 bg-white/[0.02]">
            <Users className="w-7 h-7 text-brand-red mb-5" aria-hidden="true" />
            <p className="text-xs text-brand-grey uppercase tracking-wider mb-2">Optional</p>
            <h2 className="text-2xl font-display font-bold mb-3">Help people find you</h2>
            <p className="text-brand-grey text-sm leading-relaxed mb-4">
              Add what you are building, what you need and how you can help to
              your profile. You can opt in to sharing it with other opted-in
              members when the directory is available. Phone numbers and email
              addresses are not published.
            </p>
            <p className="text-brand-grey text-sm leading-relaxed mb-6">
              Directory participation is optional and separate from email
              updates. It does not guarantee a place in a full chat group.
            </p>
            <a href="#register" className="inline-flex items-center gap-2 text-brand-red hover:text-brand-white font-medium text-sm">
              Add your profile<ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h2 id="community-guidelines" className="text-3xl font-display font-bold mb-4 scroll-mt-24">A good place to start</h2>
            <p className="text-brand-grey leading-relaxed mb-8">
              Introduce yourself with your name, what you are building or
              working on, and one thing you would like help with—or can help
              others with.
            </p>
            <ul className="space-y-4 text-sm text-brand-grey list-disc pl-5">
              {guidelines.map((guideline) => <li key={guideline} className="pl-2 leading-relaxed">{guideline}</li>)}
            </ul>
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-sm text-brand-grey mb-4">Find community stories and event updates:</p>
              <div className="flex flex-wrap gap-5">
                {[{ label: "Meetup", url: SITE.meetup }, { label: "LinkedIn", url: SITE.linkedin }, { label: "Instagram", url: SITE.instagram }].map((item) => (
                  <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-red hover:text-brand-white transition-colors">{item.label}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

