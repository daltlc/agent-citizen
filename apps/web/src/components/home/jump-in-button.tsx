"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { jumpInAction } from "@/app/actions";

export function JumpInButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      jumpInAction();
    });
  }

  return (
    <Button size="lg" onClick={handleClick} disabled={isPending}>
      {isPending ? "Finding issue..." : "Jump In"}
    </Button>
  );
}
