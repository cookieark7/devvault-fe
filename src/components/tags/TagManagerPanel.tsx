"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Tag } from "@/lib/types";

const PRESET_COLORS = [
  "#F59E0B",
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F97316",
  "#6366F1",
];

interface TagManagerPanelProps {
  tags: Tag[];
  onCreateTag: (name: string, color: string) => Promise<void>;
  onUpdateTag: (id: string, name: string, color: string) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
}

export default function TagManagerPanel({
  tags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: TagManagerPanelProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await onCreateTag(newName.trim(), newColor);
    setNewName("");
    setNewColor(PRESET_COLORS[0]);
    setIsCreating(false);
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditColor(tag.color || PRESET_COLORS[0]);
  };

  const handleUpdate = async () => {
    if (!editingId || !editName.trim()) return;
    await onUpdateTag(editingId, editName.trim(), editColor);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await onDeleteTag(id);
    setDeletingId(null);
  };

  const getCountLabel = (tag: Tag) => {
    if (!(tag as any)._count) return null;
    const _count = (tag as any)._count;
    const parts: string[] = [];
    if (_count.snippets > 0)
      parts.push(`${_count.snippets} snippet${_count.snippets !== 1 ? "s" : ""}`);
    if (_count.bookmarks > 0)
      parts.push(`${_count.bookmarks} bookmark${_count.bookmarks !== 1 ? "s" : ""}`);
    if (_count.commands > 0)
      parts.push(`${_count.commands} command${_count.commands !== 1 ? "s" : ""}`);
    if (_count.prompts > 0)
      parts.push(`${_count.prompts} prompt${_count.prompts !== 1 ? "s" : ""}`);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  return (
    <div>
      {/* New tag button / form */}
      {isCreating ? (
        <div className="flex items-center gap-2 p-3 border border-border-base rounded mb-3 bg-bg-subtle">
          <input
            autoFocus
            type="text"
            placeholder="Tag name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="flex-1 text-sm text-text-primary bg-transparent outline-none placeholder:text-text-tertiary"
          />
          <div className="flex gap-1">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setNewColor(color)}
                className={cn(
                  "w-5 h-5 rounded-full border-2 transition-all duration-100",
                  newColor === color
                    ? "border-text-primary scale-110"
                    : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={handleCreate}
            className="text-accent hover:text-accent-hover p-1"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="text-text-tertiary hover:text-text-primary p-1"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded px-2.5 py-1.5 transition-colors duration-100 mb-3"
        >
          <Plus size={14} />
          New tag
        </button>
      )}

      {/* Tag list */}
      {tags.length === 0 ? (
        <p className="text-sm text-text-tertiary py-8 text-center">
          No tags yet. Create one to get started.
        </p>
      ) : (
        <div className="border border-border-base rounded divide-y divide-border-base">
          {tags.map((tag) => {
            const isEditing = editingId === tag.id;
            const isDeleting = deletingId === tag.id;
            const countLabel = getCountLabel(tag);

            if (isEditing) {
              return (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 px-4 py-3 bg-bg-subtle"
                >
                  <input
                    autoFocus
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                    className="flex-1 text-sm text-text-primary bg-transparent outline-none"
                  />
                  <div className="flex gap-1">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={cn(
                          "w-4 h-4 rounded-full border-2 transition-all duration-100",
                          editColor === color
                            ? "border-text-primary scale-110"
                            : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleUpdate}
                    className="text-accent hover:text-accent-hover p-1"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-text-tertiary hover:text-text-primary p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={tag.id}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors duration-100"
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color || "#737373" }}
                />
                <span className="text-sm text-text-primary font-medium flex-1 truncate">
                  {tag.name}
                </span>
                {countLabel && (
                  <span className="text-xs text-text-tertiary hidden sm:block">
                    {countLabel}
                  </span>
                )}

                {isDeleting ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-text-secondary">Delete?</span>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="text-error text-xs font-medium hover:underline"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="text-text-secondary text-xs hover:underline"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                    <button
                      onClick={() => startEdit(tag)}
                      className="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-bg-subtle transition-colors duration-100"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeletingId(tag.id)}
                      className="text-text-tertiary hover:text-error p-1 rounded hover:bg-bg-subtle transition-colors duration-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
