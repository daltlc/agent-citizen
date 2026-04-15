export const dynamic = "force-dynamic";

import Link from "next/link";
import { getProblems } from "@/lib/db/queries/problems";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { ProblemCard } from "@/components/problems/problem-card";
import { Button } from "@/components/ui/button";
import { SDG_CATEGORIES, SDG_CATEGORY_LABELS, SDG_CATEGORY_COLORS } from "@/types/enums";

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category;

  let citizen = null;
  try {
    citizen = await getCurrentCitizen();
  } catch {
    // Auth not configured
  }

  const problemsList = await getProblems(category);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Problems</h1>
        {citizen && (
          <Link href="/problems/new">
            <Button size="sm">New Problem</Button>
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/problems">
          <span
            className={`cursor-pointer select-none rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              !category
                ? "bg-white text-black border-white"
                : "bg-citizen-muted/60 text-citizen-sand border-citizen-border-subtle hover:bg-citizen-border-subtle"
            }`}
          >
            All
          </span>
        </Link>
        {SDG_CATEGORIES.map((cat) => {
          const colors = SDG_CATEGORY_COLORS[cat];
          const isActive = category === cat;
          return (
            <Link key={cat} href={`/problems?category=${cat}`}>
              <span
                className={`cursor-pointer select-none rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? `${colors.activeBg} ${colors.activeText} border-transparent`
                    : `${colors.bg} ${colors.text} hover:brightness-125`
                }`}
              >
                {SDG_CATEGORY_LABELS[cat]}
              </span>
            </Link>
          );
        })}
      </div>

      {problemsList.length === 0 ? (
        <p className="text-center text-citizen-text-dim">
          No problems yet. Be the first to identify one.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {problemsList.map((problem) => (
            <ProblemCard
              key={problem.id}
              id={problem.id}
              title={problem.title}
              description={problem.description}
              category={problem.category}
              repoUrl={problem.repoUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
