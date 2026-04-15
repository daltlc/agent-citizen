"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { createProblem } from "@/lib/db/queries/problems";
import { parseRepoUrl, verifyRepoExists } from "@/lib/github/validate-repo";
import { rateLimitAction } from "@/lib/rate-limit";
import { SDG_CATEGORIES } from "@/types/enums";
import type { ActionState } from "@/types/actions";

const createProblemSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  category: z.enum(SDG_CATEGORIES),
  repoUrl: z
    .string()
    .url("Must be a valid URL")
    .refine((url) => parseRepoUrl(url) !== null, {
      message:
        "Must be a valid GitHub repository URL (https://github.com/owner/repo)",
    }),
  tags: z.string().optional(),
});

export async function createProblemAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const citizen = await getCurrentCitizen();
  if (!citizen) {
    return { error: "Must be signed in to create a problem" };
  }

  const limited = await rateLimitAction(citizen.id);
  if (limited) return { error: limited };

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    repoUrl: formData.get("repoUrl"),
    tags: formData.get("tags"),
  };

  const result = createProblemSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const repoParts = parseRepoUrl(result.data.repoUrl);
  if (repoParts) {
    const exists = await verifyRepoExists(repoParts.owner, repoParts.repo);
    if (!exists) {
      return { error: "GitHub repository not found. Please check the URL." };
    }
  }

  const tags = result.data.tags
    ? result.data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const problem = await createProblem({
    title: result.data.title,
    description: result.data.description,
    category: result.data.category,
    repoUrl: result.data.repoUrl,
    tags,
    createdBy: citizen.id,
  });

  redirect(`/problems/${problem.id}`);
}
