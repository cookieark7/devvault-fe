import { ApiError } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      localStorage.removeItem('refreshToken');
      accessToken = null;
      return false;
    }

    const data = await res.json();
    if (data.success && data.data.tokens) {
      accessToken = data.data.tokens.accessToken;
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  let url = `${BASE_URL}${endpoint}`;
  
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += `?${qs}`;
    }
  }

  const doFetch = async () => {
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  let response = await doFetch();

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await doFetch(); // retry once
    } else {
       // if we fail to refresh, we must logout effectively
       // Window reload handles this trivially from the boundary but context will re-init
       throw new ApiError('Unauthorized', undefined, endpoint);
    }
  }

  if (response.status === 204) {
    // 204 No Content
    return undefined as unknown as T;
  }

  let data: any;
  try {
    data = await response.json();
  } catch (e) {
    throw new ApiError('Failed to parse response', undefined, endpoint);
  }

  if (!response.ok || (data && typeof data === 'object' && data.success === false)) {
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}`,
      data?.details,
      data?.path || endpoint
    );
  }

  // Contract: returns { success: true, data: {} }
  if (data && typeof data === 'object' && 'success' in data) {
      return data.data as T; // returning inner data payload
  }
  
  return data as T;
}
