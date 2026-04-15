import { Children, HTMLAttributes, isValidElement, type ReactNode } from "react";
import { SDG_CATEGORY_COLORS, type SDGCategory } from "@/types/enums";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-citizen-muted text-citizen-text-muted",
  success: "bg-green-900/50 text-green-400 border-green-800",
  warning: "bg-yellow-900/50 text-yellow-400 border-yellow-800",
  danger: "bg-red-900/50 text-red-400 border-red-800",
  info: "bg-blue-900/50 text-blue-400 border-blue-800",
};

/** Deterministic color for arbitrary string tags (tech, tools, etc.) */
const TAG_PALETTE = [
  "bg-sky-900/40 border-sky-700/50 text-sky-300",
  "bg-teal-900/40 border-teal-700/50 text-teal-300",
  "bg-pink-900/40 border-pink-700/50 text-pink-300",
  "bg-lime-900/40 border-lime-700/50 text-lime-300",
  "bg-fuchsia-900/40 border-fuchsia-700/50 text-fuchsia-300",
  "bg-cyan-900/40 border-cyan-700/50 text-cyan-300",
  "bg-amber-900/40 border-amber-700/50 text-amber-300",
  "bg-violet-900/40 border-violet-700/50 text-violet-300",
  "bg-rose-900/40 border-rose-700/50 text-rose-300",
  "bg-emerald-900/40 border-emerald-700/50 text-emerald-300",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Pass an SDG category key to auto-color the badge */
  category?: string;
  /** Pass a tag string to get a deterministic color */
  tag?: string;
}

/** Title-case a string: "typescript" → "Typescript", "react native" → "React Native" */
function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Recursively title-case string children */
function titleCaseChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") return titleCase(child);
    if (isValidElement(child)) return child;
    return child;
  });
}

export function Badge({ className = "", variant = "default", category, tag, children, ...props }: BadgeProps) {
  let styles = variantStyles[variant];

  if (category && category in SDG_CATEGORY_COLORS) {
    const colors = SDG_CATEGORY_COLORS[category as SDGCategory];
    styles = `${colors.bg} ${colors.text}`;
  } else if (tag) {
    styles = TAG_PALETTE[hashString(tag) % TAG_PALETTE.length];
  }

  // Auto title-case badge text (difficulty labels, statuses, tags, etc.)
  const content = titleCaseChildren(children);

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border border-transparent px-2 py-0.5 text-xs font-medium ${styles} ${className}`}
      {...props}
    >
      {content}
    </span>
  );
}
