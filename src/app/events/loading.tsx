export default function EventsLoading() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-site mx-auto px-6">
        {/* Hero skeleton */}
        <div className="h-4 w-16 bg-ink/5 rounded mb-4 animate-pulse" />
        <div className="h-10 w-72 bg-ink/5 rounded mb-4 animate-pulse" />
        <div className="h-5 w-96 max-w-full bg-ink/5 rounded mb-16 animate-pulse" />

        {/* Event cards skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-ink/10 bg-white/70 animate-pulse"
            >
              <div className="flex gap-3 mb-4">
                <div className="h-5 w-20 bg-ink/5 rounded" />
                <div className="h-5 w-28 bg-ink/5 rounded" />
              </div>
              <div className="h-6 w-3/4 bg-ink/5 rounded mb-3" />
              <div className="h-4 w-full bg-ink/5 rounded mb-2" />
              <div className="h-4 w-2/3 bg-ink/5 rounded mb-4" />
              <div className="flex gap-4">
                <div className="h-3 w-24 bg-ink/5 rounded" />
                <div className="h-3 w-20 bg-ink/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
