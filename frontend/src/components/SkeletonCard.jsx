export default function SkeletonCard() {
  return (
    <div className="border border-black/10 rounded-lg overflow-hidden bg-white animate-pulse">
      <div className="aspect-square bg-black/10" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-black/10 rounded w-3/4" />
        <div className="h-3 bg-black/10 rounded w-1/3" />
        <div className="flex justify-between items-center">
          <div className="h-4 bg-black/10 rounded w-1/4" />
          <div className="h-3 bg-black/10 rounded w-1/5" />
        </div>
        <div className="h-9 bg-black/10 rounded mt-3" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
