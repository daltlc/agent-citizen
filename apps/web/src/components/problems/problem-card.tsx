import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SDG_CATEGORY_LABELS, type SDGCategory } from "@/types/enums";

interface ProblemCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  createdBy: { username: string } | null;
}

export function ProblemCard({
  id,
  title,
  description,
  category,
  createdBy,
}: ProblemCardProps) {
  return (
    <Card href={`/problems/${id}`}>
      <CardTitle>{title}</CardTitle>
      <CardDescription className="line-clamp-2">{description}</CardDescription>
      <div className="mt-3 flex items-center gap-2">
        <Badge category={category}>{SDG_CATEGORY_LABELS[category as SDGCategory] ?? category}</Badge>
        {createdBy && (
          <span className="text-xs text-citizen-text-dim">by {createdBy.username}</span>
        )}
      </div>
    </Card>
  );
}
