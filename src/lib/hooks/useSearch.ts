"use client";

import { useCallback, useRef, useState } from "react";
import { searchService } from "../api";
import type { SearchResult } from "../types";

// Only request types that have a dashboard page today. The backend also indexes
// notes (and, later, project docs); surface those here once they have UI.
const UI_TYPES = "snippet,bookmark,command,prompt";
const DEFAULT_LIMIT = 30;

/**
 * Semantic search across the vault. Calls the backend `/search/semantic`
 * endpoint (pgvector + Ollama) and returns ranked SearchResult[] with a
 * `similarity` score.
 *
 * `search` and `clearResults` are stable (memoized) so consumers can safely
 * put them in effect/callback dependency arrays without causing re-render
 * loops. A monotonically increasing request id ensures only the most recent
 * request is allowed to update state, so out-of-order responses can't cause
 * the results list to flicker.
 */
export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Identifies the latest in-flight request. Any response whose id no longer
  // matches this is stale and must be ignored.
  const requestIdRef = useRef(0);

  const search = useCallback(async (query: string): Promise<void> => {
    const trimmed = query.trim();
    // Bump the id up front so any in-flight request is superseded immediately.
    const requestId = ++requestIdRef.current;

    if (!trimmed) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await searchService.semantic({
        q: trimmed,
        limit: DEFAULT_LIMIT,
        types: UI_TYPES,
      });

      // A newer request started while this one was in flight — drop the result.
      if (requestId !== requestIdRef.current) return;

      const mapped: SearchResult[] = (res.results ?? []).map((r) => ({
        ...r,
        tags: r.tags ?? [],
        createdAt: new Date(r.createdAt),
      }));

      setResults(mapped);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      setError(err?.message || "Search failed");
      setResults([]);
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    // Invalidate any in-flight request so a late response can't repopulate.
    requestIdRef.current++;
    setResults([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
  };
}
