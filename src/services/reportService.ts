import type { AxiosResponse } from "axios";

import api from "./api";

export interface DailyReportDto {
  date: string;
  revenue: number;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  productsSold: number;
}

export interface RevenueReportResponse {
  totalRevenue: number;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalProductsSold: number;
  previousRevenue: number;
  previousOrders: number;
  previousProductsSold: number;
  revenueGrowthPercent: number;
  orderGrowthPercent: number;
  productGrowthPercent: number;
  dailyReports: DailyReportDto[];
}

export interface DayDetailOrderDto {
  orderId: string;
  orderNumber: string;
  customerName: string;
  finalAmount: number;
  status: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}

const buildQuery = (params: Record<string, string | number>) =>
  new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {}),
  ).toString();

const reportService = {
  getRevenueReport: (startDate: string, endDate: string) =>
    api.get<ApiResponse<RevenueReportResponse>>(
      `/reports/revenue?${buildQuery({ startDate, endDate })}`,
    ),

  getRevenueDayDetails: (date: string) =>
    api.get<ApiResponse<DayDetailOrderDto[]>>(
      `/reports/revenue/day-details?${buildQuery({ date })}`,
    ),

  exportRevenueReport: (
    startDate: string,
    endDate: string,
  ): Promise<AxiosResponse<Blob>> =>
    api.get(`/reports/revenue/export?${buildQuery({ startDate, endDate })}`, {
      responseType: "blob",
    }),
};

export default reportService;
