import api from "./api";

export interface CreateMomoOrderRequest {
  userId?: string;
  note?: string | null;
  paymentMethod: string;
  voucherId?: string | null;
  shippingPhone: string;
  shippingAddress: string;
  orderDetails: Array<{
    productId?: string | null;
    giftBoxId?: string | null;
    quantity: number;
    price: number;
  }>;
}

export interface CreateMomoOrderResponse {
  orderId: string;
  payUrl: string;
}

export interface PaymentStatusData {
  orderId: string;
  resultCode: number;
  amount: number;
  localPaymentStatus: string;
  message: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const paymentService = {
  createMomoOrder: (data: CreateMomoOrderRequest) =>
    api.post<ApiResponse<CreateMomoOrderResponse>>(
      "/Payment/momo/create-order",
      data,
    ),

  getMomoOrderStatus: (orderId: string) =>
    api.get<ApiResponse<PaymentStatusData>>(
      `/Payment/momo/orders/${orderId}/status`,
    ),

  getOrderSnapshot: <T>(orderId: string) =>
    api.get<ApiResponse<T>>(`/Order/${orderId}`),
};

export default paymentService;
