"use client";

import { Terminal, Star } from "lucide-react";
import TagPill from "@/components/common/ui/TagPill";
import CopyButton from "@/components/common/ui/CopyButton";
import Badge from "@/components/common/ui/Badge";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Command } from "@/lib/types";

interface CommandCardProps {
  command: Command;
  onClick: () => void;
  onFavorite: (id: string) => void;
}

const PLATFORM_STYLES: Record<string, { label: string; color: string }> = {
  macos: { label: "macOS", color: "#6B7280" },
  linux: { label: "Linux", color: "#F97316" },
  windows: { label: "Windows", color: "#3B82F6" },
  "cross-platform": { label: "Cross-platform", color: "#10B981" },
};

export default function CommandCard({
  command,
  onClick,
  onFavorite,
}: CommandCardProps) {
  const platform = PLATFORM_STYLES[command.platform] || PLATFORM_STYLES["cross-platform"];

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 border-b border-border-base hover:bg-bg-hover transition-colors duration-100 cursor-pointer"
    >
      <Terminal
        size={14}
        strokeWidth={1.5}
        style={{ color: "var(--command)" }}
        className="flex-shrink-0"
      />
      <span className="text-sm text-text-primary font-medium flex-1 truncate min-w-0">
        {command.title}
      </span>

      {/* Command text */}
      <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
        <span className="bg-bg-subtle rounded px-2 py-0.5 font-mono text-xs max-w-[280px] truncate" style={{ color: "var(--command)" }}>
          {command.command}
        </span>
        <CopyButton text={command.command} size="sm" />
      </div>

      {/* Platform badge */}
      <span
        className="hidden md:inline-flex items-center rounded-full text-[10px] font-medium px-2 py-0.5 flex-shrink-0"
        style={{
          backgroundColor: `${platform.color}15`,
          color: platform.color,
        }}
      >
        {platform.label}
      </span>

      {/* Tags */}
      {(command.tags || []).slice(0, 1).map((tag) => (
        <TagPill key={tag.id} tag={tag} size="sm" />
      ))}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavorite(command.id);
        }}
        className="flex-shrink-0"
      >
        <Star
          size={14}
          className={cn(
            command.isPinned
              ? "text-warning fill-warning"
              : "text-text-tertiary"
          )}
        />
      </button>
      <span className="text-xs text-text-tertiary whitespace-nowrap">
        {formatRelativeTime(new Date(command.createdAt))}
      </span>
    </div>
  );
}
