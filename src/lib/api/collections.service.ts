import { apiClient } from './client';
import {
  PaginationParams,
  PaginatedData,
  Collection,
  CollectionCreateInput,
  CollectionUpdateInput,
} from '../types';

export interface CollectionListParams extends PaginationParams {
  userId?: string;
}

export const collectionsService = {
  async list(params?: CollectionListParams): Promise<PaginatedData<Collection>> {
    return apiClient<PaginatedData<Collection>>('/collections', { params: params as any });
  },

  async getById(id: string): Promise<Collection> {
    return apiClient<Collection>(`/collections/${id}`);
  },

  async create(data: CollectionCreateInput): Promise<Collection> {
    return apiClient<Collection>('/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: CollectionUpdateInput): Promise<Collection> {
    return apiClient<Collection>(`/collections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async remove(id: string): Promise<void> {
    return apiClient<void>(`/collections/${id}`, {
      method: 'DELETE',
    });
  },
};
