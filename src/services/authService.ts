import api from "./api";

// ====== Request types (khớp với BE) ======
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}

export interface GoogleLoginRequest {
  credential: string;
}

export interface TokenModel {
  accessToken: string;
  refreshToken: string;
}

// ====== Response types (khớp với BE ApiResponse<T>) ======
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
}

// ====== Service ======
const authService = {
  // POST /api/auth/login
  login: (data: LoginRequest) =>
    api.post<ApiResponse<TokenResponse>>("/auth/login", data),

  // POST /api/auth/register
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<null>>("/auth/register", data),

  // POST /api/auth/google-login
  googleLogin: (credential: string) =>
    api.post<ApiResponse<TokenResponse>>("/auth/google-login", {
      credential,
    }),

  // POST /api/auth/forgot-password
  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>("/auth/forgot-password", { email }),

  // POST /api/auth/reset-password
  resetPassword: (data: ResetPasswordRequest) =>
    api.post<ApiResponse<null>>("/auth/reset-password", data),

  // POST /api/auth/refresh-token
  refreshToken: (token: TokenModel) =>
    api.post<ApiResponse<TokenResponse>>("/auth/refresh-token", token),

  // GET /api/auth/profile  (cần token)
  getProfile: () => api.get<ApiResponse<UserProfile>>("/auth/profile"),
};

export default authService;
