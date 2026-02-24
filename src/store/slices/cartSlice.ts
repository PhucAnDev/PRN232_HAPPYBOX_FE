import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductResponse } from "../../services/productService";

// ====== Types ======
export interface CartItem {
  product: ProductResponse;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

// ====== Helper tính lại tổng ======
const recalculate = (items: CartItem[]) => ({
  totalPrice: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
});

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
};

// ====== Slice ======
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ
    addToCart: (state, action: PayloadAction<ProductResponse>) => {
      const existing = state.items.find(
        (i) => i.product.id === action.payload.id,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      const totals = recalculate(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalItems = totals.totalItems;
    },

    // Giảm số lượng (nếu = 0 thì xóa)
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (i) => i.product.id !== action.payload,
          );
        }
      }
      const totals = recalculate(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalItems = totals.totalItems;
    },

    // Xóa 1 sản phẩm khỏi giỏ
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      const totals = recalculate(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalItems = totals.totalItems;
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
    },
  },
});

export const { addToCart, decreaseQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
