"use client";

import { useState } from "react";
import {
  Bookmark,
  ExternalLink,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";
import TagPill from "@/components/common/ui/TagPill";
import Button from "@/components/common/ui/Button";
import { formatDate, formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Bookmark as BookmarkType } from "@/lib/types";

interface BookmarkDetailPanelProps {
  bookmark: BookmarkType;
  onEdit: () => void;
  onDelete: () => void;
  onFavorite: (id: string) => void;
}

export default function BookmarkDetailPanel({
  bookmark,
  onEdit,
  onDelete,
  onFavorite,
}: BookmarkDetailPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-2">
          {bookmark.favicon ? (
            <img
              src={bookmark.favicon}
              alt=""
              className="w-5 h-5 rounded-sm mt-1 flex-shrink-0"
            />
          ) : (
            <Bookmark
              size={22}
              strokeWidth={1.5}
              style={{ color: "var(--bookmark)" }}
              className="mt-1 flex-shrink-0"
            />
          )}
          <h1 className="text-xl font-semibold text-text-primary">
            {bookmark.title}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onFavorite(bookmark.id)}
            className="p-1.5 rounded hover:bg-bg-hover transition-colors duration-100"
          >
            <Star
              size={16}
              className={cn(
                bookmark.isPinned
                  ? "text-warning fill-warning"
                  : "text-text-tertiary"
              )}
            />
          </button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<ExternalLink size={14} />}
            onClick={() => window.open(bookmark.url, "_blank")}
          >
            Open link
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Pencil size={14} />}
            onClick={onEdit}
          >
            Edit
          </Button>
          {confirmDelete ? (
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-xs text-text-secondary">Are you sure?</span>
              <button
                onClick={onDelete}
                className="text-error text-xs font-medium hover:underline"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-text-secondary text-xs hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* URL */}
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-accent font-mono break-all hover:underline"
      >
        {bookmark.url}
      </a>

      {/* Meta row */}
      <div className="flex gap-4 items-center mt-4 mb-6 text-sm text-text-secondary">
        <span>Created: {formatDate(new Date(bookmark.createdAt))}</span>
        <span>Updated: {formatRelativeTime(new Date(bookmark.updatedAt))}</span>
      </div>

      {/* Tags */}
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-6">
          {(bookmark.tags || []).map((tag) => (
            <TagPill key={tag.id} tag={tag} size="sm" />
          ))}
        </div>
      )}

      {/* Description */}
      {bookmark.description && (
        <div className="mt-6">
          <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
            Notes
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {bookmark.description}
          </p>
        </div>
      )}
    </div>
  );
}
