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
      <p className="whitespace-pre-wrap text-gray-300">
        {problem.description}
      </p>

      {problem.createdBy && (
        <p className="text-sm text-gray-500">
          Created by{" "}
          <Link
            href={`/u/${problem.createdBy.username}`}
            className="text-gray-300 hover:text-white"
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
        <p className="mt-4 text-sm text-gray-500">
          No projects yet. Start one to tackle this problem.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {relatedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="block rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-gray-700"
            >
              <h3 className="font-medium">{project.name}</h3>
              {project.description && (
                <p className="mt-1 text-sm text-gray-400 line-clamp-2">
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
          className="text-sm text-gray-500 hover:text-gray-300"
        >
          &larr; Back to Problems
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{problem.title}</h1>
          {problem.verified && <Badge variant="success">Verified</Badge>}
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
