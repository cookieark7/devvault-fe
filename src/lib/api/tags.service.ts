import { apiClient } from './client';
import {
  PaginationParams,
  PaginatedData,
  Tag,
  TagCreateInput,
  TagUpdateInput,
} from '../types';

export interface TagListParams extends PaginationParams {
  userId?: string;
}

export const tagsService = {
  async list(params?: TagListParams): Promise<PaginatedData<Tag>> {
    return apiClient<PaginatedData<Tag>>('/tags', { params: params as any });
  },

  async getById(id: string): Promise<Tag> {
    return apiClient<Tag>(`/tags/${id}`);
  },

  async create(data: TagCreateInput): Promise<Tag> {
    return apiClient<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: TagUpdateInput): Promise<Tag> {
    return apiClient<Tag>(`/tags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async remove(id: string): Promise<void> {
    return apiClient<void>(`/tags/${id}`, {
      method: 'DELETE',
    });
  },

  async attachToSnippet(tagId: string, snippetId: string): Promise<void> {
    return apiClient<void>(`/tags/${tagId}/snippets/${snippetId}`, { method: 'POST' });
  },

  async detachFromSnippet(tagId: string, snippetId: string): Promise<void> {
    return apiClient<void>(`/tags/${tagId}/snippets/${snippetId}`, { method: 'DELETE' });
  },

  async attachToBookmark(tagId: string, bookmarkId: string): Promise<void> {
    return apiClient<void>(`/tags/${tagId}/bookmarks/${bookmarkId}`, { method: 'POST' });
  },

  async detachFromBookmark(tagId: string, bookmarkId: string): Promise<void> {
    return apiClient<void>(`/tags/${tagId}/bookmarks/${bookmarkId}`, { method: 'DELETE' });
  },

  async attachToNote(tagId: string, noteId: string): Promise<void> {
    return apiClient<void>(`/tags/${tagId}/notes/${noteId}`, { method: 'POST' });
  },

  async detachFromNote(tagId: string, noteId: string): Promise<void> {
    return apiClient<void>(`/tags/${tagId}/notes/${noteId}`, { method: 'DELETE' });
  },
};
