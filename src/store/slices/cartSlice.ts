import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "../../services/cartService";
import type {
  CartResponse,
  AddToCartRequest,
  CheckoutRequest,
} from "../../services/cartService";
import { getErrorMessage } from "../../utils/errorMessage";

// ====== State ======
interface CartState {
  cart: CartResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

// ====== Async Thunks ======

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  return await cartService.getCart();
});

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (req: AddToCartRequest) => {
    return await cartService.addItemToCart(req);
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async (
    { cartItemId, quantity }: { cartItemId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      return await cartService.updateCartItem(cartItemId, { quantity });
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "So luong dat vuot qua ton kho hien co. Vui long dieu chinh lai.",
        ),
      );
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (cartItemId: string) => {
    await cartService.removeCartItem(cartItemId);
    return cartItemId;
  },
);

export const removeCartItems = createAsyncThunk(
  "cart/removeItems",
  async (cartItemIds: string[]) => {
    await cartService.removeCartItems(cartItemIds);
    return cartItemIds;
  },
);

export const emptyCart = createAsyncThunk("cart/empty", async () => {
  await cartService.clearCart();
});

export const checkoutCart = createAsyncThunk(
  "cart/checkout",
  async (req: CheckoutRequest) => {
    return await cartService.checkout(req);
  },
);

// ====== Slice ======
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.cart = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Lỗi tải giỏ hàng";
      });

    // addItemToCart
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Lỗi thêm vào giỏ hàng";
      });

    // updateCartItem
    builder
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.error = null;
        state.cart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error =
          (typeof action.payload === "string" && action.payload) ||
          action.error.message ||
          "So luong dat vuot qua ton kho hien co. Vui long dieu chinh lai.";
      });

    // removeCartItem — xóa 1 item khỏi state cục bộ
    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      if (state.cart) {
        state.cart.items = state.cart.items.filter(
          (i) => i.id !== action.payload,
        );
        state.cart.totalItems = state.cart.items.reduce(
          (s, i) => s + i.quantity,
          0,
        );
        state.cart.subTotal = state.cart.items.reduce(
          (s, i) => s + i.totalPrice,
          0,
        );
      }
    });

    // removeCartItems — xóa nhiều items
    builder.addCase(removeCartItems.fulfilled, (state, action) => {
      if (state.cart) {
        const ids = new Set(action.payload);
        state.cart.items = state.cart.items.filter((i) => !ids.has(i.id));
        state.cart.totalItems = state.cart.items.reduce(
          (s, i) => s + i.quantity,
          0,
        );
        state.cart.subTotal = state.cart.items.reduce(
          (s, i) => s + i.totalPrice,
          0,
        );
      }
    });

    // emptyCart
    builder.addCase(emptyCart.fulfilled, (state) => {
      if (state.cart) {
        state.cart.items = [];
        state.cart.totalItems = 0;
        state.cart.subTotal = 0;
      }
    });

    // checkoutCart
    builder
      .addCase(checkoutCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cart = null;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Lỗi đặt hàng";
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
