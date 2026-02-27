import api from "./api";

// ====== Types ======
export interface TopProductDto {
  productId: string;
  productName: string;
  totalSoldQuantity: number;
  revenueFromProduct: number;
}

export interface TopCustomerDto {
  userId: string;
  userName: string;
  totalSpent: number;
  totalOrdersPlaced: number;
}

export interface DashboardSummaryResponse {
  totalRevenue: number;
  totalOrders: number;
  topProduct: TopProductDto | null;
  topCustomer: TopCustomerDto | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// ====== Service ======
const dashboardService = {
  // GET /api/dashboards/summary
  getSummary: (startDate: string, endDate: string) =>
    api.get<ApiResponse<DashboardSummaryResponse>>(
      `/dashboards/summary?startDate=${startDate}&endDate=${endDate}`
    ),
};

export default dashboardService;
