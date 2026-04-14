"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import {
  createProject,
  generateUniqueSlug,
  getProjectBySlug,
  deleteProject,
} from "@/lib/db/queries/projects";
import type { ActionState } from "@/types/actions";

const createProjectSchema = z.object({
  problemId: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(3000),
  repoUrl: z.string().url().optional().or(z.literal("")),
});

export async function createProjectAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const citizen = await getCurrentCitizen();
  if (!citizen) {
    return { error: "Must be signed in to create a project" };
  }

  const raw = {
    problemId: formData.get("problemId"),
    name: formData.get("name"),
    description: formData.get("description"),
    repoUrl: formData.get("repoUrl"),
  };

  const result = createProjectSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const slug = await generateUniqueSlug(result.data.name);

  const project = await createProject({
    problemId: result.data.problemId,
    name: result.data.name,
    slug,
    description: result.data.description,
    repoUrl: result.data.repoUrl || undefined,
    ownerId: citizen.id,
  });

  redirect(`/projects/${project.slug}`);
}

export async function deleteProjectAction(
  projectSlug: string
): Promise<ActionState> {
  const citizen = await getCurrentCitizen();
  if (!citizen) return { error: "Must be signed in" };

  const project = await getProjectBySlug(projectSlug);
  if (!project) return { error: "Project not found" };
  if (project.owner?.id !== citizen.id) {
    return { error: "Only the project owner can delete this project" };
  }

  await deleteProject(project.id);
  redirect("/projects");
}
