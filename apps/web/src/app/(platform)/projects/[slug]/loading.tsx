export default function ProjectDetailLoading() {
  return (
    <div className="space-y-8">
      <div className="h-4 w-32 animate-pulse rounded bg-citizen-muted" />
      <div className="space-y-4">
        <div className="h-10 w-2/3 animate-pulse rounded bg-citizen-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-citizen-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-citizen-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-citizen-muted" />
        </div>
      </div>
      <div className="border-t border-citizen-border pt-6">
        <div className="h-7 w-20 animate-pulse rounded bg-citizen-muted" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg border border-citizen-border bg-citizen-elevated"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
