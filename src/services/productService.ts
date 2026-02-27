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
  // GET /api/product/GetAllProducts
  getAll: () =>
    api.get<ApiResponse<ProductResponse[]>>("/product/GetAllProducts"),

  // GET /api/product/GetProductById/:id
  getById: (id: string) =>
    api.get<ApiResponse<ProductResponse>>(`/product/GetProductById/${id}`),

  // POST /api/product/CreateProduct
  create: (data: CreateProductRequest) =>
    api.post<ApiResponse<ProductResponse>>("/product/CreateProduct", data),

  // PUT /api/product/UpdateProduct/:id
  update: (id: string, data: UpdateProductRequest) =>
    api.put<ApiResponse<ProductResponse>>(`/product/UpdateProduct/${id}`, data),

  // DELETE /api/product/DeleteProduct/:id
  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/product/DeleteProduct/${id}`),
};

export default productService;
