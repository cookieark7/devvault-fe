import { apiClient } from './client';
import { ApiKey, CreateApiKeyInput, CreatedApiKey } from '../types';

export const apiKeysService = {
  async list(): Promise<ApiKey[]> {
    return apiClient<ApiKey[]>('/api-keys');
  },

  // The full plaintext key is present only on this response, never again.
  async create(data: CreateApiKeyInput): Promise<CreatedApiKey> {
    return apiClient<CreatedApiKey>('/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async revoke(id: string): Promise<void> {
    return apiClient<void>(`/api-keys/${id}`, {
      method: 'DELETE',
    });
  },
};
