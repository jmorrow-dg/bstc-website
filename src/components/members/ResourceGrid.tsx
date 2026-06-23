import { ExternalLink } from "lucide-react";
import { ResourceRecord } from "@/lib/resources";

export default function ResourceGrid({
  resources,
  emptyTitle,
  emptyBody,
}: {
  resources: ResourceRecord[];
  emptyTitle: string;
  emptyBody: string;
}) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-16 border border-white/5 rounded-lg bg-white/[0.02]">
        <p className="text-brand-white font-semibold mb-1">{emptyTitle}</p>
        <p className="text-brand-grey text-sm max-w-md mx-auto">{emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((r) => {
        const inner = (
          <>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-brand-white text-sm group-hover:text-brand-red transition-colors">
                {r.title}
              </h3>
              {r.url && (
                <ExternalLink
                  size={12}
                  className="text-brand-grey group-hover:text-brand-red transition-colors flex-shrink-0 mt-0.5"
                />
              )}
            </div>
            {r.description && (
              <p className="text-xs text-brand-grey leading-relaxed mb-2">{r.description}</p>
            )}
            {r.contributor && (
              <p className="text-[11px] text-brand-grey/70">Shared by {r.contributor}</p>
            )}
          </>
        );
        return r.url ? (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all"
          >
            {inner}
          </a>
        ) : (
          <div key={r.id} className="p-5 rounded-lg border border-white/5 bg-white/[0.02]">
            {inner}
          </div>
        );
      })}
    </div>
  );
}
