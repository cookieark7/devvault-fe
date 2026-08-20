"use client";

import { Code2, Star } from "lucide-react";
import LanguageBadge from "./LanguageBadge";
import TagPill from "@/components/common/ui/TagPill";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Snippet } from "@/lib/types";

interface SnippetCardProps {
  snippet: Snippet;
  onClick: () => void;
  onFavorite: (id: string) => void;
  view: "grid" | "list";
}

export default function SnippetCard({
  snippet,
  onClick,
  onFavorite,
  view,
}: SnippetCardProps) {
  if (view === "list") {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-3 border-b border-border-base hover:bg-bg-hover transition-colors duration-100 cursor-pointer w-full"
      >
        <Code2
          size={14}
          strokeWidth={1.5}
          style={{ color: "var(--snippet)" }}
          className="flex-shrink-0"
        />
        <span className="text-sm text-text-primary flex-1 truncate">
          {snippet.title}
        </span>
        <LanguageBadge language={snippet.language} size="sm" />
        {(snippet.tags || []).slice(0, 2).map((tag) => (
          <TagPill key={tag.id} tag={tag} size="sm" />
        ))}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(snippet.id);
          }}
          className="flex-shrink-0"
        >
          <Star
            size={14}
            className={cn(
              snippet.isPinned
                ? "text-warning fill-warning"
                : "text-text-tertiary"
            )}
          />
        </button>
        <span className="text-xs text-text-tertiary whitespace-nowrap">
          {formatRelativeTime(new Date(snippet.createdAt))}
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
        <Code2
          size={16}
          strokeWidth={1.5}
          style={{ color: "var(--snippet)" }}
          className="flex-shrink-0"
        />
        <span className="text-sm font-medium text-text-primary flex-1 truncate">
          {snippet.title}
        </span>
        <LanguageBadge language={snippet.language} />
      </div>

      {/* Code preview */}
      <div className="bg-bg-subtle rounded p-3 mt-3 font-mono text-xs text-text-secondary line-clamp-4 whitespace-pre">
        {snippet.code}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 mt-3">
        {(snippet.tags || []).slice(0, 2).map((tag) => (
          <TagPill key={tag.id} tag={tag} size="sm" />
        ))}
        <div className="flex-1" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(snippet.id);
          }}
        >
          <Star
            size={14}
            className={cn(
              snippet.isPinned
                ? "text-warning fill-warning"
                : "text-text-tertiary"
            )}
          />
        </button>
        <span className="text-xs text-text-tertiary">
          {formatRelativeTime(new Date(snippet.createdAt))}
        </span>
      </div>
    </div>
  );
}
