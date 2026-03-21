import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderService, {
  CreateOrderRequest,
  OrderResponse,
  OrderStatus,
} from "../../services/orderService";
import paymentService, {
  CreateMomoOrderRequest,
  CreateMomoOrderResponse,
  PaymentStatusData,
} from "../../services/paymentService";
import { getErrorMessage } from "../../utils/errorMessage";

interface OrderState {
  orders: OrderResponse[];
  userOrders: OrderResponse[];
  orderDetailsById: Record<string, OrderResponse>;
  paymentStatusesByOrderId: Record<string, PaymentStatusData>;
  momoRedirect: CreateMomoOrderResponse | null;
  loading: boolean;
  paymentLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  userOrders: [],
  orderDetailsById: {},
  paymentStatusesByOrderId: {},
  momoRedirect: null,
  loading: false,
  paymentLoading: false,
  error: null,
};

const normalizeOrderList = (payload: unknown): OrderResponse[] => {
  if (Array.isArray(payload)) {
    return payload as OrderResponse[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: OrderResponse[] }).data;
  }

  return [];
};

const normalizeOrderDetail = (payload: unknown): OrderResponse | null => {
  if (payload && typeof payload === "object") {
    if ("id" in (payload as Record<string, unknown>)) {
      return payload as OrderResponse;
    }

    const nestedData = (payload as { data?: unknown }).data;
    if (
      nestedData &&
      typeof nestedData === "object" &&
      "id" in (nestedData as Record<string, unknown>)
    ) {
      return nestedData as OrderResponse;
    }
  }

  return null;
};

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getAll();
      return normalizeOrderList(response.data.data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai danh sach don hang"),
      );
    }
  },
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await orderService.getByUserId(userId);
      return normalizeOrderList(response.data.data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai don hang cua nguoi dung"),
      );
    }
  },
);

export const fetchOrderDetail = createAsyncThunk(
  "orders/fetchOrderDetail",
  async (orderId: string, { rejectWithValue }) => {
    try {
      try {
        const response = await orderService.getById(orderId);
        const order = normalizeOrderDetail(response.data.data);

        if (!order) {
          throw new Error("Du lieu chi tiet don hang khong hop le");
        }

        return order;
      } catch {
        const fallbackResponse =
          await paymentService.getOrderSnapshot<OrderResponse>(orderId);
        const order = normalizeOrderDetail(fallbackResponse.data.data);

        if (!order) {
          throw new Error("Du lieu chi tiet don hang khong hop le");
        }

        return order;
      }
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai chi tiet don hang"),
      );
    }
  },
);

export const createOrderEntity = createAsyncThunk(
  "orders/createOrderEntity",
  async (payload: CreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await orderService.create(payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tao don hang"),
      );
    }
  },
);

export const updateOrderStatusEntity = createAsyncThunk(
  "orders/updateOrderStatusEntity",
  async (
    payload: { id: string; status: OrderStatus },
    { rejectWithValue },
  ) => {
    try {
      const response = await orderService.updateStatus(
        payload.id,
        payload.status,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the cap nhat trang thai don hang"),
      );
    }
  },
);

export const createMomoOrderEntity = createAsyncThunk(
  "orders/createMomoOrderEntity",
  async (payload: CreateMomoOrderRequest, { rejectWithValue }) => {
    try {
      const response = await paymentService.createMomoOrder(payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tao thanh toan MoMo"),
      );
    }
  },
);

export const fetchMomoPaymentStatus = createAsyncThunk(
  "orders/fetchMomoPaymentStatus",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await paymentService.getMomoOrderStatus(orderId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the kiem tra trang thai thanh toan"),
      );
    }
  },
);

const upsertOrder = (collection: OrderResponse[], order: OrderResponse) => {
  const index = collection.findIndex((item) => item.id === order.id);
  if (index >= 0) {
    collection[index] = order;
  } else {
    collection.unshift(order);
  }
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
    clearMomoRedirect(state) {
      state.momoRedirect = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        action.payload.forEach((order) => {
          state.orderDetailsById[order.id] = order;
        });
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
        action.payload.forEach((order) => {
          state.orderDetailsById[order.id] = order;
        });
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetailsById[action.payload.id] = action.payload;
        upsertOrder(state.orders, action.payload);
        upsertOrder(state.userOrders, action.payload);
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrderEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetailsById[action.payload.id] = action.payload;
        upsertOrder(state.orders, action.payload);
        upsertOrder(state.userOrders, action.payload);
      })
      .addCase(createOrderEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatusEntity.fulfilled, (state, action) => {
        state.orderDetailsById[action.payload.id] = action.payload;
        upsertOrder(state.orders, action.payload);
        upsertOrder(state.userOrders, action.payload);
      })
      .addCase(updateOrderStatusEntity.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(createMomoOrderEntity.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(createMomoOrderEntity.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.momoRedirect = action.payload;
      })
      .addCase(createMomoOrderEntity.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMomoPaymentStatus.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(fetchMomoPaymentStatus.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentStatusesByOrderId[action.payload.orderId] = action.payload;
      })
      .addCase(fetchMomoPaymentStatus.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderError, clearMomoRedirect } = orderSlice.actions;

export default orderSlice.reducer;
