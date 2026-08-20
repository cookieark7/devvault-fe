import { apiClient } from './client';
import {
  PaginationParams,
  PaginatedData,
  Bookmark,
  BookmarkCreateInput,
  BookmarkUpdateInput,
  Visibility,
} from '../types';

export interface BookmarkListParams extends PaginationParams {
  userId?: string;
  visibility?: Visibility;
}

export const bookmarksService = {
  async list(params?: BookmarkListParams): Promise<PaginatedData<Bookmark>> {
    return apiClient<PaginatedData<Bookmark>>('/bookmarks', { params: params as any });
  },

  async getById(id: string): Promise<Bookmark> {
    return apiClient<Bookmark>(`/bookmarks/${id}`);
  },

  async create(data: BookmarkCreateInput): Promise<Bookmark> {
    return apiClient<Bookmark>('/bookmarks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: BookmarkUpdateInput): Promise<Bookmark> {
    return apiClient<Bookmark>(`/bookmarks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async remove(id: string): Promise<void> {
    return apiClient<void>(`/bookmarks/${id}`, {
      method: 'DELETE',
    });
  },
};
