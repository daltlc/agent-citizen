export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProblemById } from "@/lib/db/queries/problems";
import { getProjectsByProblemId } from "@/lib/db/queries/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProblemDetailTabs } from "@/components/problems/problem-detail-tabs";
import { SDG_CATEGORY_LABELS, type SDGCategory } from "@/types/enums";

export default async function ProblemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const problem = await getProblemById(params.id);

  if (!problem) {
    notFound();
  }

  const relatedProjects = await getProjectsByProblemId(problem.id);

  const topProject = relatedProjects[0] ?? null;

  const overviewContent = (
    <div className="space-y-6">
      <p className="whitespace-pre-wrap text-white">
        {problem.description}
      </p>

      {problem.createdBy && (
        <p className="text-sm text-citizen-text-dim">
          Created by{" "}
          <Link
            href={`/u/${problem.createdBy.username}`}
            className="text-citizen-sand hover:text-citizen-text"
          >
            {problem.createdBy.username}
          </Link>
        </p>
      )}

      {topProject && (
        <div className="border-t border-citizen-border pt-6">
          <h3 className="text-sm font-medium text-citizen-text-muted">Top Project</h3>
          <Link
            href={`/projects/${topProject.slug}`}
            className="mt-2 block rounded-lg border border-citizen-border bg-citizen-elevated p-4 transition-colors hover:border-citizen-border-subtle"
          >
            <h4 className="font-medium">{topProject.name}</h4>
            {topProject.description && (
              <p className="mt-1 text-sm text-citizen-text-muted line-clamp-2">
                {topProject.description}
              </p>
            )}
          </Link>
        </div>
      )}
    </div>
  );

  const projectsContent = (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects solving this</h2>
        <Link href={`/projects/new?problem=${problem.id}`}>
          <Button size="sm" variant="secondary">
            Start a Project
          </Button>
        </Link>
      </div>
      {relatedProjects.length === 0 ? (
        <p className="mt-4 text-sm text-citizen-text-dim">
          No projects yet. Start one to tackle this problem.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {relatedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="block rounded-lg border border-citizen-border bg-citizen-elevated p-4 transition-colors hover:border-citizen-border-subtle"
            >
              <h3 className="font-medium">{project.name}</h3>
              {project.description && (
                <p className="mt-1 text-sm text-citizen-text-muted line-clamp-2">
                  {project.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/problems"
          className="text-sm text-citizen-text-dim hover:text-citizen-sand"
        >
          &larr; Back to Problems
        </Link>
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{problem.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge category={problem.category}>
            {SDG_CATEGORY_LABELS[problem.category as SDGCategory] ??
              problem.category}
          </Badge>
          {problem.tags?.map((t) => (
            <Badge key={t} tag={t}>
              {t}
            </Badge>
          ))}
        </div>
      </div>

      <ProblemDetailTabs
        overview={overviewContent}
        projects={projectsContent}
      />
    </div>
  );
}
