"use client";

import { useEffect, useState, type ReactNode } from "react";

interface AccordionItem {
  id: string;
  trigger: ReactNode;
  content: ReactNode;
}

interface ZAccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function ZAccordion({ items, className = "" }: ZAccordionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR fallback: render all content expanded
    return (
      <div className={className}>
        {items.map((item) => (
          <div key={item.id} className="border-b border-gray-800 py-3">
            <div className="font-medium text-gray-100">{item.trigger}</div>
            <div className="mt-2 text-sm text-gray-400">{item.content}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <z-accordion className={className}>
      {items.map((item) => (
        <z-accordion-item key={item.id}>
          <button slot="trigger" className="w-full text-left py-3 text-sm font-medium text-gray-100 hover:text-white transition-colors">
            {item.trigger}
          </button>
          <div slot="content" className="pb-4 text-sm text-gray-400">
            {item.content}
          </div>
        </z-accordion-item>
      ))}
    </z-accordion>
  );
}
