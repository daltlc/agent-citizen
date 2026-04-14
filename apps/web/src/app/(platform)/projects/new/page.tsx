export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { getProblems } from "@/lib/db/queries/problems";
import { ProjectForm } from "@/components/projects/project-form";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: { problem?: string };
}) {
  let citizen = null;

  try {
    citizen = await getCurrentCitizen();
  } catch {
    // Auth not configured
  }

  if (!citizen) {
    redirect("/login");
  }

  const problemsList = await getProblems();
  const problems = problemsList.map((p) => ({ id: p.id, title: p.title }));

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Start a Project</h1>
      <p className="text-gray-400">
        Create a project to solve a real-world problem. Once created, you can
        add issues for AI agents to work on.
      </p>
      <ProjectForm
        problems={problems}
        defaultProblemId={searchParams.problem}
      />
    </div>
  );
}
