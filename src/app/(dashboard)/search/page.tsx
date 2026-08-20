"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TopBar from "@/components/common/layout/TopBar";
import GlobalSearchBar from "@/components/search/GlobalSearchBar";
import SearchResultsList from "@/components/search/SearchResultsList";
import { useSearch } from "@/lib/hooks/useSearch";
import { ROUTES } from "@/lib/constants/routes";
import type { SearchResult } from "@/lib/types";

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { results, isLoading, search, clearResults } = useSearch();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  // Search on mount if initial query exists
  useEffect(() => {
    if (query) {
      search(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (q) {
        search(q);
      } else {
        clearResults();
      }
    },
    [search, clearResults]
  );

  const handleResultClick = (result: SearchResult) => {
    const routeMap: Record<string, (id: string) => string> = {
      snippet: ROUTES.snippet,
      bookmark: ROUTES.bookmark,
      command: ROUTES.command,
      prompt: ROUTES.prompt,
    };
    const getRoute = routeMap[result.type];
    if (getRoute) {
      router.push(getRoute(result.id));
    }
  };

  return (
    <>
      <TopBar title="Search" />
      <div className="px-6 pt-6 pb-3 border-b border-border-base">
        <GlobalSearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          placeholder="Search snippets, bookmarks, commands, prompts..."
        />
        {results.length > 0 && !isLoading && (
          <p className="text-xs text-text-tertiary mt-2">
            {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>
        )}
      </div>
      <SearchResultsList
        results={results}
        isLoading={isLoading}
        query={query}
        onResultClick={handleResultClick}
      />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  );
}
