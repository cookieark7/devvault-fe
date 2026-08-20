"use client";

import { useState } from "react";
import { Code2, Pencil, Trash2, Star } from "lucide-react";
import CodeBlock from "./CodeBlock";
import LanguageBadge from "./LanguageBadge";
import TagPill from "@/components/common/ui/TagPill";
import Button from "@/components/common/ui/Button";
import { formatDate, formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Snippet } from "@/lib/types";

interface SnippetDetailPanelProps {
  snippet: Snippet;
  onEdit: () => void;
  onDelete: () => void;
  onFavorite: (id: string) => void;
}

export default function SnippetDetailPanel({
  snippet,
  onEdit,
  onDelete,
  onFavorite,
}: SnippetDetailPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-2">
          <Code2
            size={22}
            strokeWidth={1.5}
            style={{ color: "var(--snippet)" }}
            className="mt-1 flex-shrink-0"
          />
          <h1 className="text-xl font-semibold text-text-primary">
            {snippet.title}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onFavorite(snippet.id)}
            className="p-1.5 rounded hover:bg-bg-hover transition-colors duration-100"
          >
            <Star
              size={16}
              className={cn(
                snippet.isPinned
                  ? "text-warning fill-warning"
                  : "text-text-tertiary"
              )}
            />
          </button>
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

      {/* Meta row */}
      <div className="flex gap-4 items-center mb-6 text-sm text-text-secondary flex-wrap">
        <LanguageBadge language={snippet.language} size="md" />
        <span>Created: {formatDate(new Date(snippet.createdAt))}</span>
        <span>Updated: {formatRelativeTime(new Date(snippet.updatedAt))}</span>
      </div>

      {/* Tags */}
      {snippet.tags && snippet.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-6">
          {(snippet.tags || []).map((tag) => (
            <TagPill key={tag.id} tag={tag} size="sm" />
          ))}
        </div>
      )}

      {/* Code block */}
      <CodeBlock
        code={snippet.code}
        language={snippet.language}
        showLineNumbers={true}
      />

      {/* Description */}
      {snippet.description && (
        <div className="mt-6">
          <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
            Notes
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {snippet.description}
          </p>
        </div>
      )}
    </div>
  );
}
