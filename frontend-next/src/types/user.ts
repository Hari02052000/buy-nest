/**
 * Safe representation of the currently authenticated admin user, as returned
 * by the backend `GET /auth/me` endpoint (proxied via `GET /api/auth/me`).
 *
 * This mirrors the backend's *safe* user projection: it must never contain
 * secrets such as password hashes, session IDs, or tokens. The HttpOnly
 * session cookie remains the only credential and is never read in JS.
 */
export interface CurrentUser {
  id: string;
  email: string;
  /** Authorization role, e.g. "admin". Kept as string to match the backend. */
  role: string;
  /** Optional display name, present if the backend includes it. */
  name?: string;
}
