import { Tag } from "./tag.types";
import { Visibility } from "./api.types";

export type Platform = "macos" | "linux" | "windows" | "cross-platform";

export interface Command {
  id: string;
  title: string;
  command: string;
  description: string | null;
  platform: Platform;
  visibility: Visibility;
  isPinned: boolean;
  userId: string;
  collectionId: string | null;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export type CommandCreateInput = {
  collectionId?: string;
  title: string;
  command: string;
  platform: Platform;
  description?: string;
  visibility?: Visibility;
  isPinned?: boolean;
  tagIds?: string[];
};

export type CommandUpdateInput = Partial<CommandCreateInput>;
