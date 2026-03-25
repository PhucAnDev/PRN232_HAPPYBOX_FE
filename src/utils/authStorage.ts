import { STORAGE_KEYS } from "@/constants/storage";
import type { UserAuthInfo } from "@/services/authService";

export interface StoredAuthSession {
  user: UserAuthInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
}

function parseStoredUser(rawUser: string | null): UserAuthInfo | null {
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as UserAuthInfo;
  } catch {
    return null;
  }
}

export function getStoredAuthSession(): StoredAuthSession {
  return {
    user: parseStoredUser(localStorage.getItem(STORAGE_KEYS.USER)),
    accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  };
}

function getComparableUserKey(user: UserAuthInfo | null) {
  return user ? JSON.stringify(user) : "";
}

export function areStoredAuthSessionsEqual(
  left: StoredAuthSession,
  right: StoredAuthSession,
) {
  return (
    left.accessToken === right.accessToken &&
    left.refreshToken === right.refreshToken &&
    getComparableUserKey(left.user) === getComparableUserKey(right.user)
  );
}
