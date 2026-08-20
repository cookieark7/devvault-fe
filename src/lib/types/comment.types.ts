export interface Comment {
  id: string;
  userId: string;
  snippetId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type CommentCreateInput = {
  snippetId: string;
  content: string;
  parentId?: string;
};

export type CommentUpdateInput = {
  content: string;
};
