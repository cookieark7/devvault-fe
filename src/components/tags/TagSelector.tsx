"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import TagPill from "@/components/common/ui/TagPill";
import type { Tag } from "@/lib/types";

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  availableTags: Tag[];
}

export default function TagSelector({
  selectedTags,
  onTagsChange,
  availableTags,
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedIds = new Set(selectedTags.map((t) => t.id));

  const filtered = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTag = (tag: Tag) => {
    if (selectedIds.has(tag.id)) {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  // Close on outside click
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleMouseDown);
    }
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      {/* Selected tag pills */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedTags.map((tag) => (
            <TagPill
              key={tag.id}
              tag={tag}
              size="sm"
              onRemove={() => removeTag(tag.id)}
            />
          ))}
        </div>
      )}

      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded px-2 py-1 transition-colors duration-100"
      >
        <Plus size={12} />
        Add tag
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" as const }}
            className="absolute top-full left-0 mt-1 z-50 w-56 bg-bg-elevated border border-border-base rounded-md shadow-notion-menu"
          >
            {/* Search input */}
            <div className="px-2 pt-2 pb-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm text-text-primary placeholder:text-text-tertiary bg-transparent outline-none px-1.5 py-1"
              />
            </div>

            <div className="border-t border-border-base" />

            {/* Tag list */}
            <div className="max-h-48 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-xs text-text-tertiary">
                  No tags found
                </p>
              ) : (
                filtered.map((tag) => {
                  const isSelected = selectedIds.has(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left",
                        "hover:bg-bg-hover transition-colors duration-100",
                        isSelected && "text-text-primary"
                      )}
                    >
                      <span
                        className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                        style={{ backgroundColor: tag.color || "#737373" }}
                      />
                      <span className="flex-1 truncate">{tag.name}</span>
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-accent flex-shrink-0"
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
