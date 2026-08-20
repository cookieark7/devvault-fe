"use client";

import { useState, useCallback, useEffect } from "react";
import { snippetsService } from "../api";
import type { Snippet, SnippetCreateInput, SnippetUpdateInput } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function useSnippets() {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSnippets = useCallback(async (params: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await snippetsService.list(params);
      setSnippets(res.items);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch snippets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount, scoped to current user
  useEffect(() => {
    if (user?.id) {
      fetchSnippets({ userId: user.id });
    }
  }, [fetchSnippets, user?.id]);

  const createSnippet = async (input: SnippetCreateInput): Promise<void> => {
    try {
      const newSnippet = await snippetsService.create(input);
      setSnippets((prev) => [newSnippet, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to create snippet");
      throw err;
    }
  };

  const updateSnippet = async (
    id: string,
    input: SnippetUpdateInput
  ): Promise<void> => {
    try {
      const updated = await snippetsService.update(id, input);
      setSnippets((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update snippet");
      throw err;
    }
  };

  const deleteSnippet = async (id: string): Promise<void> => {
    try {
      await snippetsService.remove(id);
      setSnippets((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete snippet");
      throw err;
    }
  };

  const toggleFavorite = async (id: string): Promise<void> => {
    const snippet = snippets.find(s => s.id === id);
    if (!snippet) return;
    try {
      // Toggle the boolean
      const updated = await snippetsService.update(id, { isPinned: !snippet.isPinned });
      setSnippets((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    } catch (err: any) {
      setError(err.message || "Failed to pin snippet");
      throw err;
    }
  };

  return {
    snippets,
    isLoading,
    error,
    fetchSnippets,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleFavorite,
  };
}
