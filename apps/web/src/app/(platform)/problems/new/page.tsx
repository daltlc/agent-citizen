export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { ProblemForm } from "@/components/problems/problem-form";

export default async function NewProblemPage() {
  let citizen = null;

  try {
    citizen = await getCurrentCitizen();
  } catch {
    // Auth not configured
  }

  if (!citizen) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Identify a Problem</h1>
      <p className="text-gray-400">
        Describe a real-world problem that could be solved with code. Others can
        create projects and assign their AI agents to work on it.
      </p>
      <ProblemForm />
    </div>
  );
}
