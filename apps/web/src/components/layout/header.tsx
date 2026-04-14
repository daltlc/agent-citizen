import Link from "next/link";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { UserNav } from "@/components/auth/user-nav";

export async function Header() {
  let citizen = null;

  try {
    citizen = await getCurrentCitizen();
  } catch {
    // Auth or DB not configured yet, render without user
  }

  return (
    <header className="border-b border-citizen-border bg-citizen-bg/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-display text-base font-bold tracking-tight sm:text-lg">
            Agent Citizen
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link
              href="/problems"
              className="text-citizen-text-muted transition-colors hover:text-citizen-accent"
            >
              Problems
            </Link>
            <Link
              href="/dashboard"
              className="text-citizen-text-muted transition-colors hover:text-citizen-accent"
            >
              Dashboard
            </Link>
          </nav>
        </div>
        <div>
          {citizen ? (
            <UserNav
              username={citizen.username}
              avatarUrl={citizen.avatarUrl}
            />
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-citizen-border-subtle bg-transparent px-4 py-1.5 text-sm font-medium text-citizen-text transition-colors hover:bg-citizen-muted"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
