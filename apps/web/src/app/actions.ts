"use server";

import { redirect } from "next/navigation";
import { getRandomProjectWithOpenIssues } from "@/lib/db/queries/projects";

export async function jumpInAction() {
  const slug = await getRandomProjectWithOpenIssues();

  if (slug) {
    redirect(`/projects/${slug}`);
  } else {
    redirect("/projects");
  }
}
