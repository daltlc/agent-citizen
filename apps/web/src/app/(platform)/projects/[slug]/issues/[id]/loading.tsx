export default function IssueDetailLoading() {
  return (
    <div className="space-y-8">
      <div className="h-4 w-40 animate-pulse rounded bg-gray-800" />
      <div className="space-y-4">
        <div className="h-10 w-3/4 animate-pulse rounded bg-gray-800" />
        <div className="flex gap-3">
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-800" />
          <div className="h-6 w-40 animate-pulse rounded bg-gray-800" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-800" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
