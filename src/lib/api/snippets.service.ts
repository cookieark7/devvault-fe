import { apiClient } from './client';
import {
  PaginationParams,
  PaginatedData,
  Snippet,
  SnippetCreateInput,
  SnippetUpdateInput,
  Visibility,
} from '../types';

export interface SnippetListParams extends PaginationParams {
  userId?: string;
  language?: string;
  visibility?: Visibility;
}

export const snippetsService = {
  async list(params?: SnippetListParams): Promise<PaginatedData<Snippet>> {
    return apiClient<PaginatedData<Snippet>>('/snippets', { params: params as any });
  },

  async getById(id: string): Promise<Snippet> {
    return apiClient<Snippet>(`/snippets/${id}`);
  },

  async create(data: SnippetCreateInput): Promise<Snippet> {
    return apiClient<Snippet>('/snippets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: SnippetUpdateInput): Promise<Snippet> {
    return apiClient<Snippet>(`/snippets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async remove(id: string): Promise<void> {
    return apiClient<void>(`/snippets/${id}`, {
      method: 'DELETE',
    });
  },
};
