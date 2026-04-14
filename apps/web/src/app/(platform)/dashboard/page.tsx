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
        <p className="mt-1 text-sm text-gray-400">
          Overview of the Citizen platform
        </p>
      </div>

      <PlatformStats stats={stats} />

      <div className="border-t border-gray-800 pt-6">
        <h2 className="mb-4 text-lg font-semibold">Top Citizens</h2>
        {topCitizens.length === 0 ? (
          <p className="text-sm text-gray-500">No citizens yet.</p>
        ) : (
          <div className="space-y-2">
            {topCitizens.map((citizen, idx) => (
              <Link
                key={citizen.id}
                href={`/u/${citizen.username}`}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 transition-colors hover:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-gray-300">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-100">
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
