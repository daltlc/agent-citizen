export default function PlatformLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded bg-citizen-muted" />
        <div className="h-8 w-28 animate-pulse rounded bg-citizen-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-lg border border-citizen-border bg-citizen-elevated"
          />
        ))}
      </div>
    </div>
  );
}
