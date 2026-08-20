"use client";

import { useState } from "react";
import LanguageBadge from "./LanguageBadge";
import CopyButton from "@/components/common/ui/CopyButton";
import { cn } from "@/lib/utils/cn";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  maxLines?: number;
}

export default function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  maxLines,
}: CodeBlockProps) {
  const [expanded, setExpanded] = useState(false);

  const lines = code.split("\n");
  const shouldClamp = maxLines !== undefined && lines.length > maxLines;
  const visibleLines =
    shouldClamp && !expanded ? lines.slice(0, maxLines) : lines;

  return (
    <div className="relative bg-bg-subtle border border-border-base rounded p-4 overflow-x-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-border-base">
        <LanguageBadge language={language} />
        <CopyButton text={code} size="sm" />
      </div>

      {/* Code area */}
      <div className="font-mono text-sm text-text-primary leading-relaxed whitespace-pre overflow-x-auto">
        {showLineNumbers
          ? visibleLines.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-text-tertiary text-xs select-none w-8 text-right mr-4 flex-shrink-0 leading-relaxed">
                  {i + 1}
                </span>
                <span>{line}</span>
              </div>
            ))
          : visibleLines.join("\n")}
      </div>

      {/* Show more / less */}
      {shouldClamp && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "mt-3 text-xs text-accent hover:underline font-medium"
          )}
        >
          {expanded
            ? "Show less"
            : `Show ${lines.length - maxLines!} more lines`}
        </button>
      )}
    </div>
  );
}
