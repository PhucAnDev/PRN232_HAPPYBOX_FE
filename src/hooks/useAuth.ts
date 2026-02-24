import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  loginThunk,
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

  // Đăng nhập → trả về role để navigate
  const login = async (credentials: LoginRequest) => {
    const result = await dispatch(loginThunk(credentials));
    if (loginThunk.fulfilled.match(result)) {
      // Lấy profile sau khi login để biết role
      const profileResult = await dispatch(getProfileThunk());
      if (getProfileThunk.fulfilled.match(profileResult)) {
        return profileResult.payload.role; // trả về role: "Admin" | "User"
      }
    }
    return null;
  };

  const register = async (data: RegisterRequest) => {
    const result = await dispatch(registerThunk(data));
    return registerThunk.fulfilled.match(result);
  };

  const logout = async () => {
    await dispatch(logoutThunk());
  };

  const fetchProfile = () => dispatch(getProfileThunk());

  return {
    user,
    isLoggedIn: !!accessToken,
    isAdmin: user?.role === "Admin",
    loading,
    error,
    login,
    register,
    logout,
    fetchProfile,
    clearError: () => dispatch(clearError()),
  };
};

export default useAuth;
