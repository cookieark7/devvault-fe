"use client";

import { cn } from "@/lib/utils/cn";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

const positionClasses: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
  right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
};

export default function Tooltip({
  content,
  children,
  side = "top",
}: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div
        className={cn(
          "absolute pointer-events-none z-50",
          "bg-bg-elevated text-text-primary text-xs rounded px-2 py-1",
          "border border-border-base shadow-notion-menu",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
          "whitespace-nowrap",
          positionClasses[side]
        )}
      >
        {content}
      </div>
    </div>
  );
}
