import {
  EVENT_HISTORY,
  HISTORY_CHECKED,
  MEETUP_GROUP_URL,
  SeriesSlug,
  formatCount,
  getHistoryStats,
  shortDate,
} from "@/lib/event-history";

// Dated proof from the BSTC Meetup group. Every figure shows the date it was
// checked and its source, and RSVP counts are labelled "RSVPs on Meetup":
// many people register on Luma instead, and those aren't counted here.
export default function EventProof({
  series,
  title = "The record so far",
  headingLevel = "h2",
  compact = false,
}: {
  series?: SeriesSlug;
  title?: string;
  headingLevel?: "h2" | "h3";
  compact?: boolean;
}) {
  const all = getHistoryStats();
  const own = series ? getHistoryStats(series) : all;
  const { group } = EVENT_HISTORY;
  const Heading = headingLevel;

  const nightsLabel =
    series === "drinks-and-dinner"
      ? `Drinks & Dinner nights since ${shortDate(own.firstDate)}`
      : series === "how-i-ai"
        ? `How I AI editions since ${shortDate(own.firstDate)}`
        : `nights since ${shortDate(all.firstDate)}`;

  const nightsNote =
    series === "drinks-and-dinner"
      ? "Including Melbourne #1 and Berawa #36."
      : series === "how-i-ai"
        ? `Out of ${all.nights} BSTC nights in all.`
        : `${all.dinners} Drinks & Dinner nights and ${all.howIAi} How I AI editions.`;

  const stats = [
    { value: formatCount(own.nights), label: nightsLabel, note: nightsNote },
    {
      value: formatCount(own.rsvps),
      label: series ? "RSVPs on Meetup for these nights" : "RSVPs on Meetup",
      note: "Luma sign-ups aren't counted.",
    },
    {
      value: `${group.ratingAverage}`,
      label: `out of 5, from ${formatCount(group.ratingCount)} Meetup ratings`,
      note: "Across all BSTC nights.",
    },
    {
      value: formatCount(group.members),
      label: "Meetup group members",
      note: "The BSTC group on Meetup.",
    },
  ];

  return (
    <div className={compact ? "" : "rounded-lg border border-ink/10 bg-white/70 p-6 md:p-8"}>
      <Heading
        className={
          compact
            ? "text-sm font-medium uppercase tracking-wider text-brand-grey mb-3"
            : "text-2xl md:text-3xl font-display font-bold mb-6"
        }
      >
        {title}
      </Heading>
      <dl className={`grid grid-cols-2 gap-4 ${compact ? "md:grid-cols-4" : "lg:grid-cols-4 md:gap-6"}`}>
        {stats.map((s) => (
          <div key={s.label} className="min-w-0 flex flex-col">
            <dt className="order-2 text-sm text-brand-white">{s.label}</dt>
            <dd
              className={`order-1 m-0 font-display font-bold text-brand-white ${
                compact ? "text-2xl" : "text-3xl md:text-4xl"
              }`}
            >
              {s.value}
            </dd>
            {!compact && <dd className="order-3 m-0 mt-1 text-xs text-brand-grey">{s.note}</dd>}
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-brand-grey">
        Source:{" "}
        <a
          href={MEETUP_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-brand-red"
        >
          Bali Startup &amp; Tech on Meetup
        </a>
        , checked {HISTORY_CHECKED}. RSVP counts are Meetup RSVPs only; many people register on Luma instead.
      </p>
    </div>
  );
}
