import api from "./api";

// ====== Response wrapper (khớp với BE ApiResponse<T>) ======
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// ====== User info kèm token (từ BE TokenModel.User) ======
export interface UserAuthInfo {
  id: string;
  email: string;
  fullName: string;
  username: string;
  roleName: string; // "Admin" | "User"
  isActive: boolean;
}

// ====== Token response từ login/refresh (BE TokenModel) ======
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: UserAuthInfo; // BE trả kèm user info trong login response
}

// ====== Full profile từ GET /auth/profile (BE UserResponse) ======
export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  roleName: string;
  isActive: boolean;
  createdAt: string;
}

// ====== Request types (khớp với BE) ======
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string; // BE [Required]
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string; // BE: Otp [StringLength(6)]
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TokenModel {
  accessToken: string;
  refreshToken: string;
}

// ====== Service ======
const authService = {
  // POST /api/auth/login → trả về TokenResponse (có kèm user.roleName)
  login: (data: LoginRequest) =>
    api.post<ApiResponse<TokenResponse>>("/auth/login", data),

  // POST /api/auth/register
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<null>>("/auth/register", data),

  // POST /api/auth/google-login
  googleLogin: (credential: string) =>
    api.post<ApiResponse<TokenResponse>>("/auth/google-login", { credential }),

  // POST /api/auth/forgot-password
  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>("/auth/forgot-password", { email }),

  // POST /api/auth/reset-password
  resetPassword: (data: ResetPasswordRequest) =>
    api.post<ApiResponse<null>>("/auth/reset-password", data),

  // POST /api/ChangePassword
  changePassword: (data: ChangePasswordRequest) =>
    api.post<{ message: string }>("/ChangePassword", data),

  // POST /api/auth/refresh-token
  refreshToken: (token: TokenModel) =>
    api.post<ApiResponse<TokenResponse>>("/auth/refresh-token", token),

  // GET /api/auth/profile  (cần token)
  getProfile: () => api.get<ApiResponse<UserProfile>>("/auth/profile"),
};

export default authService;
