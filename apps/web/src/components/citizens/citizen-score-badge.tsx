interface CitizenScoreBadgeProps {
  score: number;
  size?: "sm" | "lg";
}

export function CitizenScoreBadge({
  score,
  size = "sm",
}: CitizenScoreBadgeProps) {
  const sizeClasses =
    size === "lg"
      ? "text-3xl font-bold px-4 py-2"
      : "text-sm font-medium px-2 py-0.5";

  return (
    <span
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 text-emerald-300 ${sizeClasses}`}
    >
      {score} pts
    </span>
  );
}
