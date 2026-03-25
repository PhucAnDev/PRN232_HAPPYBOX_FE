import { toast } from "sonner";

import { APP_PAGES, type AppPage } from "@/constants/pages";
import { STORAGE_KEYS } from "@/constants/storage";
import { isAppPage } from "@/utils/appRouter";

export const AUTH_REQUIRED_PAGES = new Set<AppPage>([
  APP_PAGES.PROFILE,
  APP_PAGES.ORDER_HISTORY,
  APP_PAGES.CHANGE_PASSWORD,
  APP_PAGES.CHECKOUT,
]);

export function rememberPostLoginPage(page: AppPage) {
  if (page === APP_PAGES.LOGIN) {
    return;
  }

  sessionStorage.setItem(STORAGE_KEYS.POST_LOGIN_PAGE, page);
}

export function consumePostLoginPage(): AppPage | null {
  const storedPage = sessionStorage.getItem(STORAGE_KEYS.POST_LOGIN_PAGE);
  sessionStorage.removeItem(STORAGE_KEYS.POST_LOGIN_PAGE);

  if (!storedPage || !isAppPage(storedPage)) {
    return null;
  }

  return storedPage;
}

export function clearPostLoginPage() {
  sessionStorage.removeItem(STORAGE_KEYS.POST_LOGIN_PAGE);
}

export function redirectToLogin(
  navigate: ((page: string) => void) | undefined,
  intendedPage: AppPage,
  message = "Vui lòng đăng nhập để tiếp tục.",
) {
  rememberPostLoginPage(intendedPage);
  toast.warning(message);
  navigate?.(APP_PAGES.LOGIN);
}
