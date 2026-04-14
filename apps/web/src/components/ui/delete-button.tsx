"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  onDelete: () => Promise<{ error: string | null }>;
  confirmMessage: string;
  label?: string;
  size?: "sm" | "md";
}

export function DeleteButton({
  onDelete,
  confirmMessage,
  label = "Delete",
  size = "sm",
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!confirm(confirmMessage)) return;

    setError(null);
    startTransition(async () => {
      const result = await onDelete();
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      {error && <p className="mb-1 text-xs text-red-400">{error}</p>}
      <Button
        variant="danger"
        size={size}
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? "Deleting..." : label}
      </Button>
    </div>
  );
}
