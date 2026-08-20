import { Role } from './api.types';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  website: string | null;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
