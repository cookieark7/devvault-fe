"use client";

import { Bookmark, ExternalLink, Star } from "lucide-react";
import TagPill from "@/components/common/ui/TagPill";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Bookmark as BookmarkType } from "@/lib/types";

interface BookmarkCardProps {
  bookmark: BookmarkType;
  onClick: () => void;
  onFavorite: (id: string) => void;
  view: "grid" | "list";
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default function BookmarkCard({
  bookmark,
  onClick,
  onFavorite,
  view,
}: BookmarkCardProps) {
  if (view === "list") {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-3 border-b border-border-base hover:bg-bg-hover transition-colors duration-100 cursor-pointer w-full"
      >
        {bookmark.favicon ? (
          <img
            src={bookmark.favicon}
            alt=""
            className="w-4 h-4 rounded-sm flex-shrink-0"
          />
        ) : (
          <Bookmark
            size={14}
            strokeWidth={1.5}
            style={{ color: "var(--bookmark)" }}
            className="flex-shrink-0"
          />
        )}
        <span className="text-sm text-text-primary flex-1 truncate">
          {bookmark.title}
        </span>
        <span className="text-xs text-text-tertiary font-mono hidden sm:block">
          {getDomain(bookmark.url)}
        </span>
        {(bookmark.tags || []).slice(0, 1).map((tag) => (
          <TagPill key={tag.id} tag={tag} size="sm" />
        ))}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(bookmark.id);
          }}
          className="flex-shrink-0"
        >
          <Star
            size={14}
            className={cn(
              bookmark.isPinned
                ? "text-warning fill-warning"
                : "text-text-tertiary"
            )}
          />
        </button>
        <span className="text-xs text-text-tertiary whitespace-nowrap">
          {formatRelativeTime(new Date(bookmark.createdAt))}
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
        {bookmark.favicon ? (
          <img
            src={bookmark.favicon}
            alt=""
            className="w-4 h-4 rounded-sm flex-shrink-0"
          />
        ) : (
          <Bookmark
            size={16}
            strokeWidth={1.5}
            style={{ color: "var(--bookmark)" }}
            className="flex-shrink-0"
          />
        )}
        <span className="text-sm font-medium text-text-primary flex-1 truncate">
          {bookmark.title}
        </span>
        <ExternalLink size={12} className="text-text-tertiary flex-shrink-0" />
      </div>

      {/* URL */}
      <p className="text-xs text-accent font-mono truncate mt-2">
        {getDomain(bookmark.url)}
      </p>

      {/* Description */}
      {bookmark.description && (
        <p className="text-sm text-text-secondary line-clamp-2 mt-2">
          {bookmark.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-1.5 mt-3">
        {(bookmark.tags || []).slice(0, 2).map((tag) => (
          <TagPill key={tag.id} tag={tag} size="sm" />
        ))}
        <div className="flex-1" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(bookmark.id);
          }}
        >
          <Star
            size={14}
            className={cn(
              bookmark.isPinned
                ? "text-warning fill-warning"
                : "text-text-tertiary"
            )}
          />
        </button>
        <span className="text-xs text-text-tertiary">
          {formatRelativeTime(new Date(bookmark.createdAt))}
        </span>
      </div>
    </div>
  );
}
