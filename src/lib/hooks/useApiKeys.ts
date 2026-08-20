"use client";

import { useState, useCallback, useEffect } from "react";
import { apiKeysService } from "../api";
import type { ApiKey, CreateApiKeyInput, CreatedApiKey } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function useApiKeys() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiKeysService.list();
      // Only surface active keys; revoked keys are retained server-side for audit.
      setKeys(res.filter((k) => !k.revokedAt));
    } catch (err: any) {
      setError(err.message || "Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchKeys();
    }
  }, [fetchKeys, user?.id]);

  const createKey = async (input: CreateApiKeyInput): Promise<CreatedApiKey> => {
    const created = await apiKeysService.create(input);
    setKeys((prev) => [
      {
        id: created.id,
        name: created.name,
        prefix: created.prefix,
        lastUsedAt: null,
        expiresAt: created.expiresAt,
        revokedAt: null,
        createdAt: created.createdAt,
      },
      ...prev,
    ]);
    return created;
  };

  const revokeKey = async (id: string): Promise<void> => {
    await apiKeysService.revoke(id);
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  return { keys, isLoading, error, fetchKeys, createKey, revokeKey };
}
