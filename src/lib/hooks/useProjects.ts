"use client";

import { useCallback, useEffect, useState } from "react";
import { projectsService } from "../api";
import type { DocRaw, ProjectSummary, ProjectTree, SyncSummary } from "../types";

/** List of projects + a manual re-sync trigger. */
export function useProjects() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProjects(await projectsService.list());
    } catch (err: any) {
      setError(err?.message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const sync = async (): Promise<SyncSummary | null> => {
    setIsSyncing(true);
    setError(null);
    try {
      const summary = await projectsService.sync();
      await fetchProjects();
      return summary;
    } catch (err: any) {
      setError(err?.message || "Sync failed");
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  return { projects, isLoading, isSyncing, error, sync, refetch: fetchProjects };
}

/** A single project's metadata + document tree. */
export function useProjectTree(projectId?: string) {
  const [data, setData] = useState<ProjectTree | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    projectsService
      .tree(projectId)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err?.message || "Failed to load project"))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return { data, isLoading, error };
}

/** Raw markdown content for a single document (read from disk on the server). */
export function useDocContent(projectId?: string, docId?: string) {
  const [doc, setDoc] = useState<DocRaw | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !docId) {
      setDoc(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    projectsService
      .raw(projectId, docId)
      .then((res) => !cancelled && setDoc(res))
      .catch((err) => !cancelled && setError(err?.message || "Failed to load document"))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [projectId, docId]);

  return { doc, isLoading, error };
}
