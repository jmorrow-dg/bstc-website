import { MessageCircle, ArrowRight } from "lucide-react";
import { memberRooms } from "@/lib/members";
import { openGroups } from "@/lib/community-groups";
import { SITE } from "@/lib/constants";

/**
 * Server component: the member's WhatsApp rooms, rendered post-signup on
 * /members. Shows the rooms matched at signup (rooms cookie); members from
 * before rooms existed get the full list to pick from. If no room invite env
 * vars are configured yet, falls back to the single community-wide invite.
 */
export default function CommunityRooms() {
  const open = openGroups();

  if (open.length === 0) {
    return (
      <a
        href={SITE.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
      >
        <MessageCircle size={18} /> Join the WhatsApp community
      </a>
    );
  }

  const mine = memberRooms();
  const matched = open.filter((g) => mine.includes(g.id));
  const rooms = matched.length > 0 ? matched : open;
  const picked = matched.length > 0;

  return (
    <div className="mt-8">
      <h2 className="font-display font-bold text-xl text-brand-white mb-1">
        Your WhatsApp rooms
      </h2>
      <p className="text-sm text-brand-grey mb-4">
        {picked
          ? "Matched to what you told us. Your rooms are where the community lives day to day."
          : "Pick the rooms that fit you. Rooms are where the community lives day to day."}
      </p>
      <div className="space-y-3">
        {rooms.map((g) => (
          <div
            key={g.id}
            className="flex items-center gap-4 p-4 rounded-lg border border-white/5 bg-white/[0.02]"
          >
            <span className="text-2xl flex-shrink-0" aria-hidden="true">
              {g.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-brand-white text-sm">{g.name}</h3>
              <p className="text-xs text-brand-grey leading-relaxed">{g.desc}</p>
            </div>
            <a
              href={g.invite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm"
            >
              Join <ArrowRight size={13} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
