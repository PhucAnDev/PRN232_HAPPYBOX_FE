import api from "./api";

// ====== Types (khớp với BE) ======
export interface CategoryResponse {
  id: string;
  name: string;
  parentId?: string;
  parentName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  parentId?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  parentId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// ====== Service ======
const categoryService = {
  // GET /api/Category/GetAllCategories
  getAll: () =>
    api.get<ApiResponse<CategoryResponse[]>>("/Category/GetAllCategories"),

  // GET /api/Category/GetCategoryById/:id
  getById: (id: string) =>
    api.get<ApiResponse<CategoryResponse>>(`/Category/GetCategoryById/${id}`),

  // POST /api/Category/CreateCategory
  create: (data: CreateCategoryRequest) =>
    api.post<ApiResponse<CategoryResponse>>("/Category/CreateCategory", data),

  // PUT /api/Category/UpdateCategory/:id
  update: (id: string, data: UpdateCategoryRequest) =>
    api.put<ApiResponse<CategoryResponse>>(
      `/Category/UpdateCategory/${id}`,
      data,
    ),

  // DELETE /api/Category/DeleteCategory/:id
  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/Category/DeleteCategory/${id}`),
};

export default categoryService;
