import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  forgotPasswordThunk,
  resetPasswordThunk,
  setForgotEmail,
  setResetOtp,
  clearResetFlow,
  clearError,
} from "../store/slices/authSlice";

const usePasswordReset = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forgotEmail, resetOtp, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const forgotPassword = async (email: string): Promise<boolean> => {
    const result = await dispatch(forgotPasswordThunk(email));
    return forgotPasswordThunk.fulfilled.match(result);
  };

  const setOtp = (otp: string) => {
    dispatch(setResetOtp(otp));
  };

  const resetPassword = async (
    newPassword: string,
    confirmPassword: string,
  ): Promise<boolean> => {
    if (!forgotEmail || !resetOtp) return false;
    const result = await dispatch(
      resetPasswordThunk({
        email: forgotEmail,
        otp: resetOtp,
        newPassword,
        confirmPassword,
      }),
    );
    return resetPasswordThunk.fulfilled.match(result);
  };

  const resetFlow = () => {
    dispatch(clearResetFlow());
  };

  const storeForgotEmail = (email: string) => {
    dispatch(setForgotEmail(email));
  };

  const clearErr = () => {
    dispatch(clearError());
  };

  return {
    forgotEmail,
    resetOtp,
    loading,
    error,
    forgotPassword,
    setOtp,
    resetPassword,
    resetFlow,
    storeForgotEmail,
    clearError: clearErr,
  };
};

export default usePasswordReset;
