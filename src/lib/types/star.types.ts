import { ResourceType } from './api.types';

export interface Star {
  id: string;
  userId: string;
  resourceType: ResourceType;
  snippetId: string | null;
  bookmarkId: string | null;
  noteId: string | null;
  createdAt: string;
}

export type StarCreateInput = {
  resourceType: ResourceType;
  snippetId?: string;
  bookmarkId?: string;
  noteId?: string;
};
