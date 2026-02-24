import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  loginThunk,
  googleLoginThunk,
  registerThunk,
  logoutThunk,
  getProfileThunk,
  clearError,
} from "../store/slices/authSlice";
import type { LoginRequest, RegisterRequest } from "../services/authService";

// ====== useAuth Hook ======
// Component chỉ cần import hook này, không cần biết Redux hay Service
const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, accessToken, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  // Đăng nhập → user.roleName đã có trong response, không cần gọi /profile
  const login = async (credentials: LoginRequest) => {
    const result = await dispatch(loginThunk(credentials));
    if (loginThunk.fulfilled.match(result)) {
      return result.payload.user.roleName; // "Admin" | "User"
    }
    return null;
  };

  const register = async (data: RegisterRequest) => {
    const result = await dispatch(registerThunk(data));
    return registerThunk.fulfilled.match(result);
  };

  const googleLogin = async (credential: string) => {
    const result = await dispatch(googleLoginThunk(credential));
    if (googleLoginThunk.fulfilled.match(result)) {
      return result.payload.user.roleName; // "Admin" | "Customer"
    }
    return null;
  };

  const logout = async () => {
    await dispatch(logoutThunk());
  };

  return {
    user,
    isLoggedIn: !!accessToken,
    isAdmin: user?.roleName === "Admin",
    loading,
    error,
    login,
    googleLogin,
    register,
    logout,
    fetchProfile: () => dispatch(getProfileThunk()),
    clearError: () => dispatch(clearError()),
  };
};

export default useAuth;
