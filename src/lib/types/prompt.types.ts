import { Tag } from "./tag.types";
import { Visibility } from "./api.types";

export interface Prompt {
  id: string;
  title: string;
  content: string;
  useCase: string | null;
  model: string;
  visibility: Visibility;
  isPinned: boolean;
  userId: string;
  collectionId: string | null;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export type PromptCreateInput = {
  collectionId?: string;
  title: string;
  content: string;
  model: string;
  useCase?: string;
  visibility?: Visibility;
  isPinned?: boolean;
  tagIds?: string[];
};

export type PromptUpdateInput = Partial<PromptCreateInput>;
