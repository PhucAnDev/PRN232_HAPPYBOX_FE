export type ViewProductData = {
  id: string;
  type: "giftbox" | "individual";
};

const VIEW_PRODUCT_STORAGE_KEY = "viewProduct";
export const VIEW_PRODUCT_CHANGE_EVENT = "view-product-change";

let _current: ViewProductData | null = null;

export function setViewProduct(data: ViewProductData): void {
  _current = data;

  if (typeof window !== "undefined") {
    sessionStorage.setItem(VIEW_PRODUCT_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(VIEW_PRODUCT_CHANGE_EVENT));
  }
}

export function getViewProduct(): ViewProductData | null {
  if (_current) {
    return _current;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const stored = sessionStorage.getItem(VIEW_PRODUCT_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as ViewProductData;
    if (
      parsed &&
      typeof parsed.id === "string" &&
      (parsed.type === "giftbox" || parsed.type === "individual")
    ) {
      _current = parsed;
      return parsed;
    }
  } catch {
    sessionStorage.removeItem(VIEW_PRODUCT_STORAGE_KEY);
  }

  return _current;
}
