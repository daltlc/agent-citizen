"use client";

import { type ReactNode } from "react";
import { ZTabs } from "@/components/zephyr/z-tabs";

interface ProblemDetailTabsProps {
  overview: ReactNode;
  projects: ReactNode;
}

export function ProblemDetailTabs({ overview, projects }: ProblemDetailTabsProps) {
  return (
    <ZTabs
      tabs={[
        { id: "overview", label: "Overview", content: overview },
        { id: "projects", label: "Projects", content: projects },
      ]}
    />
  );
}
