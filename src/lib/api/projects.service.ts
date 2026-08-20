import { apiClient } from "./client";
import type { DocMeta, DocRaw, ProjectSummary, ProjectTree, SyncSummary } from "../types";

export const projectsService = {
  list(): Promise<ProjectSummary[]> {
    return apiClient<ProjectSummary[]>("/projects");
  },

  tree(projectId: string): Promise<ProjectTree> {
    return apiClient<ProjectTree>(`/projects/${projectId}`);
  },

  doc(projectId: string, docId: string): Promise<DocMeta> {
    return apiClient<DocMeta>(`/projects/${projectId}/docs/${docId}`);
  },

  raw(projectId: string, docId: string): Promise<DocRaw> {
    return apiClient<DocRaw>(`/projects/${projectId}/docs/${docId}/raw`);
  },

  sync(): Promise<SyncSummary> {
    return apiClient<SyncSummary>("/projects/sync", { method: "POST" });
  },
};
