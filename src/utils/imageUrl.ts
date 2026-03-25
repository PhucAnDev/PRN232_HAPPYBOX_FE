import { API_BASE_URL } from "@/constants/env";

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "";
  }
})();

export const resolveImageUrl = (url?: string | null): string => {
  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  if (!API_ORIGIN) return url;

  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};
