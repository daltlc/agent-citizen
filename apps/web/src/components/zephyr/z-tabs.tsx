"use client";

import { useEffect, useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface ZTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ZTabs({ tabs, defaultTab, className = "" }: ZTabsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR fallback: render all content stacked
    return (
      <div className={className}>
        {tabs.map((tab) => (
          <div key={tab.id}>{tab.content}</div>
        ))}
      </div>
    );
  }

  return (
    <z-tabs className={className}>
      <div role="tablist" className="flex gap-1 border-b border-gray-800 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            data-tab={tab.id}
            className="px-4 py-2 text-sm font-medium transition-colors hover:text-gray-200"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} role="tabpanel" data-tab-panel={tab.id}>
          {tab.content}
        </div>
      ))}
    </z-tabs>
  );
}
