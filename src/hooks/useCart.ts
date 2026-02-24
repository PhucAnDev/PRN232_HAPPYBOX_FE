import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../store/slices/cartSlice";
import type { ProductResponse } from "../services/productService";

// ====== useCart Hook ======
const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalPrice, totalItems } = useSelector(
    (state: RootState) => state.cart,
  );

  return {
    items,
    totalPrice,
    totalItems,

    addToCart: (product: ProductResponse) => dispatch(addToCart(product)),
    decreaseQuantity: (productId: string) =>
      dispatch(decreaseQuantity(productId)),
    removeFromCart: (productId: string) => dispatch(removeFromCart(productId)),
    clearCart: () => dispatch(clearCart()),

    // Tiện ích: kiểm tra sản phẩm đã trong giỏ chưa
    isInCart: (productId: string) =>
      items.some((i) => i.product.id === productId),

    // Lấy số lượng của 1 sản phẩm cụ thể
    getQuantity: (productId: string) =>
      items.find((i) => i.product.id === productId)?.quantity ?? 0,
  };
};

export default useCart;
