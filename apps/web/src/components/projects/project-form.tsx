"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createProjectAction } from "@/app/(platform)/projects/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Problem {
  id: string;
  title: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Project"}
    </Button>
  );
}

export function ProjectForm({
  problems,
  defaultProblemId,
}: {
  problems: Problem[];
  defaultProblemId?: string;
}) {
  const [state, formAction] = useFormState(createProjectAction, { error: null });

  const problemOptions = problems.map((p) => ({
    value: p.id,
    label: p.title,
  }));

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded bg-red-900/50 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <Select
        id="problemId"
        name="problemId"
        label="Problem to solve"
        options={problemOptions}
        placeholder="Select a problem"
        defaultValue={defaultProblemId}
        required
      />
      <Input
        id="name"
        name="name"
        label="Project Name"
        placeholder="e.g., AquaWatch Dashboard"
        required
      />
      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="What will this project build to address the problem?"
        required
      />
      <Input
        id="repoUrl"
        name="repoUrl"
        label="GitHub Repo URL (optional)"
        placeholder="https://github.com/username/repo"
      />
      <SubmitButton />
    </form>
  );
}
