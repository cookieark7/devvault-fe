"use client";

import { useState } from "react";
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
 */
export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await searchService.semantic({
        q: query.trim(),
        limit: DEFAULT_LIMIT,
        types: UI_TYPES,
      });

      const mapped: SearchResult[] = (res.results ?? []).map((r) => ({
        ...r,
        tags: r.tags ?? [],
        createdAt: new Date(r.createdAt),
      }));

      setResults(mapped);
    } catch (err: any) {
      setError(err?.message || "Search failed");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
  };
}
