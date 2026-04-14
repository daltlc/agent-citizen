import { Badge } from "@/components/ui/badge";

interface ContributionCardProps {
  id: string;
  externalRef: string;
  status: string;
  submittedAt: Date;
  citizen: { username: string } | null;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

const statusVariant: Record<string, "default" | "success" | "danger" | "warning" | "info"> = {
  pending: "warning",
  accepted: "success",
  rejected: "danger",
};

export function ContributionCard({
  externalRef,
  status,
  submittedAt,
  citizen,
  showActions,
  onAccept,
  onReject,
}: ContributionCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/30 p-3">
      <div className="space-y-1">
        <a
          href={externalRef.startsWith("http") ? externalRef : `https://${externalRef}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {externalRef}
        </a>
        <div className="flex items-center gap-2">
          {citizen && (
            <span className="text-xs text-gray-500">{citizen.username}</span>
          )}
          <span className="text-xs text-gray-600">
            {submittedAt.toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={statusVariant[status] ?? "default"}>{status}</Badge>
        {showActions && status === "pending" && (
          <>
            <button
              onClick={onAccept}
              className="rounded bg-green-800 px-2 py-1 text-xs text-green-200 hover:bg-green-700"
            >
              Accept
            </button>
            <button
              onClick={onReject}
              className="rounded bg-red-800 px-2 py-1 text-xs text-red-200 hover:bg-red-700"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}
