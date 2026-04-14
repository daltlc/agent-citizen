export default function ProblemDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-32 animate-pulse rounded bg-citizen-muted" />
      <div className="h-10 w-3/4 animate-pulse rounded bg-citizen-muted" />
      <div className="flex gap-2">
        <div className="h-6 w-24 animate-pulse rounded-full bg-citizen-muted" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-citizen-muted" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-citizen-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-citizen-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-citizen-muted" />
      </div>
    </div>
  );
}
