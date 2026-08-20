export interface Collection {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CollectionCreateInput = {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isPinned?: boolean;
};

export type CollectionUpdateInput = Partial<CollectionCreateInput>;
