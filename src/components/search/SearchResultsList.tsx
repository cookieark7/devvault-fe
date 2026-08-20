import { Search } from "lucide-react";
import EmptyState from "@/components/common/ui/EmptyState";
import SearchResultItem from "./SearchResultItem";
import type { SearchResult } from "@/lib/types";

interface SearchResultsListProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  onResultClick: (result: SearchResult) => void;
}

function SkeletonRow() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-border-base">
      <div className="w-6 h-6 bg-bg-hover rounded animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 bg-bg-hover rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-bg-hover rounded animate-pulse" />
      </div>
      <div className="h-3 w-12 bg-bg-hover rounded animate-pulse" />
    </div>
  );
}

export default function SearchResultsList({
  results,
  isLoading,
  query,
  onResultClick,
}: SearchResultsListProps) {
  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <EmptyState
        icon={<Search size={20} />}
        title="No results found"
        description={`Nothing matching "${query}"`}
      />
    );
  }

  if (results.length === 0 && !query) {
    return (
      <EmptyState
        icon={<Search size={20} />}
        title="Search your vault"
        description="Try searching for snippets, bookmarks, commands, or prompts"
      />
    );
  }

  return (
    <div>
      {results.map((result) => (
        <SearchResultItem
          key={result.id}
          result={result}
          onClick={() => onResultClick(result)}
        />
      ))}
    </div>
  );
}
