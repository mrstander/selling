export default function ValuationSkeleton() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      {/* Hero card skeleton */}
      <div className="card p-8 md:p-10 mb-6">
        <div className="skeleton h-4 w-40 mb-3" />
        <div className="skeleton h-12 w-72 mb-2" />
        <div className="skeleton h-4 w-56 mb-8" />
        <div className="border-t border-sand-100 pt-6">
          <div className="skeleton h-5 w-80 mb-2" />
          <div className="skeleton h-4 w-48" />
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="skeleton h-3 w-20 mb-3" />
            <div className="skeleton h-6 w-16" />
          </div>
        ))}
      </div>

      {/* History skeleton */}
      <div className="card p-6 md:p-8">
        <div className="skeleton h-6 w-40 mb-6" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-sand-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="skeleton w-8 h-8 rounded-full" />
              <div>
                <div className="skeleton h-4 w-32 mb-1" />
                <div className="skeleton h-3 w-20" />
              </div>
            </div>
            <div className="skeleton h-5 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
