import { APP_PAGES, type AppPage, VALID_APP_PAGES } from "@/constants/pages";
import { STORAGE_KEYS } from "@/constants/storage";

const PAYMENT_RETURN_QUERY_KEYS = ["resultCode", "requestId"];

export const PAGE_PATHS: Record<AppPage, string> = {
  [APP_PAGES.HOME]: "/",
  [APP_PAGES.LOGIN]: "/dang-nhap",
  [APP_PAGES.PRODUCT]: "/san-pham",
  [APP_PAGES.LISTING]: "/gio-qua",
  [APP_PAGES.INDIVIDUAL_PRODUCTS]: "/san-pham-le",
  [APP_PAGES.CUSTOM_BUILDER]: "/tu-tao-gio-qua",
  [APP_PAGES.B2B]: "/dich-vu-doanh-nghiep",
  [APP_PAGES.TRACKING]: "/tra-cuu-don-hang",
  [APP_PAGES.ADMIN]: "/quan-tri",
  [APP_PAGES.CHECKOUT]: "/thanh-toan",
  [APP_PAGES.PROFILE]: "/tai-khoan",
  [APP_PAGES.ORDER_HISTORY]: "/lich-su-don-hang",
  [APP_PAGES.CHANGE_PASSWORD]: "/doi-mat-khau",
  [APP_PAGES.FORGOT_PASSWORD]: "/quen-mat-khau",
  [APP_PAGES.VERIFY_OTP]: "/xac-thuc-otp",
  [APP_PAGES.RESET_PASSWORD]: "/dat-lai-mat-khau",
  [APP_PAGES.PAYMENT_RETURN]: "/ket-qua-thanh-toan",
};

const PAGE_ALIASES: Record<AppPage, string[]> = {
  [APP_PAGES.HOME]: ["/", "/home"],
  [APP_PAGES.LOGIN]: ["/dang-nhap", "/login"],
  [APP_PAGES.PRODUCT]: ["/san-pham", "/product"],
  [APP_PAGES.LISTING]: ["/gio-qua", "/listing"],
  [APP_PAGES.INDIVIDUAL_PRODUCTS]: ["/san-pham-le", "/individual-products"],
  [APP_PAGES.CUSTOM_BUILDER]: ["/tu-tao-gio-qua", "/custom-builder"],
  [APP_PAGES.B2B]: ["/dich-vu-doanh-nghiep", "/b2b"],
  [APP_PAGES.TRACKING]: ["/tra-cuu-don-hang", "/tracking"],
  [APP_PAGES.ADMIN]: ["/quan-tri", "/admin"],
  [APP_PAGES.CHECKOUT]: ["/thanh-toan", "/checkout"],
  [APP_PAGES.PROFILE]: ["/tai-khoan", "/profile"],
  [APP_PAGES.ORDER_HISTORY]: ["/lich-su-don-hang", "/order-history"],
  [APP_PAGES.CHANGE_PASSWORD]: ["/doi-mat-khau", "/change-password"],
  [APP_PAGES.FORGOT_PASSWORD]: ["/quen-mat-khau", "/forgot-password"],
  [APP_PAGES.VERIFY_OTP]: ["/xac-thuc-otp", "/verify-otp"],
  [APP_PAGES.RESET_PASSWORD]: ["/dat-lai-mat-khau", "/reset-password"],
  [APP_PAGES.PAYMENT_RETURN]: ["/ket-qua-thanh-toan", "/payment-return"],
};

