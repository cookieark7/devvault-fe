import { apiClient } from './client';
import {
  PaginationParams,
  PaginatedData,
  Comment,
  CommentCreateInput,
  CommentUpdateInput,
} from '../types';

export interface CommentListParams extends PaginationParams {
  snippetId?: string;
  userId?: string;
  parentId?: string;
}

export const commentsService = {
  async list(params?: CommentListParams): Promise<PaginatedData<Comment>> {
    return apiClient<PaginatedData<Comment>>('/comments', { params: params as any });
  },

  async getById(id: string): Promise<Comment> {
    return apiClient<Comment>(`/comments/${id}`);
  },

  async create(data: CommentCreateInput): Promise<Comment> {
    return apiClient<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: CommentUpdateInput): Promise<Comment> {
    return apiClient<Comment>(`/comments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async remove(id: string): Promise<void> {
    return apiClient<void>(`/comments/${id}`, {
      method: 'DELETE',
    });
  },
};
