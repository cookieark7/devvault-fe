import { apiClient } from './client';
import {
  PaginationParams,
  PaginatedData,
  Star,
  StarCreateInput,
  ResourceType,
} from '../types';

export interface StarListParams extends PaginationParams {
  userId?: string;
  resourceType?: ResourceType;
}

export const starsService = {
  async list(params?: StarListParams): Promise<PaginatedData<Star>> {
    return apiClient<PaginatedData<Star>>('/stars', { params: params as any });
  },

  async getById(id: string): Promise<Star> {
    return apiClient<Star>(`/stars/${id}`);
  },

  async create(data: StarCreateInput): Promise<Star> {
    return apiClient<Star>('/stars', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async remove(id: string): Promise<void> {
    return apiClient<void>(`/stars/${id}`, {
      method: 'DELETE',
    });
  },
};
