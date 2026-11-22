import Link from "next/link";
import {
  HISTORY_CHECKED,
  HistoryNight,
  formatCount,
  nightLabel,
  shortDate,
} from "@/lib/event-history";

// Every past night, newest first. A row links to this site's page for that
// night when there is one, otherwise to its Meetup listing. Labels are
// consistent ("Drinks & Dinner #37") even where the old page title differs.
export default function HistoryTable({
  nights,
  pageFor,
  title,
  caption,
}: {
  nights: HistoryNight[];
  // This site's page path for a night, if it has one.
  pageFor: (night: HistoryNight) => string | undefined;
  title: string;
  caption: string;
}) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">{title}</h2>
      <p className="text-sm text-brand-grey mb-6 max-w-3xl">{caption}</p>
      {/* The table scrolls inside its own box on a phone, never the page. */}
      <div className="max-w-full overflow-x-auto rounded-lg border border-ink/10 bg-white/70">
        <table className="w-full text-sm text-left">
          <caption className="sr-only">
            {title}. RSVPs on Meetup, checked {HISTORY_CHECKED}.
          </caption>
          <thead className="text-xs uppercase tracking-wider text-brand-grey border-b border-ink/10">
            <tr>
              <th scope="col" className="px-3 md:px-4 py-3 font-medium">Night</th>
              <th scope="col" className="px-3 md:px-4 py-3 font-medium">Date</th>
              <th scope="col" className="hidden md:table-cell px-3 md:px-4 py-3 font-medium">Venue</th>
              <th scope="col" className="px-3 md:px-4 py-3 font-medium text-right">
                <span className="md:hidden">Meetup RSVPs</span>
                <span className="hidden md:inline">RSVPs on Meetup</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {nights.map((n) => {
              const page = pageFor(n);
              const label = nightLabel(n);
              return (
                <tr key={n.url} className="border-b border-ink/5 last:border-0">
                  <th scope="row" className="px-3 md:px-4 py-2.5 font-medium text-brand-white">
                    {page ? (
                      <Link href={page} className="underline decoration-ink/20 hover:text-brand-red">
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-ink/20 hover:text-brand-red"
                      >
                        {label}
                      </a>
                    )}
                    {/* On a phone the venue sits under the night, so the table fits. */}
                    <span className="md:hidden block text-xs font-normal text-brand-grey mt-0.5">
                      {n.venue}, {n.locality}
                    </span>
                  </th>
                  <td className="px-3 md:px-4 py-2.5 text-brand-grey whitespace-nowrap">
                    <time dateTime={n.date}>{shortDate(n.date)}</time>
                  </td>
                  <td className="hidden md:table-cell px-3 md:px-4 py-2.5 text-brand-grey">
                    {n.venue}, {n.locality}
                  </td>
                  <td className="px-3 md:px-4 py-2.5 text-brand-grey text-right tabular-nums">
                    {formatCount(n.rsvps)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
