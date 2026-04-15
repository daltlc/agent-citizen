export const SDG_CATEGORIES = [
  "clean_water",
  "food_security",
  "climate",
  "healthcare",
  "education",
  "civic_tech",
  "housing",
  "economic_access",
  "disaster_response",
  "open_data",
  "mental_health",
  "social_equity",
  "sustainability",
  "humanitarian",
] as const;

export type SDGCategory = (typeof SDG_CATEGORIES)[number];

export const SDG_CATEGORY_LABELS: Record<SDGCategory, string> = {
  clean_water: "Clean Water",
  food_security: "Food Security",
  climate: "Climate",
  healthcare: "Healthcare",
  education: "Education",
  civic_tech: "Civic Tech",
  housing: "Housing",
  economic_access: "Economic Access",
  disaster_response: "Disaster Response",
  open_data: "Open Data",
  mental_health: "Mental Health",
  social_equity: "Social Equity",
  sustainability: "Sustainability",
  humanitarian: "Humanitarian",
};

/** Each category gets a unique color pair: [bg/border inactive, bg/border active, text] */
export const SDG_CATEGORY_COLORS: Record<SDGCategory, { bg: string; text: string; activeBg: string; activeText: string }> = {
  clean_water:       { bg: "bg-cyan-900/40 border-cyan-700/50",      text: "text-cyan-300",    activeBg: "bg-cyan-500",       activeText: "text-white" },
  food_security:     { bg: "bg-amber-900/40 border-amber-700/50",    text: "text-amber-300",   activeBg: "bg-amber-500",      activeText: "text-black" },
  climate:           { bg: "bg-emerald-900/40 border-emerald-700/50", text: "text-emerald-300", activeBg: "bg-emerald-500",    activeText: "text-white" },
  healthcare:        { bg: "bg-rose-900/40 border-rose-700/50",      text: "text-rose-300",    activeBg: "bg-rose-500",       activeText: "text-white" },
  education:         { bg: "bg-violet-900/40 border-violet-700/50",  text: "text-violet-300",  activeBg: "bg-violet-500",     activeText: "text-white" },
  civic_tech:        { bg: "bg-blue-900/40 border-blue-700/50",      text: "text-blue-300",    activeBg: "bg-blue-500",       activeText: "text-white" },
  housing:           { bg: "bg-orange-900/40 border-orange-700/50",  text: "text-orange-300",  activeBg: "bg-orange-500",     activeText: "text-white" },
  economic_access:   { bg: "bg-yellow-900/40 border-yellow-700/50",  text: "text-yellow-300",  activeBg: "bg-yellow-500",     activeText: "text-black" },
  disaster_response: { bg: "bg-red-900/40 border-red-700/50",        text: "text-red-300",     activeBg: "bg-red-500",        activeText: "text-white" },
  open_data:         { bg: "bg-indigo-900/40 border-indigo-700/50",  text: "text-indigo-300",  activeBg: "bg-indigo-500",     activeText: "text-white" },
  mental_health:     { bg: "bg-purple-900/40 border-purple-700/50",  text: "text-purple-300",  activeBg: "bg-purple-500",     activeText: "text-white" },
  social_equity:     { bg: "bg-teal-900/40 border-teal-700/50",      text: "text-teal-300",    activeBg: "bg-teal-500",       activeText: "text-white" },
  sustainability:    { bg: "bg-lime-900/40 border-lime-700/50",      text: "text-lime-300",    activeBg: "bg-lime-500",       activeText: "text-black" },
  humanitarian:      { bg: "bg-sky-900/40 border-sky-700/50",        text: "text-sky-300",     activeBg: "bg-sky-500",        activeText: "text-white" },
};

export const ISSUE_STATUSES = [
  "open",
  "assigned",
  "in_progress",
  "in_review",
  "completed",
  "closed",
] as const;

export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const ISSUE_DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type IssueDifficulty = (typeof ISSUE_DIFFICULTIES)[number];

export const CONTRIBUTION_STATUSES = [
  "pending",
  "accepted",
  "rejected",
] as const;

export type ContributionStatus = (typeof CONTRIBUTION_STATUSES)[number];

export const APPLICATION_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const PROJECT_VISIBILITIES = ["public", "private"] as const;

export type ProjectVisibility = (typeof PROJECT_VISIBILITIES)[number];
