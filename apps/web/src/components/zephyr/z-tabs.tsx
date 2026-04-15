"use client";

import { useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

type ZTabsVariant = "underline" | "pill";

interface ZTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  variant?: ZTabsVariant;
}

const listStyles: Record<ZTabsVariant, string> = {
  underline: "flex gap-1 border-b border-gray-800 mb-6",
  pill: "flex gap-2 justify-center mb-8",
};

const tabStyles: Record<ZTabsVariant, { active: string; inactive: string }> = {
  underline: {
    active: "text-white border-b-2 border-white -mb-px",
    inactive: "text-citizen-text-dim hover:text-gray-200",
  },
  pill: {
    active:
      "rounded-full border border-citizen-accent/40 bg-citizen-accent/10 text-citizen-accent",
    inactive:
      "rounded-full border border-citizen-border bg-citizen-elevated text-citizen-text-dim hover:text-citizen-text",
  },
};

export function ZTabs({ tabs, defaultTab, className = "", variant = "underline" }: ZTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);

  return (
    <div className={className}>
      <div role="tablist" className={listStyles[variant]}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? tabStyles[variant].active
                : tabStyles[variant].inactive
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          hidden={activeTab !== tab.id}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
