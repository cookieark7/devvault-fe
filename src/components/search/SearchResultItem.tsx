import ContentTypeBadge from "@/components/common/ui/ContentTypeBadge";
import TagPill from "@/components/common/ui/TagPill";
import { formatRelativeTime } from "@/lib/utils/format";
import type { SearchResult } from "@/lib/types";

interface SearchResultItemProps {
  result: SearchResult;
  onClick: () => void;
}

export default function SearchResultItem({
  result,
  onClick,
}: SearchResultItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 px-4 py-3 border-b border-border-base hover:bg-bg-hover cursor-pointer transition-colors duration-100"
    >
      {/* Left — type badge */}
      <div className="pt-0.5">
        <ContentTypeBadge type={result.type} showLabel={false} />
      </div>

      {/* Center — content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {result.title}
        </p>
        <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
          {result.preview}
        </p>
        {result.tags.length > 0 && (
          <div className="flex gap-1 mt-1">
            {result.tags.slice(0, 3).map((tag) => (
              <TagPill key={tag.id} tag={tag} size="sm" />
            ))}
          </div>
        )}
      </div>

      {/* Right — relevance + time */}
      <div className="flex flex-col items-end gap-1 pt-0.5">
        {typeof result.similarity === "number" && (
          <span
            className="text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded bg-bg-hover text-text-secondary"
            title="Semantic relevance"
          >
            {Math.round(result.similarity * 100)}%
          </span>
        )}
        <span className="text-xs text-text-tertiary whitespace-nowrap">
          {formatRelativeTime(result.createdAt)}
        </span>
      </div>
    </div>
  );
}
