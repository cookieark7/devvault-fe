export enum Visibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED',
}

export enum ResourceType {
  SNIPPET = 'SNIPPET',
  BOOKMARK = 'BOOKMARK',
  NOTE = 'NOTE',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  details?: Record<string, any>;
  path: string;
}

export interface PaginatedData<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> extends ApiResponse<PaginatedData<T>> {}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export class ApiError extends Error {
  public details?: Record<string, any>;
  public path?: string;

  constructor(message: string, details?: Record<string, any>, path?: string) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
    this.path = path;
  }
}
