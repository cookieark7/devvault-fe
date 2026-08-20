"use client";

import { useState, useCallback, useEffect } from "react";
import { bookmarksService } from "../api";
import type {
  Bookmark,
  BookmarkCreateInput,
  BookmarkUpdateInput,
} from "../types";
import { useAuth } from "../contexts/AuthContext";

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async (params: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await bookmarksService.list(params);
      setBookmarks(res.items);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookmarks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount, scoped to current user
  useEffect(() => {
    if (user?.id) {
      fetchBookmarks({ userId: user.id });
    }
  }, [fetchBookmarks, user?.id]);

  const createBookmark = async (
    input: BookmarkCreateInput
  ): Promise<void> => {
    try {
      const item = await bookmarksService.create(input);
      setBookmarks((prev) => [item, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to create bookmark");
      throw err;
    }
  };

  const updateBookmark = async (
    id: string,
    input: BookmarkUpdateInput
  ): Promise<void> => {
    try {
      const updated = await bookmarksService.update(id, input);
      setBookmarks((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update bookmark");
      throw err;
    }
  };

  const deleteBookmark = async (id: string): Promise<void> => {
    try {
      await bookmarksService.remove(id);
      setBookmarks((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete bookmark");
      throw err;
    }
  };

  const toggleFavorite = async (id: string): Promise<void> => {
    const item = bookmarks.find(s => s.id === id);
    if (!item) return;
    try {
      const updated = await bookmarksService.update(id, { isPinned: !item.isPinned });
      setBookmarks((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    } catch (err: any) {
      setError(err.message || "Failed to pin bookmark");
      throw err;
    }
  };

  return {
    bookmarks,
    isLoading,
    error,
    fetchBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
  };
}
