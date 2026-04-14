"use client";

import { useState, useTransition } from "react";
import { reviewContributionAction } from "@/app/(platform)/projects/[slug]/issues/actions";

interface ReviewActionsProps {
  contributionId: string;
  issueId: string;
  projectSlug: string;
}

export function ReviewActions({
  contributionId,
  issueId,
  projectSlug,
}: ReviewActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<"accepted" | "rejected" | null>(null);

  function handleReview(decision: "accepted" | "rejected") {
    setError(null);
    startTransition(async () => {
      const result = await reviewContributionAction(
        contributionId,
        issueId,
        projectSlug,
        decision
      );
      if (result.error) {
        setError(result.error);
      }
      setConfirming(null);
    });
  }

  return (
    <div className="space-y-1">
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
      {confirming ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {confirming === "accepted" ? "Accept" : "Reject"} this contribution?
          </span>
          <button
            onClick={() => handleReview(confirming)}
            disabled={isPending}
            className={`rounded px-2 py-1 text-xs disabled:opacity-50 ${
              confirming === "accepted"
                ? "bg-green-800 text-green-200 hover:bg-green-700"
                : "bg-red-800 text-red-200 hover:bg-red-700"
            }`}
          >
            {isPending ? "..." : "Confirm"}
          </button>
          <button
            onClick={() => setConfirming(null)}
            disabled={isPending}
            className="rounded px-2 py-1 text-xs text-gray-400 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setConfirming("accepted")}
            className="rounded bg-green-800 px-2 py-1 text-xs text-green-200 hover:bg-green-700"
          >
            Accept
          </button>
          <button
            onClick={() => setConfirming("rejected")}
            className="rounded bg-red-800 px-2 py-1 text-xs text-red-200 hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
