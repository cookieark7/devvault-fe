"use client";

import { useState } from "react";
import { Terminal, Pencil, Trash2, Star } from "lucide-react";
import TagPill from "@/components/common/ui/TagPill";
import CopyButton from "@/components/common/ui/CopyButton";
import Button from "@/components/common/ui/Button";
import { formatDate, formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Command } from "@/lib/types";

interface CommandDetailPanelProps {
  command: Command;
  onEdit: () => void;
  onDelete: () => void;
  onFavorite: (id: string) => void;
}

const PLATFORM_STYLES: Record<string, { label: string; color: string }> = {
  macos: { label: "macOS", color: "#6B7280" },
  linux: { label: "Linux", color: "#F97316" },
  windows: { label: "Windows", color: "#3B82F6" },
  "cross-platform": { label: "Cross-platform", color: "#10B981" },
};

export default function CommandDetailPanel({
  command,
  onEdit,
  onDelete,
  onFavorite,
}: CommandDetailPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const platform =
    PLATFORM_STYLES[command.platform] || PLATFORM_STYLES["cross-platform"];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Terminal
            size={22}
            strokeWidth={1.5}
            style={{ color: "var(--command)" }}
            className="flex-shrink-0"
          />
          <h1 className="text-xl font-semibold text-text-primary">
            {command.title}
          </h1>
          <span
            className="inline-flex items-center rounded-full text-[11px] font-medium px-2 py-0.5"
            style={{
              backgroundColor: `${platform.color}15`,
              color: platform.color,
            }}
          >
            {platform.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onFavorite(command.id)}
            className="p-1.5 rounded hover:bg-bg-hover transition-colors duration-100"
          >
            <Star
              size={16}
              className={cn(
                command.isPinned
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

      {/* THE COMMAND DISPLAY */}
      <div className="relative bg-bg-subtle border border-border-base rounded p-5 mt-4">
        <div className="flex items-center gap-2 pr-20">
          <span className="text-text-tertiary font-mono text-base select-none">
            $
          </span>
          <span className="font-mono text-base text-text-primary break-all">
            {command.command}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <CopyButton text={command.command} size="md" label="Copy" />
        </div>
      </div>

      {/* Meta row */}
      <div className="flex gap-4 items-center mt-6 mb-6 text-sm text-text-secondary">
        <span>Created: {formatDate(new Date(command.createdAt))}</span>
        <span>Updated: {formatRelativeTime(new Date(command.updatedAt))}</span>
      </div>

      {/* Tags */}
      {(command.tags || []).length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-6">
          {(command.tags || []).map((tag) => (
            <TagPill key={tag.id} tag={tag} size="sm" />
          ))}
        </div>
      )}

      {/* Description */}
      {command.description && (
        <div className="mt-6">
          <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
            Notes
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {command.description}
          </p>
        </div>
      )}
    </div>
  );
}
