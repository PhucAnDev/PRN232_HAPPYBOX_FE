import api from "./api";

// ====== Types ======
export interface CartItemResponse {
  id: string;
  cartId: string;
  productId: string | null;
  productName: string | null;
  productSKU: string | null;
  productImageUrl: string | null;
  giftBoxId: string | null;
  giftBoxName: string | null;
  giftBoxCode: string | null;
  giftBoxImageUrl: string | null;
  itemType: string | null; // "product" | "giftBox"
  displayName: string | null;
  displayImageUrl: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface CartResponse {
  id: string;
  userId: string;
  userName: string | null;
  items: CartItemResponse[];
  totalItems: number;
  uniqueItemsCount: number;
  subTotal: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface AddToCartRequest {
  productId?: string | null;
  giftBoxId?: string | null;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CheckoutRequest {
  shippingAddress: string;
  shippingPhone: string;
  voucherCode?: string | null;
  note?: string | null;
  selectedItemIds?: string[] | null;
}

// ====== API Functions ======

export const getCart = async (): Promise<CartResponse> => {
  const res = await api.get("/Cart");
  return res.data.data;
};

export const getCartCount = async (): Promise<number> => {
  const res = await api.get("/Cart/count");
  return res.data.data;
};

export const addItemToCart = async (
  req: AddToCartRequest,
): Promise<CartResponse> => {
  const res = await api.post("/Cart/items", req);
  return res.data.data;
};

export const updateCartItem = async (
  cartItemId: string,
  req: UpdateCartItemRequest,
): Promise<CartResponse> => {
  const res = await api.put(`/Cart/items/${cartItemId}`, req);
  return res.data.data;
};

export const removeCartItem = async (cartItemId: string): Promise<void> => {
  await api.delete(`/Cart/items/${cartItemId}`);
};

export const removeCartItems = async (
  cartItemIds: string[],
): Promise<void> => {
  await api.delete("/Cart/items", { data: cartItemIds });
};

export const clearCart = async (): Promise<void> => {
  await api.delete("/Cart");
};

export const checkout = async (req: CheckoutRequest) => {
  const res = await api.post("/Cart/checkout", req);
  return res.data.data;
};
