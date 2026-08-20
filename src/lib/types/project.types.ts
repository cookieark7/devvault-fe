export interface ProjectSummary {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  docCount: number;
  updatedAt: string;
}

export interface DocMeta {
  id: string;
  slug: string;
  title: string;
  relPath: string;
  byteSize: number;
  hasMermaid: boolean;
  fileMtime: string;
  updatedAt: string;
}

export type ProjectTreeNode =
  | { type: "dir"; name: string; path: string; children: ProjectTreeNode[] }
  | { type: "doc"; name: string; path: string; doc: DocMeta };

export interface ProjectTree {
  project: ProjectSummary;
  tree: ProjectTreeNode[];
}

export interface DocRaw {
  id: string;
  title: string;
  relPath: string;
  hash: string;
  hasMermaid: boolean;
  content: string;
}

export interface SyncProjectResult {
  slug: string;
  name: string;
  added: number;
  updated: number;
  removed: number;
  docCount: number;
}

export interface SyncSummary {
  ok: boolean;
  message?: string;
  root?: string;
  ownerId?: string;
  projects: SyncProjectResult[];
  removedProjects: number;
}
