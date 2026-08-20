import { apiClient } from './client';
import {
  PaginationParams,
  PaginatedData,
  Visibility,
} from '../types';
import type { Command, CommandCreateInput, CommandUpdateInput, Platform } from '../types';

export interface CommandListParams extends PaginationParams {
  userId?: string;
  platform?: Platform;
  visibility?: Visibility;
}

export const commandsService = {
  async list(params?: CommandListParams): Promise<PaginatedData<Command>> {
    return apiClient<PaginatedData<Command>>('/commands', { params: params as any });
  },

  async getById(id: string): Promise<Command> {
    return apiClient<Command>(`/commands/${id}`);
  },

  async create(data: CommandCreateInput): Promise<Command> {
    return apiClient<Command>('/commands', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: CommandUpdateInput): Promise<Command> {
    return apiClient<Command>(`/commands/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async remove(id: string): Promise<void> {
    return apiClient<void>(`/commands/${id}`, {
      method: 'DELETE',
    });
  },
};
