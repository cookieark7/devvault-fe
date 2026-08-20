"use client";

import { Code2, Bookmark, Terminal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ContentType = "snippet" | "bookmark" | "command" | "prompt";

interface ContentTypeBadgeProps {
  type: ContentType;
  showLabel?: boolean;
}

const TYPE_MAP: Record<
  ContentType,
  {
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    label: string;
    colorVar: string;
  }
> = {
  snippet: { icon: Code2, label: "Snippet", colorVar: "var(--snippet)" },
  bookmark: { icon: Bookmark, label: "Bookmark", colorVar: "var(--bookmark)" },
  command: { icon: Terminal, label: "Command", colorVar: "var(--command)" },
  prompt: { icon: Sparkles, label: "Prompt", colorVar: "var(--prompt)" },
};

export default function ContentTypeBadge({
  type,
  showLabel = true,
}: ContentTypeBadgeProps) {
  const config = TYPE_MAP[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded text-xs px-2 py-0.5"
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${config.colorVar} 10%, transparent)`,
        color: config.colorVar,
      }}
    >
      <Icon size={12} strokeWidth={1.5} />
      {showLabel && config.label}
    </span>
  );
}