const LEGACY_ADMIN_HASH_PATHS: Record<string, string> = {
  admin: PAGE_PATHS[APP_PAGES.ADMIN],
  "admin/products": `${PAGE_PATHS[APP_PAGES.ADMIN]}/san-pham`,
  "admin/orders": `${PAGE_PATHS[APP_PAGES.ADMIN]}/don-hang`,
  "admin/customers": `${PAGE_PATHS[APP_PAGES.ADMIN]}/khach-hang`,
  "admin/vouchers": `${PAGE_PATHS[APP_PAGES.ADMIN]}/ma-giam-gia`,
  "admin/reports": `${PAGE_PATHS[APP_PAGES.ADMIN]}/bao-cao`,
  "admin/settings": `${PAGE_PATHS[APP_PAGES.ADMIN]}/cai-dat`,
  "admin/products-gift-box": `${PAGE_PATHS[APP_PAGES.ADMIN]}/san-pham/gio-qua`,
  "admin/products-individual": `${PAGE_PATHS[APP_PAGES.ADMIN]}/san-pham/san-pham-le`,
  "admin/products-custom": `${PAGE_PATHS[APP_PAGES.ADMIN]}/san-pham/thiet-ke-rieng`,
};

function normalizePathname(pathname: string): string {
  const decodedPath = decodeURIComponent(pathname || "/").trim().toLowerCase();
  const withLeadingSlash = decodedPath.startsWith("/")
    ? decodedPath
    : `/${decodedPath}`;
  const normalized =
    withLeadingSlash.length > 1
      ? withLeadingSlash.replace(/\/+$/, "")
      : withLeadingSlash;

  return normalized || "/";
}

function getLegacyHashPath(hash: string): string | null {
  if (!hash || hash === "#") {
    return null;
  }

  const normalizedHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const normalizedPath = normalizedHash.startsWith("/")
    ? normalizedHash.slice(1)
    : normalizedHash;
  const firstPath = normalizedPath.toLowerCase();

  if (!firstPath) {
    return PAGE_PATHS[APP_PAGES.HOME];
  }

  if (LEGACY_ADMIN_HASH_PATHS[firstPath]) {
    return LEGACY_ADMIN_HASH_PATHS[firstPath];
  }

  if (isAppPage(firstPath)) {
    return PAGE_PATHS[firstPath];
  }

  return null;
}

function getPageFromPathname(pathname: string): AppPage | null {
  const normalizedPath = normalizePathname(pathname);

  for (const page of VALID_APP_PAGES) {
    const aliases = PAGE_ALIASES[page];
    const hasMatch = aliases.some((alias) => {
      const normalizedAlias = normalizePathname(alias);
      if (normalizedAlias === "/") {
        return normalizedPath === "/";
      }

      return (
        normalizedPath === normalizedAlias ||
        normalizedPath.startsWith(`${normalizedAlias}/`)
      );
    });

    if (hasMatch) {
      return page;
    }
  }

  return null;
}

export function isAppPage(value: string): value is AppPage {
  return VALID_APP_PAGES.includes(value as AppPage);
}

export function getPageFromLocation(location: Location): AppPage {
  const params = new URLSearchParams(location.search);
  if (PAYMENT_RETURN_QUERY_KEYS.every((key) => params.has(key))) {
    return APP_PAGES.PAYMENT_RETURN;
  }

  const pageFromPath = getPageFromPathname(location.pathname);
  if (pageFromPath) {
    return pageFromPath;
  }

  const pageFromHashPath = getLegacyHashPath(location.hash);
  if (pageFromHashPath) {
    return getPageFromPathname(pageFromHashPath) ?? APP_PAGES.HOME;
  }

  const storedPage = localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
  if (storedPage && isAppPage(storedPage)) {
    return storedPage;
  }

  return APP_PAGES.HOME;
}

export function getPathForPage(page: AppPage): string {
  return PAGE_PATHS[page];
}

export function getCanonicalUrl(
  location: Location,
  currentPage = getPageFromLocation(location),
): string {
  const queryString = location.search || "";
  const normalizedPath = normalizePathname(location.pathname);
  const legacyHashPath = getLegacyHashPath(location.hash);

  if (legacyHashPath) {
    return `${legacyHashPath}${queryString}`;
  }

  if (
    currentPage === APP_PAGES.ADMIN &&
    normalizedPath.startsWith(`${PAGE_PATHS[APP_PAGES.ADMIN]}/`)
  ) {
    return `${normalizedPath}${queryString}`;
  }

  return `${getPathForPage(currentPage)}${queryString}`;
}

export function persistCurrentPage(page: AppPage): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, page);
}
