"use client";

import { type ReactNode } from "react";
import { ZTabs } from "@/components/zephyr/z-tabs";

interface ProjectDetailTabsProps {
  overview: ReactNode;
  issues: ReactNode;
}

export function ProjectDetailTabs({ overview, issues }: ProjectDetailTabsProps) {
  return (
    <ZTabs
      tabs={[
        { id: "overview", label: "Overview", content: overview },
        { id: "issues", label: "Issues", content: issues },
      ]}
    />
  );
}
