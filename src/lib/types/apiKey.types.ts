// Safe representation returned by the list endpoint — never includes the secret.
export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

// Returned once, on creation only — includes the full plaintext key.
export interface CreatedApiKey {
  id: string;
  name: string;
  prefix: string;
  key: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface CreateApiKeyInput {
  name: string;
  expiresAt?: string | null;
}
