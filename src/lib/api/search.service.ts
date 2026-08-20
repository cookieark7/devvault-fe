import { apiClient } from './client';
import type { SearchResponse } from '../types';

export interface SemanticSearchParams {
  q: string;
  limit?: number;
  /** Comma-separated resource types, e.g. "snippet,bookmark,command,prompt". */
  types?: string;
}

export const searchService = {
  /** Semantic (vector) search across the vault via the backend `/search/semantic`. */
  async semantic(params: SemanticSearchParams): Promise<SearchResponse> {
    return apiClient<SearchResponse>('/search/semantic', { params: params as any });
  },
};
