"use client";

import { useState, useCallback, useEffect } from "react";
import { tagsService } from "../api";
import type { Tag, TagCreateInput, TagUpdateInput } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function useTags() {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async (params: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await tagsService.list(params);
      setTags(res.items);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch tags");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount, scoped to current user
  useEffect(() => {
    if (user?.id) {
      fetchTags({ userId: user.id });
    }
  }, [fetchTags, user?.id]);

  const createTag = async (name: string, color: string): Promise<void> => {
    try {
      const newTag = await tagsService.create({ name, color });
      setTags((prev) => [newTag, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to create tag");
      throw err;
    }
  };

  const updateTag = async (
    id: string,
    name: string,
    color: string
  ): Promise<void> => {
    try {
      const updated = await tagsService.update(id, { name, color });
      setTags((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: any) {
      setError(err.message || "Failed to update tag");
      throw err;
    }
  };

  const deleteTag = async (id: string): Promise<void> => {
    try {
      await tagsService.remove(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete tag");
      throw err;
    }
  };

  return {
    tags,
    isLoading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
  };
}
