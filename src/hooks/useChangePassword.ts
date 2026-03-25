import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { changePasswordThunk, clearError } from "../store/slices/authSlice";

const useChangePassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const changePassword = async (
    password: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; message?: string }> => {
    const result = await dispatch(
      changePasswordThunk({
        password,
        newPassword,
        confirmPassword,
      }),
    );

    if (changePasswordThunk.fulfilled.match(result)) {
      return { success: true, message: result.payload };
    }

    if (changePasswordThunk.rejected.match(result)) {
      const message =
        (typeof result.payload === "string" && result.payload) ||
        "Đổi mật khẩu thất bại";
      return { success: false, message };
    }

    return { success: false, message: "Đổi mật khẩu thất bại" };
  };

  return {
    loading,
    error,
    changePassword,
    clearError: () => dispatch(clearError()),
  };
};

export default useChangePassword;
