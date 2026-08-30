"use client";

import { Sparkles, Star } from "lucide-react";
import TagPill from "@/components/common/ui/TagPill";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Prompt } from "@/lib/types";

interface PromptCardProps {
  prompt: Prompt;
  onClick: () => void;
  onFavorite: (id: string) => void;
  view: "grid" | "list";
}

export default function PromptCard({
  prompt,
  onClick,
  onFavorite,
  view,
}: PromptCardProps) {
  if (view === "list") {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-3 border-b border-border-base hover:bg-bg-hover transition-colors duration-100 cursor-pointer w-full"
      >
        <Sparkles
          size={14}
          strokeWidth={1.5}
          style={{ color: "var(--prompt)" }}
          className="flex-shrink-0"
        />
        <span className="text-sm text-text-primary font-medium flex-1 truncate">
          {prompt.title}
        </span>
        <span className="hidden sm:inline-flex items-center rounded-full text-[10px] font-mono px-2 py-0.5 flex-shrink-0 bg-[var(--prompt)]/10 text-[var(--prompt)] border border-[var(--prompt)]/20">
          {prompt.model}
        </span>
        <span className="text-xs text-text-secondary line-clamp-1 max-w-[200px] hidden md:block">
          {prompt.content.slice(0, 60)}
        </span>
        {(prompt.tags ?? []).slice(0, 1).map((tag) => (
          <TagPill key={tag.id} tag={tag} size="sm" />
        ))}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(prompt.id);
          }}
          className="flex-shrink-0"
        >
          <Star
            size={14}
            className={cn(
              prompt.isPinned
                ? "text-warning fill-warning"
                : "text-text-tertiary"
            )}
          />
        </button>
        <span className="text-xs text-text-tertiary whitespace-nowrap">
          {formatRelativeTime(new Date(prompt.createdAt))}
        </span>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={onClick}
      className="border border-border-base rounded p-4 bg-bg-main hover:shadow-notion-card transition-all duration-100 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles
          size={16}
          strokeWidth={1.5}
          style={{ color: "var(--prompt)" }}
          className="flex-shrink-0"
        />
        <span className="text-sm font-medium text-text-primary flex-1 truncate">
          {prompt.title}
        </span>
        <span className="inline-flex items-center rounded-full text-[10px] font-mono px-2 py-0.5 flex-shrink-0" style={{ backgroundColor: "rgba(139, 92, 246, 0.1)", color: "var(--prompt)", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
          {prompt.model}
        </span>
      </div>

      {/* Content preview */}
      <div className="bg-bg-subtle rounded p-3 mt-3 text-sm text-text-secondary line-clamp-3">
        {prompt.content.slice(0, 150)}
      </div>

      {/* Use case */}
      {prompt.useCase && (
        <p className="text-xs text-text-tertiary italic mt-2">
          {prompt.useCase}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-1.5 mt-3">
        {(prompt.tags ?? []).slice(0, 2).map((tag) => (
          <TagPill key={tag.id} tag={tag} size="sm" />
        ))}
        <div className="flex-1" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(prompt.id);
          }}
        >
          <Star
            size={14}
            className={cn(
              prompt.isPinned
                ? "text-warning fill-warning"
                : "text-text-tertiary"
            )}
          />
        </button>
        <span className="text-xs text-text-tertiary">
          {formatRelativeTime(new Date(prompt.createdAt))}
        </span>
      </div>
    </div>
  );
}
