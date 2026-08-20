import { apiClient } from './client';
import {
  PaginationParams,
  PaginatedData,
  Visibility,
} from '../types';
import type { Prompt, PromptCreateInput, PromptUpdateInput } from '../types';

export interface PromptListParams extends PaginationParams {
  userId?: string;
  model?: string;
  visibility?: Visibility;
}

export const promptsService = {
  async list(params?: PromptListParams): Promise<PaginatedData<Prompt>> {
    return apiClient<PaginatedData<Prompt>>('/prompts', { params: params as any });
  },

  async getById(id: string): Promise<Prompt> {
    return apiClient<Prompt>(`/prompts/${id}`);
  },

  async create(data: PromptCreateInput): Promise<Prompt> {
    return apiClient<Prompt>('/prompts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: PromptUpdateInput): Promise<Prompt> {
    return apiClient<Prompt>(`/prompts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async remove(id: string): Promise<void> {
    return apiClient<void>(`/prompts/${id}`, {
      method: 'DELETE',
    });
  },
};
