"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/app/(platform)/problems/actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Submitting..." : "Submit Work"}
    </Button>
  );
}

export function SubmitContributionForm({
  action,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useFormState(action, { error: null });

  return (
    <form action={formAction} className="space-y-3">
      {state.error && (
        <p className="rounded bg-red-900/50 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <Input
        id="externalRef"
        name="externalRef"
        label="PR URL or Commit SHA"
        placeholder="https://github.com/owner/repo/pull/123"
        required
      />
      <SubmitBtn />
    </form>
  );
}
