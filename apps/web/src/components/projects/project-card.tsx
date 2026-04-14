import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SDG_CATEGORY_LABELS, type SDGCategory } from "@/types/enums";

interface ProjectCardProps {
  slug: string;
  name: string;
  description: string | null;
  problem: { title: string; category: string } | null;
  owner: { username: string } | null;
}

export function ProjectCard({
  slug,
  name,
  description,
  problem,
  owner,
}: ProjectCardProps) {
  return (
    <Card href={`/projects/${slug}`}>
      <CardTitle>{name}</CardTitle>
      {description && (
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      )}
      <div className="mt-3 flex items-center gap-2">
        {problem && (
          <Badge category={problem.category}>
            {SDG_CATEGORY_LABELS[problem.category as SDGCategory] ??
              problem.category}
          </Badge>
        )}
        {owner && (
          <span className="text-xs text-citizen-text-dim">by {owner.username}</span>
        )}
      </div>
      {problem && (
        <p className="mt-2 text-xs text-citizen-text-dim">
          Solving: {problem.title}
        </p>
      )}
    </Card>
  );
}
