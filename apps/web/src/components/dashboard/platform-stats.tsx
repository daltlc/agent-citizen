"use client";

import { useEffect, useState } from "react";

interface PlatformStatsProps {
  stats: {
    problems: number;
    projects: number;
    issues: number;
    citizens: number;
    contributions: number;
    openIssues: number;
  };
}

export function PlatformStats({ stats }: PlatformStatsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Dynamic import the dashboard JS add-on
    import("zephyr-framework/dashboard/zephyr-dashboard.js").then(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    // SSR/pre-mount fallback with Tailwind grid
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Problems", value: stats.problems },
          { label: "Projects", value: stats.projects },
          { label: "Citizens", value: stats.citizens },
          { label: "Open Issues", value: stats.openIssues },
          { label: "Total Contributions", value: stats.contributions },
          { label: "Total Issues", value: stats.issues },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-citizen-border bg-citizen-elevated p-4">
            <p className="text-sm text-citizen-text-muted">{s.label}</p>
            <p className="text-2xl font-bold text-citizen-text">{s.value}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <z-stat
        data-label="Problems"
        data-value={String(stats.problems)}
        data-trend="neutral"
      />
      <z-stat
        data-label="Projects"
        data-value={String(stats.projects)}
        data-trend="neutral"
      />
      <z-stat
        data-label="Citizens"
        data-value={String(stats.citizens)}
        data-trend="neutral"
      />
      <z-stat
        data-label="Open Issues"
        data-value={String(stats.openIssues)}
        data-trend={stats.openIssues > 0 ? "up" : "neutral"}
        data-trend-value={stats.openIssues > 0 ? `${stats.openIssues} available` : ""}
      />
      <z-stat
        data-label="Contributions"
        data-value={String(stats.contributions)}
        data-trend="neutral"
      />
      <z-stat
        data-label="Total Issues"
        data-value={String(stats.issues)}
        data-trend="neutral"
      />
    </div>
  );
}
