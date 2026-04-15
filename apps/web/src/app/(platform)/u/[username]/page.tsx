export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getCitizenByUsername,
  getCitizenProjects,
  getCitizenActiveAssignments,
  getCitizenContributions,
} from "@/lib/db/queries/citizens";
import { CitizenScoreBadge } from "@/components/citizens/citizen-score-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import type { IssueStatus } from "@/types/enums";

export default async function CitizenProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const citizen = await getCitizenByUsername(params.username);
  if (!citizen) notFound();

  const [ownedProjects, assignments, contributionsList] = await Promise.all([
    getCitizenProjects(citizen.id),
    getCitizenActiveAssignments(citizen.id),
    getCitizenContributions(citizen.id),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        {citizen.avatarUrl ? (
          <Image
            src={citizen.avatarUrl}
            alt={citizen.username}
            width={80}
            height={80}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-citizen-muted text-2xl font-bold">
            {citizen.username[0]?.toUpperCase()}
          </div>
        )}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{citizen.username}</h1>
          {citizen.bio && (
            <p className="text-citizen-text-muted">{citizen.bio}</p>
          )}
          <CitizenScoreBadge score={citizen.citizenScore} size="lg" />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Active Assignments</h2>
        {assignments.filter((a) => a.status !== "completed" && a.status !== "closed").length === 0 ? (
          <p className="text-sm text-citizen-text-dim">No active assignments.</p>
        ) : (
          <div className="space-y-3">
            {assignments
              .filter((a) => a.status !== "completed" && a.status !== "closed")
              .map((assignment) => (
                <Link
                  key={assignment.id}
                  href={`/projects/${assignment.projectSlug}/issues/${assignment.id}`}
                  className="flex items-center justify-between rounded-lg border border-citizen-border bg-citizen-elevated p-3 transition-colors hover:border-citizen-border-subtle hover:bg-citizen-bg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{assignment.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          assignment.difficulty === "beginner"
                            ? "success"
                            : assignment.difficulty === "intermediate"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {assignment.difficulty}
                      </Badge>
                      {assignment.assignedAgentName && (
                        <span className="text-xs text-citizen-text-dim">
                          via {assignment.assignedAgentName}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={assignment.status as IssueStatus} />
                </Link>
              ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Contributions</h2>
        {contributionsList.length === 0 ? (
          <p className="text-sm text-citizen-text-dim">No contributions yet.</p>
        ) : (
          <div className="space-y-3">
            {contributionsList.map((contribution) => (
              <div
                key={contribution.id}
                className="flex items-center justify-between rounded-lg border border-citizen-border bg-citizen-elevated/80 p-3"
              >
                <a
                  href={contribution.externalRef.startsWith("http") ? contribution.externalRef : `https://${contribution.externalRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  {contribution.externalRef}
                </a>
                <Badge
                  variant={
                    contribution.status === "accepted"
                      ? "success"
                      : contribution.status === "rejected"
                      ? "danger"
                      : "warning"
                  }
                >
                  {contribution.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Projects</h2>
        {ownedProjects.length === 0 ? (
          <p className="text-sm text-citizen-text-dim">No projects yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {ownedProjects.map((project) => (
              <Card key={project.id} href={`/projects/${project.slug}`}>
                <CardTitle>{project.name}</CardTitle>
                {project.description && (
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
