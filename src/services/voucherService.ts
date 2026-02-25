import api from "./api";

// Types matching Backend DTOs
export interface VoucherResponse {
  id: string;
  code: string;
  description: string;
  isPercentage: boolean;
  value: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateVoucherRequest {
  code: string;
  description: string;
  isPercentage: boolean;
  value: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number;
}

export interface UpdateVoucherRequest {
  description: string;
  isPercentage: boolean;
  value: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number;
  isActive: boolean;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  isSuccess: boolean;
}

const voucherService = {
  // Get all vouchers
  getAllVouchers: async (): Promise<VoucherResponse[]> => {
    const response = await api.get<ApiResponse<VoucherResponse[]>>("/vouchers");
    return response.data.data;
  },

  // Get voucher by ID
  getVoucherById: async (id: string): Promise<VoucherResponse> => {
    const response = await api.get<ApiResponse<VoucherResponse>>(
      `/vouchers/${id}`,
    );
    return response.data.data;
  },

  // Create voucher
  createVoucher: async (
    data: CreateVoucherRequest,
  ): Promise<VoucherResponse> => {
    const response = await api.post<ApiResponse<VoucherResponse>>(
      "/vouchers",
      data,
    );
    return response.data.data;
  },

  // Update voucher
  updateVoucher: async (
    id: string,
    data: UpdateVoucherRequest,
  ): Promise<void> => {
    await api.put<ApiResponse<string>>(`/vouchers/${id}`, data);
  },

  // Delete voucher (soft delete)
  deleteVoucher: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<string>>(`/vouchers/${id}`);
  },
};

export default voucherService;
