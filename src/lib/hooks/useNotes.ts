"use client";

import { useState, useCallback, useEffect } from "react";
import { notesService } from "../api";
import type { Note, NoteCreateInput, NoteUpdateInput } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async (params: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await notesService.list(params);
      setNotes(res.items);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch notes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount, scoped to current user
  useEffect(() => {
    if (user?.id) {
      fetchNotes({ userId: user.id });
    }
  }, [fetchNotes, user?.id]);

  const createNote = async (input: NoteCreateInput): Promise<void> => {
    try {
      const item = await notesService.create(input);
      setNotes((prev) => [item, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to create note");
      throw err;
    }
  };

  const updateNote = async (
    id: string,
    input: NoteUpdateInput
  ): Promise<void> => {
    try {
      const updated = await notesService.update(id, input);
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? updated : n))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update note");
      throw err;
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    try {
      await notesService.remove(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete note");
      throw err;
    }
  };

  const toggleFavorite = async (id: string): Promise<void> => {
    const item = notes.find((n) => n.id === id);
    if (!item) return;
    try {
      const updated = await notesService.update(id, { isPinned: !item.isPinned });
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? updated : n))
      );
    } catch (err: any) {
      setError(err.message || "Failed to pin note");
      throw err;
    }
  };

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
  };
}
