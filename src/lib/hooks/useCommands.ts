"use client";

import { useState, useCallback, useEffect } from "react";
import { commandsService } from "../api";
import type { Command, CommandCreateInput, CommandUpdateInput } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function useCommands() {
  const { user } = useAuth();
  const [commands, setCommands] = useState<Command[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommands = useCallback(async (params: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await commandsService.list(params);
      setCommands(res.items);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch commands");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount, scoped to current user
  useEffect(() => {
    if (user?.id) {
      fetchCommands({ userId: user.id });
    }
  }, [fetchCommands, user?.id]);

  const createCommand = async (input: CommandCreateInput): Promise<void> => {
    try {
      const item = await commandsService.create(input);
      setCommands((prev) => [item, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to create command");
      throw err;
    }
  };

  const updateCommand = async (
    id: string,
    input: CommandUpdateInput
  ): Promise<void> => {
    try {
      const updated = await commandsService.update(id, input);
      setCommands((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update command");
      throw err;
    }
  };

  const deleteCommand = async (id: string): Promise<void> => {
    try {
      await commandsService.remove(id);
      setCommands((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete command");
      throw err;
    }
  };

  const toggleFavorite = async (id: string): Promise<void> => {
    const item = commands.find((c) => c.id === id);
    if (!item) return;
    try {
      const updated = await commandsService.update(id, {
        isPinned: !item.isPinned,
      });
      setCommands((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
    } catch (err: any) {
      setError(err.message || "Failed to toggle favorite");
      throw err;
    }
  };

  return {
    commands,
    isLoading,
    error,
    fetchCommands,
    createCommand,
    updateCommand,
    deleteCommand,
    toggleFavorite,
  };
}
