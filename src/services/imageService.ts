import api from "./api";

// ====== Types (khớp với BE) ======
export interface ImageResponse {
  id: string;
  url: string;
  isMain: boolean;
  sortOrder: number;
  productId?: string;
  giftBoxId?: string;
}

export interface CreateImageRequest {
  url: string;
  isMain: boolean;
  sortOrder: number;
  productId?: string;
  giftBoxId?: string;
}

export interface UpdateImageRequest {
  url?: string;
  isMain?: boolean;
  sortOrder?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// ====== Service ======
const imageService = {
  // GET /api/images
  getAll: () => api.get<ApiResponse<ImageResponse[]>>("/images"),

  // GET /api/images/products/:productId
  getByProduct: (productId: string) =>
    api.get<ApiResponse<ImageResponse[]>>(`/images/products/${productId}`),

  // POST /api/images
  create: (data: CreateImageRequest) =>
    api.post<ApiResponse<ImageResponse>>("/images", data),

  // PUT /api/images/:id
  update: (id: string, data: UpdateImageRequest) =>
    api.put<ApiResponse<string>>(`/images/${id}`, data),

  // DELETE /api/images/:id
  delete: (id: string) => api.delete<ApiResponse<null>>(`/images/${id}`),
};

export default imageService;
