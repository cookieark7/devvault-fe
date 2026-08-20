import { apiClient } from './client';
import { PaginationParams, PaginatedData, User } from '../types';

export const usersService = {
  async list(params?: PaginationParams): Promise<PaginatedData<User>> {
    return apiClient<PaginatedData<User>>('/users', { params: params as any });
  },

  async getById(id: string): Promise<User> {
    return apiClient<User>(`/users/${id}`);
  },
  
  // Note: /users POST/PATCH typically handled by admin, normal flow goes through auth.
};
