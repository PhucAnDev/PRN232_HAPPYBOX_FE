export type ViewProductData = {
  id: string;
  type: "giftbox" | "individual";
};

let _current: ViewProductData | null = null;

export function setViewProduct(data: ViewProductData): void {
  _current = data;
}

export function getViewProduct(): ViewProductData | null {
  return _current;
}
