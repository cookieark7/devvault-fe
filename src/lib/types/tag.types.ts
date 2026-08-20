export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type TagCreateInput = {
  name: string;
  color?: string;
};

export type TagUpdateInput = Partial<TagCreateInput>;
