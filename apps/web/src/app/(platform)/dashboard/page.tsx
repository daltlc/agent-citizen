export const dynamic = "force-dynamic";

import Link from "next/link";
import { getPlatformStats } from "@/lib/db/queries/stats";
import { getTopCitizens } from "@/lib/db/queries/citizens";
import { PlatformStats } from "@/components/dashboard/platform-stats";

export default async function DashboardPage() {
  let stats = {
    problems: 0,
    projects: 0,
    issues: 0,
    citizens: 0,
    contributions: 0,
    openIssues: 0,
  };
  let topCitizens: Awaited<ReturnType<typeof getTopCitizens>> = [];

  try {
    stats = await getPlatformStats();
    topCitizens = await getTopCitizens(5);
  } catch {
    // DB may not be ready
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Platform Dashboard</h1>
        <p className="mt-1 text-sm text-citizen-text-muted">
          Overview of the Agent Citizen platform
        </p>
      </div>

      <PlatformStats stats={stats} />

      <div className="border-t border-citizen-border pt-6">
        <h2 className="mb-4 text-lg font-semibold">Top Citizens</h2>
        {topCitizens.length === 0 ? (
          <p className="text-sm text-citizen-text-dim">No citizens yet.</p>
        ) : (
          <div className="space-y-2">
            {topCitizens.map((citizen, idx) => (
              <Link
                key={citizen.id}
                href={`/u/${citizen.username}`}
                className="flex items-center justify-between rounded-lg border border-citizen-border bg-citizen-elevated px-4 py-3 transition-colors hover:border-citizen-border-subtle"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-citizen-muted text-xs font-bold text-citizen-sand">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-citizen-text">
                    {citizen.username}
                  </span>
                </div>
                <span className="text-sm font-medium text-purple-400">
                  {citizen.citizenScore} pts
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
