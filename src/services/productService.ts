import api from "./api";
import type { ImageResponse } from "./imageService";

// ====== Types (khớp với BE) ======
export interface ProductResponse {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  categoryId: string;
  categoryName?: string;
  createdAt: string;
  updatedAt?: string;
  images?: ImageResponse[]; // Extended - populated from /api/images/products/:id
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
}

export interface UpdateProductRequest {
  sku: string;
  name: string;
  description: string;
  price: number;
  isActive?: boolean;
  categoryId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// ====== Service ======
const productService = {
  // GET /api/Product
  getAll: () => api.get<ApiResponse<ProductResponse[]>>("/Product"),

  // GET /api/Product/:id
  getById: (id: string) =>
    api.get<ApiResponse<ProductResponse>>(`/Product/${id}`),

  // POST /api/Product
  create: (data: CreateProductRequest) =>
    api.post<ApiResponse<ProductResponse>>("/Product", data),

  // PUT /api/Product?id=:id
  update: (id: string, data: UpdateProductRequest) =>
    api.put<ApiResponse<ProductResponse>>(`/Product?id=${id}`, data),

  // DELETE /api/Product/:id
  delete: (id: string) => api.delete<ApiResponse<null>>(`/Product/${id}`),
};

export default productService;
