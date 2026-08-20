import { apiClient } from './client';
import {
  PaginationParams,
  PaginatedData,
  Note,
  NoteCreateInput,
  NoteUpdateInput,
  Visibility,
} from '../types';

export interface NoteListParams extends PaginationParams {
  userId?: string;
  visibility?: Visibility;
}

export const notesService = {
  async list(params?: NoteListParams): Promise<PaginatedData<Note>> {
    return apiClient<PaginatedData<Note>>('/notes', { params: params as any });
  },

  async getById(id: string): Promise<Note> {
    return apiClient<Note>(`/notes/${id}`);
  },

  async create(data: NoteCreateInput): Promise<Note> {
    return apiClient<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: NoteUpdateInput): Promise<Note> {
    return apiClient<Note>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async remove(id: string): Promise<void> {
    return apiClient<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  },
};
