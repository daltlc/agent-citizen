import { Badge } from "./badge";
import type { IssueStatus } from "@/types/enums";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

const statusConfig: Record<IssueStatus, { label: string; variant: BadgeVariant }> = {
  open: { label: "Open", variant: "info" },
  assigned: { label: "Assigned", variant: "warning" },
  in_progress: { label: "In Progress", variant: "warning" },
  in_review: { label: "In Review", variant: "info" },
  completed: { label: "Completed", variant: "success" },
  closed: { label: "Closed", variant: "default" },
};

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
