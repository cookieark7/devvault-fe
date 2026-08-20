import { Visibility } from './api.types';
import { Tag } from './tag.types';

export interface Note {
  id: string;
  userId: string;
  collectionId: string | null;
  title: string;
  content: string;
  visibility: Visibility;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
}

export type NoteCreateInput = {
  collectionId?: string;
  title: string;
  content: string;
  visibility?: Visibility;
  isPinned?: boolean;
};

export type NoteUpdateInput = Partial<NoteCreateInput>;
