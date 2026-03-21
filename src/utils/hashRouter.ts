import { APP_PAGES, type AppPage, VALID_APP_PAGES } from "@/constants/pages";
import { STORAGE_KEYS } from "@/constants/storage";

const PAYMENT_RETURN_QUERY_KEYS = ["resultCode", "requestId"];

export function isAppPage(value: string): value is AppPage {
  return VALID_APP_PAGES.includes(value as AppPage);
}

function getFirstHashSegment(hash: string): string {
  if (!hash || hash === "#") {
    return APP_PAGES.HOME;
  }

  const normalizedHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const normalizedPath = normalizedHash.startsWith("/")
    ? normalizedHash.slice(1)
    : normalizedHash;
  const firstSegment = normalizedPath.split("/")[0];

  return firstSegment || APP_PAGES.HOME;
}

export function getPageFromLocation(location: Location): AppPage {
  const params = new URLSearchParams(location.search);
  if (PAYMENT_RETURN_QUERY_KEYS.every((key) => params.has(key))) {
    return APP_PAGES.PAYMENT_RETURN;
  }

  const hashPage = getFirstHashSegment(location.hash);
  if (isAppPage(hashPage)) {
    return hashPage;
  }

  const storedPage = localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
  if (storedPage && isAppPage(storedPage)) {
    return storedPage;
  }

  return APP_PAGES.HOME;
}

export function getHashForPage(page: AppPage): string {
  return page === APP_PAGES.HOME ? "#/" : `#/${page}`;
}

export function persistCurrentPage(page: AppPage): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, page);
}
