import { User } from './user.types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginParams {
  identifier: string; // email or username
  password?: string;
  code?: string; // Optional for magic links or OTP in future
}

export interface RegisterParams {
  email: string;
  username: string;
  password?: string;
  displayName?: string;
}

export interface RefreshParams {
  refreshToken: string;
}

export interface LogoutParams {
  refreshToken: string;
}
