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
    <Button
      size="lg"
      className="bg-citizen-warm text-citizen-deep hover:brightness-110 shadow-[0_0_20px_rgba(232,148,90,0.15)]"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "Finding issue..." : "Jump In"}
    </Button>
  );
}
