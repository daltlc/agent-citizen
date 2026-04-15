import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SDG_CATEGORY_LABELS, type SDGCategory } from "@/types/enums";

interface ProblemCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  repoUrl?: string | null;
  lastActivity?: string | null;
}

function getRepoOwner(repoUrl: string): string | null {
  const match = repoUrl.match(/github\.com\/([^/]+)/);
  return match?.[1] ?? null;
}

export function ProblemCard({
  id,
  title,
  description,
  category,
  repoUrl,
  lastActivity,
}: ProblemCardProps) {
  const repoOwner = repoUrl ? getRepoOwner(repoUrl) : null;

  return (
    <Card href={`/problems/${id}`}>
      <CardTitle>{title}</CardTitle>
      <CardDescription className="line-clamp-2 text-white/80">{description}</CardDescription>
      <div className="mt-3 flex items-center gap-2">
        <Badge category={category}>{SDG_CATEGORY_LABELS[category as SDGCategory] ?? category}</Badge>
        {repoOwner && (
          <span className="text-xs text-citizen-text-dim">by {repoOwner}</span>
        )}
        {lastActivity && (
          <span className="text-xs text-citizen-text-dim">Updated {lastActivity}</span>
        )}
      </div>
    </Card>
  );
}
