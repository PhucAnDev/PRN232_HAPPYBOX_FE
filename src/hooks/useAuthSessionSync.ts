import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { STORAGE_KEYS } from "@/constants/storage";
import { resetCartState } from "@/store/slices/cartSlice";
import { syncSessionFromStorage } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store/store";
import {
  areStoredAuthSessionsEqual,
  getStoredAuthSession,
  type StoredAuthSession,
} from "@/utils/authStorage";

const AUTH_STORAGE_KEYS = new Set<string>([
  STORAGE_KEYS.ACCESS_TOKEN,
  STORAGE_KEYS.REFRESH_TOKEN,
  STORAGE_KEYS.USER,
]);

export default function useAuthSessionSync() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, accessToken, refreshToken } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    const syncSession = () => {
      const currentSession: StoredAuthSession = {
        user,
        accessToken,
        refreshToken,
      };
      const storedSession = getStoredAuthSession();

      if (areStoredAuthSessionsEqual(currentSession, storedSession)) {
        return;
      }

      const currentUserId = currentSession.user?.id ?? null;
      const nextUserId = storedSession.user?.id ?? null;
      const authPresenceChanged =
        Boolean(currentSession.accessToken) !== Boolean(storedSession.accessToken);

      dispatch(syncSessionFromStorage(storedSession));

      if (currentUserId !== nextUserId || authPresenceChanged) {
        dispatch(resetCartState());
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) {
        return;
      }

      if (event.key && !AUTH_STORAGE_KEYS.has(event.key)) {
        return;
      }

      syncSession();
    };

    const handleFocus = () => {
      syncSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncSession();
      }
    };

    syncSession();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, user, accessToken, refreshToken]);
}
