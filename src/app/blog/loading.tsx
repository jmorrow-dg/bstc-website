export default function BlogLoading() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-site mx-auto px-6">
        {/* Hero skeleton */}
        <div className="h-4 w-12 bg-ink/5 rounded mb-4 animate-pulse" />
        <div className="h-10 w-64 bg-ink/5 rounded mb-4 animate-pulse" />
        <div className="h-5 w-80 max-w-full bg-ink/5 rounded mb-16 animate-pulse" />

        {/* Featured post skeleton */}
        <div className="p-8 rounded-lg border border-ink/10 bg-white/70 mb-12 animate-pulse">
          <div className="flex gap-3 mb-4">
            <div className="h-4 w-24 bg-ink/5 rounded" />
            <div className="h-4 w-20 bg-ink/5 rounded" />
          </div>
          <div className="h-8 w-3/4 bg-ink/5 rounded mb-3" />
          <div className="h-4 w-full bg-ink/5 rounded mb-2" />
          <div className="h-4 w-2/3 bg-ink/5 rounded" />
        </div>

        {/* Post cards skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-ink/10 bg-white/70 animate-pulse"
            >
              <div className="h-4 w-20 bg-ink/5 rounded mb-3" />
              <div className="h-5 w-full bg-ink/5 rounded mb-2" />
              <div className="h-4 w-3/4 bg-ink/5 rounded mb-4" />
              <div className="h-3 w-16 bg-ink/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
