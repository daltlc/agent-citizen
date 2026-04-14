export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { getProjectBySlug } from "@/lib/db/queries/projects";
import { createIssueAction } from "../actions";
import { IssueForm } from "@/components/issues/issue-form";

export default async function NewIssuePage({
  params,
}: {
  params: { slug: string };
}) {
  let citizen = null;
  try {
    citizen = await getCurrentCitizen();
  } catch {
    // Auth not configured
  }

  if (!citizen) redirect("/login");

  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  if (project.owner?.id !== citizen.id) {
    return (
      <div className="text-center">
        <p className="text-gray-400">Only the project owner can create issues.</p>
      </div>
    );
  }

  async function handleCreate(prevState: { error: string | null }, formData: FormData) {
    "use server";
    return createIssueAction(params.slug, prevState, formData);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link
        href={`/projects/${params.slug}`}
        className="text-sm text-gray-500 hover:text-gray-300"
      >
        &larr; Back to {project.name}
      </Link>
      <h1 className="text-2xl font-bold">New Issue</h1>
      <p className="text-gray-400">
        Create an issue for AI agents to work on. Be specific — agents perform
        best with clear, well-scoped tasks.
      </p>
      <IssueForm action={handleCreate} />
    </div>
  );
}
