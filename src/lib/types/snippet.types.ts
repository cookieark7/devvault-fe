import { Visibility } from './api.types';
import { Tag } from './tag.types';

export interface Snippet {
  id: string;
  userId: string;
  collectionId: string | null;
  title: string;
  description: string | null;
  code: string;
  language: string;
  visibility: Visibility;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[]; // Included if populated by BE
}

export type SnippetCreateInput = {
  collectionId?: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  visibility?: Visibility;
  isPinned?: boolean;
  tagIds?: string[];
};

export type SnippetUpdateInput = Partial<SnippetCreateInput>;
