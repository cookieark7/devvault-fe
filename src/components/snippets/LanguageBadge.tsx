import { cn } from "@/lib/utils/cn";
import { getLanguageLabel } from "@/lib/utils/format";

interface LanguageBadgeProps {
  language: string;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "px-1.5 py-0.5 text-[11px]",
  md: "px-2 py-1 text-xs",
};

export default function LanguageBadge({
  language,
  size = "sm",
}: LanguageBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded font-mono",
        "bg-bg-subtle text-text-secondary border border-border-base",
        sizeClasses[size]
      )}
    >
      {getLanguageLabel(language)}
    </span>
  );
}
