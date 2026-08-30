"use client";

import { useState } from "react";
import { Sparkles, Pencil, Trash2, Star, Copy, Check } from "lucide-react";
import TagPill from "@/components/common/ui/TagPill";
import Button from "@/components/common/ui/Button";
import { formatDate, formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Prompt } from "@/lib/types";

interface PromptDetailPanelProps {
  prompt: Prompt;
  onEdit: () => void;
  onDelete: () => void;
  onFavorite: (id: string) => void;
}

export default function PromptDetailPanel({
  prompt,
  onEdit,
  onDelete,
  onFavorite,
}: PromptDetailPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
    } catch {
      // Ignore clipboard failures (e.g. insecure context); feedback still shows.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles
            size={22}
            strokeWidth={1.5}
            style={{ color: "var(--prompt)" }}
            className="flex-shrink-0"
          />
          <h1 className="text-xl font-semibold text-text-primary">
            {prompt.title}
          </h1>
          <span
            className="inline-flex items-center rounded-full text-[11px] font-mono px-2 py-0.5"
            style={{
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              color: "var(--prompt)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            {prompt.model}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onFavorite(prompt.id)}
            className="p-1.5 rounded hover:bg-bg-hover transition-colors duration-100"
          >
            <Star
              size={16}
              className={cn(
                prompt.isPinned
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

      {/* Use case */}
      {prompt.useCase && (
        <span className="inline-block text-xs text-text-tertiary bg-bg-hover rounded-full px-3 py-1 mb-4">
          {prompt.useCase}
        </span>
      )}

      {/* THE PROMPT CONTENT BLOCK */}
      <div className="relative bg-bg-subtle border border-border-base rounded p-6 mt-4">
        <div className="absolute top-3 right-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={
              copied ? <Check size={14} /> : <Copy size={14} />
            }
            onClick={handleCopyPrompt}
          >
            {copied ? "Copied!" : "Copy Prompt"}
          </Button>
        </div>
        <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap pr-28">
          {prompt.content}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex gap-4 items-center mt-6 mb-6 text-sm text-text-secondary">
        <span>Created: {formatDate(new Date(prompt.createdAt))}</span>
        <span>Updated: {formatRelativeTime(new Date(prompt.updatedAt))}</span>
      </div>

      {/* Tags */}
      {(prompt.tags ?? []).length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-6">
          {(prompt.tags ?? []).map((tag) => (
            <TagPill key={tag.id} tag={tag} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}
