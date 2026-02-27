import api from "./api";

// ====== Enums ======
export enum InventoryStatus {
  InStock = "InStock",
  LowStock = "LowStock",
  OutOfStock = "OutOfStock",
  Inactive = "Inactive",
}

// ====== Types ======
export interface InventoryResponse {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  minStockLevel: number;
  status: InventoryStatus;
  lastUpdated: string;
  createdAt: string;
}

export interface CreateInventoryRequest {
  productId: string;
  quantity: number;
  minStockLevel: number;
}

export interface UpdateInventoryRequest {
  quantity: number;
  minStockLevel: number;
}

export interface UpdateQuantityRequest {
  quantityChange: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// ====== Service ======
const inventoryService = {
  // GET /api/Inventories
  getAll: () => api.get<ApiResponse<InventoryResponse[]>>("/Inventories"),

  // GET /api/Inventories/:id
  getById: (id: string) =>
    api.get<ApiResponse<InventoryResponse>>(`/Inventories/${id}`),

  // GET /api/Inventories/product/:productId
  getByProductId: (productId: string) =>
    api.get<ApiResponse<InventoryResponse>>(
      `/Inventories/product/${productId}`,
    ),

  // GET /api/Inventories/status/:status
  getByStatus: (status: InventoryStatus) =>
    api.get<ApiResponse<InventoryResponse[]>>(`/Inventories/status/${status}`),

  // POST /api/Inventories
  create: (data: CreateInventoryRequest) =>
    api.post<ApiResponse<InventoryResponse>>("/Inventories", data),

  // PUT /api/Inventories/:id
  update: (id: string, data: UpdateInventoryRequest) =>
    api.put<ApiResponse<InventoryResponse>>(`/Inventories/${id}`, data),

  // DELETE /api/Inventories/:id
  delete: (id: string) => api.delete<ApiResponse<null>>(`/Inventories/${id}`),

  // PATCH /api/Inventories/:id/quantity
  updateQuantity: (id: string, quantityChange: number) =>
    api.patch<ApiResponse<null>>(
      `/Inventories/${id}/quantity`,
      { quantityChange },
      {
        headers: { "Content-Type": "application/json" },
      },
    ),
};

export default inventoryService;
