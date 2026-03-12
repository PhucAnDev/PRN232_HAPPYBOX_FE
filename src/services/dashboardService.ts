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

export interface SalesTrendDto {
  date: string;       // "dd/MM/yyyy"
  revenue: number;
  orderCount: number;
}

export interface OrderStatusChartDto {
  statusName: string; // "Pending", "Delivered", ...
  count: number;
}

export interface RecentOrderDto {
  orderId: string;
  orderNumber: string;
  customerName: string;
  finalAmount: number;
  status: string;
  createdAt: string;
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

  // GET /api/dashboards/sales-trend
  getSalesTrend: (startDate: string, endDate: string) =>
    api.get<ApiResponse<SalesTrendDto[]>>(
      `/dashboards/sales-trend?startDate=${startDate}&endDate=${endDate}`
    ),

  // GET /api/dashboards/order-status
  getOrderStatus: (startDate: string, endDate: string) =>
    api.get<ApiResponse<OrderStatusChartDto[]>>(
      `/dashboards/order-status?startDate=${startDate}&endDate=${endDate}`
    ),

  // GET /api/dashboards/recent-orders
  getRecentOrders: (limit: number = 5) =>
    api.get<ApiResponse<RecentOrderDto[]>>(
      `/dashboards/recent-orders?limit=${limit}`
    ),
};

export default dashboardService;
