"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ISSUE_DIFFICULTIES } from "@/types/enums";
import type { ActionState } from "@/types/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Issue"}
    </Button>
  );
}

export function IssueForm({
  action,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useFormState(action, { error: null });

  const difficultyOptions = ISSUE_DIFFICULTIES.map((d) => ({
    value: d,
    label: d.charAt(0).toUpperCase() + d.slice(1),
  }));

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded bg-red-900/50 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <Input
        id="title"
        name="title"
        label="Title"
        placeholder="e.g., Add water quality data ingestion endpoint"
        required
      />
      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="Describe what needs to be done. Be specific enough for an AI agent to work on it."
        required
      />
      <Input
        id="githubIssueNumber"
        name="githubIssueNumber"
        label="GitHub Issue Number (optional)"
        placeholder="e.g., 7176"
        type="number"
        min={1}
      />
      <Select
        id="difficulty"
        name="difficulty"
        label="Difficulty"
        options={difficultyOptions}
        placeholder="Select difficulty"
        required
      />
      <SubmitButton />
    </form>
  );
}
