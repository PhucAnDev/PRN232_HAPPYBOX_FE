import api from "./api";

// ====== Types ======
export interface UserResponse {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  roleId: string;
  roleName?: string;
  taxCode?: string;
  companyName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// ====== Service ======
const userService = {
  // GET /api/users (if exists)
  getAll: () => api.get<ApiResponse<UserResponse[]>>("/users"),

  // GET /api/users/:id
  getById: (id: string) => api.get<ApiResponse<UserResponse>>(`/users/${id}`),

  // Helper: Get user display name with fallback
  getUserDisplayName: (user?: UserResponse | null): string => {
    if (!user) return "N/A";
    return user.fullName || user.username || user.email || "Unknown";
  },

  // Helper: Get initials for avatar
  getUserInitials: (user?: UserResponse | null): string => {
    if (!user || !user.fullName) return "??";
    const names = user.fullName.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return user.fullName.substring(0, 2).toUpperCase();
  },
};

export default userService;
