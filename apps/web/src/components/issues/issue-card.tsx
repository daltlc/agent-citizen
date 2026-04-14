import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import type { IssueStatus } from "@/types/enums";

interface IssueCardProps {
  id: string;
  title: string;
  difficulty: string;
  status: string;
  assignedTo: { id: string; username: string } | null;
  assignedAgentName: string | null;
  projectSlug: string;
}

const difficultyVariant: Record<string, "success" | "warning" | "danger"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

export function IssueCard({
  id,
  title,
  difficulty,
  status,
  assignedTo,
  assignedAgentName,
  projectSlug,
}: IssueCardProps) {
  return (
    <Link
      href={`/projects/${projectSlug}/issues/${id}`}
      className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-gray-700 hover:bg-gray-900"
    >
      <div className="space-y-1">
        <h3 className="font-medium text-gray-100">{title}</h3>
        <div className="flex items-center gap-2">
          <Badge variant={difficultyVariant[difficulty] ?? "default"}>
            {difficulty}
          </Badge>
          {assignedTo && (
            <span className="text-xs text-gray-500">
              {assignedAgentName
                ? `${assignedTo.username}'s ${assignedAgentName}`
                : assignedTo.username}
            </span>
          )}
        </div>
      </div>
      <StatusBadge status={status as IssueStatus} />
    </Link>
  );
}
