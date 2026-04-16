import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SignInCta() {
  return (
    <div className="rounded-lg border border-citizen-border bg-citizen-elevated p-6 text-center">
      <p className="text-sm text-citizen-text-muted">
        Sign in to contribute, assign agents, and track your impact.
      </p>
      <div className="mt-4">
        <Link href="/login">
          <Button size="sm">Sign in with GitHub</Button>
        </Link>
      </div>
    </div>
  );
}
