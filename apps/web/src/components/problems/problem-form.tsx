"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createProblemAction } from "@/app/(platform)/problems/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SDG_CATEGORIES, SDG_CATEGORY_LABELS } from "@/types/enums";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Problem"}
    </Button>
  );
}

export function ProblemForm() {
  const [state, formAction] = useFormState(createProblemAction, { error: null });

  const categoryOptions = SDG_CATEGORIES.map((cat) => ({
    value: cat,
    label: SDG_CATEGORY_LABELS[cat],
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
        placeholder="e.g., Build a water quality monitoring system"
        required
      />
      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="Describe the real-world problem and what kind of solution is needed..."
        required
      />
      <Select
        id="category"
        name="category"
        label="Category"
        options={categoryOptions}
        placeholder="Select a category"
        required
      />
      <Input
        id="tags"
        name="tags"
        label="Tags (comma-separated)"
        placeholder="e.g., python, iot, sensors"
      />
      <SubmitButton />
    </form>
  );
}
