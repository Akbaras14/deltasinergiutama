import type { Role } from "@dsu/contracts";

/** Shape of the demo session stored in a cookie. */
export interface DemoSession {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const COOKIE_NAME = "dsu_session";
const SESSION_EVENT = "dsu-session-change";

export function subscribeSession(onChange: () => void): () => void {
  window.addEventListener(SESSION_EVENT, onChange);
  window.addEventListener("focus", onChange);
  return () => {
    window.removeEventListener(SESSION_EVENT, onChange);
    window.removeEventListener("focus", onChange);
  };
}

export const hasSession = () => getSession() !== null;
export const hasServerSession = () => false;

/** Persist a demo session to a cookie (client-side only). */
export function setSession(session: DemoSession): void {
  const value = btoa(JSON.stringify(session));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=86400; SameSite=Lax`;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

/** Read the demo session from cookies (client-side only). Returns null if absent or invalid. */
export function getSession(): DemoSession | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    return JSON.parse(atob(match.split("=")[1])) as DemoSession;
  } catch {
    return null;
  }
}

/** Remove the demo session cookie (client-side only). */
export function clearSession(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

/** Returns the redirect path for a given role after login. */
export function redirectPathForRole(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "PETUGAS":
      return "/petugas";
    case "PELANGGAN":
      return "/";
  }
}
