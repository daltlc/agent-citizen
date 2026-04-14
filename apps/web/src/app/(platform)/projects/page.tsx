export const dynamic = "force-dynamic";

import Link from "next/link";
import { getProjects } from "@/lib/db/queries/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";

export default async function ProjectsPage() {
  const projectsList = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/projects/new">
          <Button size="sm">New Project</Button>
        </Link>
      </div>

      {projectsList.length === 0 ? (
        <p className="text-center text-gray-500">
          No projects yet. Start one to solve a real-world problem.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projectsList.map((project) => (
            <ProjectCard
              key={project.id}
              slug={project.slug}
              name={project.name}
              description={project.description}
              problem={project.problem}
              owner={project.owner}
            />
          ))}
        </div>
      )}
    </div>
  );
}
