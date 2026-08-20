"use client";

import { useState, useCallback, useEffect } from "react";
import { promptsService } from "../api";
import type { Prompt, PromptCreateInput, PromptUpdateInput } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function usePrompts() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompts = useCallback(async (params: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await promptsService.list(params);
      setPrompts(res.items);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch prompts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount, scoped to current user
  useEffect(() => {
    if (user?.id) {
      fetchPrompts({ userId: user.id });
    }
  }, [fetchPrompts, user?.id]);

  const createPrompt = async (input: PromptCreateInput): Promise<void> => {
    try {
      const item = await promptsService.create(input);
      setPrompts((prev) => [item, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to create prompt");
      throw err;
    }
  };

  const updatePrompt = async (
    id: string,
    input: PromptUpdateInput
  ): Promise<void> => {
    try {
      const updated = await promptsService.update(id, input);
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update prompt");
      throw err;
    }
  };

  const deletePrompt = async (id: string): Promise<void> => {
    try {
      await promptsService.remove(id);
      setPrompts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete prompt");
      throw err;
    }
  };

  const toggleFavorite = async (id: string): Promise<void> => {
    const item = prompts.find((p) => p.id === id);
    if (!item) return;
    try {
      const updated = await promptsService.update(id, {
        isPinned: !item.isPinned,
      });
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
    } catch (err: any) {
      setError(err.message || "Failed to toggle favorite");
      throw err;
    }
  };

  return {
    prompts,
    isLoading,
    error,
    fetchPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
  };
}
