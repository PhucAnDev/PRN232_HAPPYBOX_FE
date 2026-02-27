import api from "./api";

// ====== Enums (khớp với Backend) ======
export enum OrderStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Processing = "Processing",
  Shipping = "Shipping",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Returned = "Returned",
}

// ====== Types (khớp với Backend DTOs) ======
export interface OrderDetailResponse {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName?: string; // Extended - from Product join
  productImage?: string; // Extended
}

export interface OrderHistoryResponse {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string;
  changedBy: string;
  createdAt: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  userId: string;
  voucherId?: string;
  
  // Financial
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  
  // Status & Shipping
  currentStatus: OrderStatus;
  paymentMethod: string;
  shippingAddress: string;
  shippingMethod: string;
  trackingNumber: string;
  
  createdAt: string;
  note: string;
  
  orderDetails: OrderDetailResponse[];
  orderHistories: OrderHistoryResponse[];
}

export interface CreateOrderDetailRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  userId: string;
  note?: string;
  paymentMethod: string; // "COD" or "VNPAY", "MOMO", etc.
  voucherId?: string;
  shippingAddress: string;
  orderDetails: CreateOrderDetailRequest[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// ====== Status Display Helpers ======
export const orderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "Chờ xử lý",
  [OrderStatus.Confirmed]: "Đã xác nhận",
  [OrderStatus.Processing]: "Đang xử lý",
  [OrderStatus.Shipping]: "Đang giao",
  [OrderStatus.Delivered]: "Hoàn thành",
  [OrderStatus.Cancelled]: "Đã hủy",
  [OrderStatus.Returned]: "Đã trả hàng",
};

export const orderStatusColors: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.Confirmed]: "bg-blue-100 text-blue-800",
  [OrderStatus.Processing]: "bg-purple-100 text-purple-800",
  [OrderStatus.Shipping]: "bg-indigo-100 text-indigo-800",
  [OrderStatus.Delivered]: "bg-green-100 text-green-800",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-800",
  [OrderStatus.Returned]: "bg-gray-100 text-gray-800",
};

// ====== Service ======
const orderService = {
  // GET /api/orders
  getAll: () => api.get<ApiResponse<OrderResponse[]>>("/orders"),

  // GET /api/orders/:id
  getById: (id: string) =>
    api.get<ApiResponse<OrderResponse>>(`/orders/${id}`),

  // POST /api/orders
  create: (data: CreateOrderRequest) =>
    api.post<ApiResponse<OrderResponse>>("/orders", data),

  // PATCH /api/orders/:id/status
  updateStatus: (id: string, status: OrderStatus) =>
    api.patch<ApiResponse<OrderResponse>>(`/orders/${id}/status`, status, {
      headers: { "Content-Type": "application/json" },
    }),

  // DELETE /api/orders/:id
  delete: (id: string) => api.delete<ApiResponse<null>>(`/orders/${id}`),
};

export default orderService;
