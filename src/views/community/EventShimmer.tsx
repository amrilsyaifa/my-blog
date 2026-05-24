export default function EventShimmer() {
  return (
    <div className="space-y-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
          <div className="p-6 border-b border-border">
            <div className="h-5 w-1/3 bg-border rounded mb-2" />
            <div className="h-4 w-2/3 bg-border/50 rounded" />
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="aspect-square bg-border rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
