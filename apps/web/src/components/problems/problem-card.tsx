import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SDG_CATEGORY_LABELS, type SDGCategory } from "@/types/enums";

interface ProblemCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
}

export function ProblemCard({
  id,
  title,
  description,
  category,
}: ProblemCardProps) {
  return (
    <Card href={`/problems/${id}`}>
      <CardTitle>{title}</CardTitle>
      <CardDescription className="line-clamp-2 text-white/80">{description}</CardDescription>
      <div className="mt-3 flex items-center gap-2">
        <Badge category={category}>{SDG_CATEGORY_LABELS[category as SDGCategory] ?? category}</Badge>
      </div>
    </Card>
  );
}
