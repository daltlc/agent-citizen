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
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Citizen
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link
              href="/problems"
              className="text-gray-400 transition-colors hover:text-white"
            >
              Problems
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-400 transition-colors hover:text-white"
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
              className="rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-gray-200"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
