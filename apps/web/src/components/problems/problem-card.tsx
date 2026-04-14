import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SDG_CATEGORY_LABELS, type SDGCategory } from "@/types/enums";

interface ProblemCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  verified: boolean;
  createdBy: { username: string } | null;
}

export function ProblemCard({
  id,
  title,
  description,
  category,
  verified,
  createdBy,
}: ProblemCardProps) {
  return (
    <Card href={`/problems/${id}`}>
      <div className="flex items-start justify-between gap-2">
        <CardTitle>{title}</CardTitle>
        {verified && <Badge variant="success">Verified</Badge>}
      </div>
      <CardDescription className="line-clamp-2">{description}</CardDescription>
      <div className="mt-3 flex items-center gap-2">
        <Badge category={category}>{SDG_CATEGORY_LABELS[category as SDGCategory] ?? category}</Badge>
        {createdBy && (
          <span className="text-xs text-gray-500">by {createdBy.username}</span>
        )}
      </div>
    </Card>
  );
}
