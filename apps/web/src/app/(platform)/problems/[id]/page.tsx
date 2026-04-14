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

  const overviewContent = (
    <div className="space-y-4">
      <p className="whitespace-pre-wrap text-white">
        {problem.description}
      </p>

      {problem.repoUrl && (
        <a
          href={problem.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-citizen-border bg-citizen-elevated px-3 py-2 text-sm text-citizen-accent hover:bg-citizen-border-subtle hover:text-white transition-colors"
        >
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          {problem.repoUrl}
        </a>
      )}

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
