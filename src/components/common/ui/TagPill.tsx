"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Tag } from "@/lib/types";

interface TagPillProps {
  tag: Tag;
  onRemove?: () => void;
  onClick?: () => void;
  size?: "sm" | "md";
}

/**
 * Convert a hex color string to rgba.
 * Handles both #RGB and #RRGGBB formats.
 */
function hexToRgba(hex: string, alpha: number): string {
  let r: number, g: number, b: number;

  const cleaned = hex.replace("#", "");

  if (cleaned.length === 3) {
    r = parseInt(cleaned[0] + cleaned[0], 16);
    g = parseInt(cleaned[1] + cleaned[1], 16);
    b = parseInt(cleaned[2] + cleaned[2], 16);
  } else {
    r = parseInt(cleaned.slice(0, 2), 16);
    g = parseInt(cleaned.slice(2, 4), 16);
    b = parseInt(cleaned.slice(4, 6), 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TagPill({
  tag,
  onRemove,
  onClick,
  size = "sm",
}: TagPillProps) {
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";

  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        sizeClasses,
        onClick && "cursor-pointer hover:opacity-80"
      )}
      style={{
        backgroundColor: hexToRgba(tag.color || "#737373", 0.12),
        color: tag.color || "#737373",
        border: `1px solid ${hexToRgba(tag.color || "#737373", 0.25)}`,
      }}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-70 transition-opacity ml-0.5"
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
}
