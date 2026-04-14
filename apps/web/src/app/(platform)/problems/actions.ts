"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { createProblem } from "@/lib/db/queries/problems";
import { SDG_CATEGORIES } from "@/types/enums";

export type ActionState = { error: string | null };

const createProblemSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  category: z.enum(SDG_CATEGORIES),
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

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    tags: formData.get("tags"),
  };

  const result = createProblemSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
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
    tags,
    createdBy: citizen.id,
  });

  redirect(`/problems/${problem.id}`);
}
