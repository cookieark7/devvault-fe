"use client";

import { cn } from "@/lib/utils/cn";
import type { Tag } from "@/lib/types";

interface TagFilterProps {
  tags: Tag[];
  selectedTagIds: string[];
  onFilterChange: (tagIds: string[]) => void;
}

/**
 * Convert hex to rgba for inline styles.
 */
function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace("#", "");
  const r =
    cleaned.length === 3
      ? parseInt(cleaned[0] + cleaned[0], 16)
      : parseInt(cleaned.slice(0, 2), 16);
  const g =
    cleaned.length === 3
      ? parseInt(cleaned[1] + cleaned[1], 16)
      : parseInt(cleaned.slice(2, 4), 16);
  const b =
    cleaned.length === 3
      ? parseInt(cleaned[2] + cleaned[2], 16)
      : parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TagFilter({
  tags,
  selectedTagIds,
  onFilterChange,
}: TagFilterProps) {
  const isAllSelected = selectedTagIds.length === 0;

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onFilterChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onFilterChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      {/* "All" pill */}
      <button
        onClick={() => onFilterChange([])}
        className={cn(
          "inline-flex items-center rounded-full text-xs px-2.5 py-1 font-medium whitespace-nowrap",
          "border transition-colors duration-100",
          isAllSelected
            ? "bg-bg-hover text-text-primary border-border-focus"
            : "text-text-secondary border-border-base hover:bg-bg-hover"
        )}
      >
        All
      </button>

      {tags.map((tag) => {
        const isSelected = selectedTagIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full text-xs px-2.5 py-1 font-medium whitespace-nowrap",
              "border transition-colors duration-100"
            )}
            style={{
              backgroundColor: isSelected
                ? hexToRgba(tag.color || "#737373", 0.15)
                : hexToRgba(tag.color || "#737373", 0.06),
              color: tag.color || "#737373",
              borderColor: isSelected
                ? hexToRgba(tag.color || "#737373", 0.4)
                : hexToRgba(tag.color || "#737373", 0.15),
            }}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
