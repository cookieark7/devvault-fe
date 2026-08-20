"use client";

import { useState, useCallback, useEffect } from "react";
import { collectionsService } from "../api";
import type {
  Collection,
  CollectionCreateInput,
  CollectionUpdateInput,
} from "../types";
import { useAuth } from "../contexts/AuthContext";

export function useCollections() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async (params: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await collectionsService.list(params);
      setCollections(res.items);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch collections");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount, scoped to current user
  useEffect(() => {
    if (user?.id) {
      fetchCollections({ userId: user.id });
    }
  }, [fetchCollections, user?.id]);

  const createCollection = async (input: CollectionCreateInput): Promise<void> => {
    try {
      const item = await collectionsService.create(input);
      setCollections((prev) => [item, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to create collection");
      throw err;
    }
  };

  const updateCollection = async (
    id: string,
    input: CollectionUpdateInput
  ): Promise<void> => {
    try {
      const updated = await collectionsService.update(id, input);
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update collection");
      throw err;
    }
  };

  const deleteCollection = async (id: string): Promise<void> => {
    try {
      await collectionsService.remove(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete collection");
      throw err;
    }
  };

  return {
    collections,
    isLoading,
    error,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
  };
}
