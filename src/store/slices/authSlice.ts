import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService, {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserAuthInfo,
  UserProfile,
} from "../../services/authService";

// ====== State type ======
interface AuthState {
  user: UserAuthInfo | null;
  profile: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  // --- Forgot password flow ---
  forgotEmail: string; // email nhập ở ForgotPassword, truyền sang VerifyOTP
  resetOtp: string; // OTP nhập ở VerifyOTP, truyền sang ResetPassword
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  profile: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  loading: false,
  error: null,
  forgotEmail: "",
  resetOtp: "",
};

// ====== Async Thunks (gọi Service) ======

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const res = await authService.login(credentials);
      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      return { accessToken, refreshToken, user }; // user có kèm roleName
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Đăng nhập thất bại",
      );
    }
  },
);

export const googleLoginThunk = createAsyncThunk(
  "auth/googleLogin",
  async (credential: string, { rejectWithValue }) => {
    try {
      console.log("Sending Google credential to backend...");
      const res = await authService.googleLogin(credential);
      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Google login successful!");
      return { accessToken, refreshToken, user };
    } catch (err: any) {
      console.error("Google login error:", err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.message ||
        "Đăng nhập Google thất bại. Backend không thể xác thực Google token.";
      return rejectWithValue(errorMsg);
    }
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const res = await authService.register(data);
      return res.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Đăng ký thất bại");
    }
  },
);

export const getProfileThunk = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getProfile();
      return res.data.data; // UserProfile (full info)
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải thông tin",
      );
    }
  },
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("currentPage");
});

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.forgotPassword(email);
      return email; // trả lại email để lưu vào state
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể gửi OTP",
      );
    }
  },
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      await authService.resetPassword(data);
      return true;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Đặt lại mật khẩu thất bại",
      );
    }
  },
);

// ====== Slice ======
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setForgotEmail: (state, action: PayloadAction<string>) => {
      state.forgotEmail = action.payload;
    },
    setResetOtp: (state, action: PayloadAction<string>) => {
      state.resetOtp = action.payload;
    },
    clearResetFlow: (state) => {
      state.forgotEmail = "";
      state.resetOtp = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user; // lưu user kèm roleName ngay sau login
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // google login
      .addCase(googleLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
      })
      .addCase(googleLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getProfile (full profile)
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
      })

      // forgotPassword
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotEmail = action.payload; // lưu email vào store
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // resetPassword
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.forgotEmail = "";
        state.resetOtp = "";
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setForgotEmail, setResetOtp, clearResetFlow } =
  authSlice.actions;
export default authSlice.reducer;
