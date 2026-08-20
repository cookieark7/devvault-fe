import { apiClient } from './client';
import {
  AuthResponse,
  LoginParams,
  RegisterParams,
  RefreshParams,
  LogoutParams,
  User,
} from '../types';

export const authService = {
  async register(data: RegisterParams): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: LoginParams): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async me(): Promise<User> {
    return apiClient<User>('/auth/me');
  },

  async refresh(data: RefreshParams): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout(data: LogoutParams): Promise<void> {
    return apiClient<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
