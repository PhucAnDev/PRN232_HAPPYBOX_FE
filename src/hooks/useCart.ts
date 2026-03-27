import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  removeCartItems,
  emptyCart,
  checkoutCart,
  resetCartState,
} from "../store/slices/cartSlice";
import type {
  AddToCartRequest,
  CheckoutRequest,
} from "../services/cartService";

// ====== useCart Hook ======
const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, isLoading, error } = useSelector(
    (state: RootState) => state.cart,
  );

  return {
    cart,
    items: cart?.items ?? [],
    totalItems: cart?.totalItems ?? 0,
    subTotal: cart?.subTotal ?? 0,
    isLoading,
    error,

    fetchCart: () => dispatch(fetchCart()),
    addItem: (req: AddToCartRequest) => dispatch(addItemToCart(req)),
    updateItem: (cartItemId: string, quantity: number) =>
      dispatch(updateCartItem({ cartItemId, quantity })).unwrap(),
    removeItem: (cartItemId: string) => dispatch(removeCartItem(cartItemId)),
    removeItems: (cartItemIds: string[]) =>
      dispatch(removeCartItems(cartItemIds)),
    emptyCart: () => dispatch(emptyCart()),
    checkout: (req: CheckoutRequest) => dispatch(checkoutCart(req)).unwrap(),
    resetState: () => dispatch(resetCartState()),

    // Tiện ích: kiểm tra sản phẩm đã trong giỏ chưa
    isInCart: (productId: string) =>
      (cart?.items ?? []).some((i) => i.productId === productId),

    // Lấy số lượng của 1 sản phẩm cụ thể
    getQuantity: (productId: string) =>
      (cart?.items ?? []).find((i) => i.productId === productId)?.quantity ?? 0,
  };
};

export default useCart;
