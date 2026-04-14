"use client";

import { useEffect, useState, type ReactNode } from "react";

interface ZDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ZDropdown({ trigger, children, className = "" }: ZDropdownProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <z-dropdown className={className}>
      <div slot="trigger">{trigger}</div>
      <div slot="content" className="rounded-lg border border-gray-700 bg-gray-900 py-1 shadow-lg min-w-[180px]">
        {children}
      </div>
    </z-dropdown>
  );
}
