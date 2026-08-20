import { Visibility } from './api.types';
import { Tag } from './tag.types';

export interface Bookmark {
  id: string;
  userId: string;
  collectionId: string | null;
  title: string;
  url: string;
  description: string | null;
  favicon: string | null;
  ogImage: string | null;
  visibility: Visibility;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
}

export type BookmarkCreateInput = {
  collectionId?: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  ogImage?: string;
  visibility?: Visibility;
  isPinned?: boolean;
  tagIds?: string[];
};

export type BookmarkUpdateInput = Partial<BookmarkCreateInput>;
