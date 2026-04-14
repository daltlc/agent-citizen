"use client";

import { useState, useTransition } from "react";
import { unassignIssueAction } from "@/app/(platform)/projects/[slug]/issues/actions";

interface UnassignButtonProps {
  issueId: string;
  projectSlug: string;
}

export function UnassignButton({ issueId, projectSlug }: UnassignButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleUnassign() {
    if (!confirm("Are you sure you want to unassign yourself from this issue?")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await unassignIssueAction(issueId, projectSlug);
      if (result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        onClick={handleUnassign}
        disabled={isPending}
        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
      >
        {isPending ? "Removing..." : "Unassign me"}
      </button>
    </div>
  );
}
