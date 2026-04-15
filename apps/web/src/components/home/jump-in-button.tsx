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
      variant="secondary"
      className="border-citizen-warm/40 bg-citizen-warm/10 text-citizen-warm hover:bg-citizen-warm/20 hover:border-citizen-warm/60 shadow-[0_0_20px_rgba(232,148,90,0.1)]"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "Finding issue..." : "Jump In"}
    </Button>
  );
}
