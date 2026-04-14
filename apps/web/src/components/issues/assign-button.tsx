"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { AgentActions } from "@/components/issues/agent-actions";
import type { ActionState } from "@/app/(platform)/problems/actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Assigning..." : "Work on this"}
    </Button>
  );
}

interface AssignButtonProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  issueId: string;
  issueTitle: string;
  issueDescription: string;
  projectName: string;
  projectSlug: string;
  repoUrl: string | null;
}

export function AssignButton({
  action,
  issueId,
  issueTitle,
  issueDescription,
  projectName,
  projectSlug,
  repoUrl,
}: AssignButtonProps) {
  const [state, formAction] = useFormState(action, { error: null });
  const [assigned, setAssigned] = useState(false);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (hasSubmitted.current && state.error === null) {
      setAssigned(true);
    }
  }, [state]);

  if (assigned) {
    return (
      <AgentActions
        issueId={issueId}
        issueTitle={issueTitle}
        issueDescription={issueDescription}
        projectName={projectName}
        projectSlug={projectSlug}
        repoUrl={repoUrl}
      />
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={() => { hasSubmitted.current = true; }}
      className="space-y-2"
    >
      {state.error && (
        <p className="rounded bg-red-900/50 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <SubmitBtn />
    </form>
  );
}
