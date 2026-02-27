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
  // GET /api/category/GetAllCategories
  getAll: () =>
    api.get<ApiResponse<CategoryResponse[]>>("/category/GetAllCategories"),

  // GET /api/category/GetCategoryById/:id
  getById: (id: string) =>
    api.get<ApiResponse<CategoryResponse>>(`/category/GetCategoryById/${id}`),

  // POST /api/category/CreateCategory
  create: (data: CreateCategoryRequest) =>
    api.post<ApiResponse<CategoryResponse>>("/category/CreateCategory", data),

  // PUT /api/category/UpdateCategory/:id
  update: (id: string, data: UpdateCategoryRequest) =>
    api.put<ApiResponse<CategoryResponse>>(
      `/category/UpdateCategory/${id}`,
      data,
    ),

  // DELETE /api/category/DeleteCategory/:id
  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/category/DeleteCategory/${id}`),
};

export default categoryService;
