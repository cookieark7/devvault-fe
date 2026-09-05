import { ApiError } from "@/lib/types";

export type AuthField = "identifier" | "email" | "username" | "password";

export interface AuthFormError {
  /** Human-readable message safe to show in the UI. */
  message: string;
  /** When set, the message belongs under this field rather than at form level. */
  field?: AuthField;
}

const GENERIC = "Something went wrong. Please try again.";

/**
 * Turns a thrown auth error into something a person can act on.
 *
 * `fetch` rejects with a bare `TypeError` for offline, DNS failure, a dead
 * server *and* a blocked CORS preflight — all of which surfaced to users as the
 * meaningless string "Failed to fetch". The backend's auth errors are plain
 * AppErrors with stable messages (no Zod details), so field mapping keys off
 * those messages.
 */
export function toAuthError(err: unknown): AuthFormError {
  if (err instanceof TypeError) {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return { message: "You're offline. Reconnect and try again." };
    }
    return { message: "Can't reach the server. Check your connection and try again." };
  }

  // Future-proofing: if the API ever returns per-field details, prefer them.
  if (err instanceof ApiError && err.details) {
    const entries = Object.entries(err.details);
    const named = entries.find(
      ([key, value]) =>
        typeof value === "string" &&
        ["identifier", "email", "username", "password"].includes(key)
    );
    if (named) {
      return { field: named[0] as AuthField, message: String(named[1]) };
    }
  }

  const raw = err instanceof Error ? err.message : "";

  if (/email already in use/i.test(raw)) {
    return { field: "email", message: "That email is already registered — try signing in instead." };
  }
  if (/username already in use/i.test(raw)) {
    return { field: "username", message: "That username is taken. Try another one." };
  }
  if (/invalid credentials/i.test(raw)) {
    return { message: "That email/username and password don't match." };
  }
  if (/refresh token|unauthorized/i.test(raw)) {
    return { message: "Your session expired. Please sign in again." };
  }
  if (/too many requests|rate limit/i.test(raw)) {
    return { message: "Too many attempts. Wait a moment and try again." };
  }

  return { message: raw || GENERIC };
}
