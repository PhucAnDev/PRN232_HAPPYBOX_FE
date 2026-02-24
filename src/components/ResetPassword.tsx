import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import logoImage from "figma:asset/a3fa2786d2f68b7a9dfd274d63677f4d0b0ab4f1.png";
import usePasswordReset from "../hooks/usePasswordReset";

interface ResetPasswordProps {
  onNavigate?: (page: string) => void;
}

export function ResetPassword({ onNavigate }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [localError, setLocalError] = useState("");
  const {
    resetPassword,
    resetFlow,
    loading: isLoading,
    error: apiError,
  } = usePasswordReset();

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Yếu", color: "bg-red-500" };
    if (strength <= 3)
      return { strength, label: "Trung bình", color: "bg-yellow-500" };
    if (strength <= 4) return { strength, label: "Tốt", color: "bg-blue-500" };
    return { strength, label: "Rất mạnh", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const validatePassword = () => {
    if (newPassword.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (newPassword !== confirmPassword) {
      return "Mật khẩu xác nhận không khớp";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    const validationError = validatePassword();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    const success = await resetPassword(newPassword, confirmPassword);
    if (success) {
      setIsSuccess(true);
      resetFlow();
      setTimeout(() => {
        onNavigate?.("login");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#B71C1C] relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1737054716083-000b1b2edfd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')`,
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C]/90 via-[#8B1538]/85 to-[#B71C1C]/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div>
            <img
              src={logoImage}
              alt="Tetdenroi.vn"
              className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity brightness-0 invert"
              onClick={() => onNavigate?.("home")}
            />
          </div>

          {/* Center Content */}
          <div className="space-y-6 max-w-md">
            <h2
              className="text-5xl font-bold leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Khởi Đầu Mới
              <br />
              An Toàn Hơn
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn. Sử dụng kết hợp chữ
              hoa, chữ thường, số và ký tự đặc biệt.
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <div className="h-1 w-16 bg-[#D4AF37] rounded-full"></div>
              <div className="h-1 w-8 bg-[#D4AF37]/50 rounded-full"></div>
              <div className="h-1 w-4 bg-[#D4AF37]/30 rounded-full"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/70">
            © 2026 TếtĐếnRồi.vn - Luxury Tet Gifts
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FFFDF5]">
        <div className="w-full max-w-xl">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img
              src={logoImage}
              alt="Tetdenroi.vn"
              className="h-12 w-auto mx-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onNavigate?.("home")}
            />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-10">
            {!isSuccess ? (
              <>
                {/* Header */}
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#B71C1C] to-[#8B1538] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <h2
                    className="text-4xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Đặt Lại Mật Khẩu
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Tạo mật khẩu mới cho tài khoản của bạn. Hãy đảm bảo mật khẩu
                    đủ mạnh để bảo vệ tài khoản.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Mật Khẩu Mới
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        className="pl-12 pr-12 py-7 border-2 border-gray-300 rounded-xl text-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Độ mạnh mật khẩu:
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              passwordStrength.strength <= 2
                                ? "text-red-600"
                                : passwordStrength.strength <= 3
                                  ? "text-yellow-600"
                                  : passwordStrength.strength <= 4
                                    ? "text-blue-600"
                                    : "text-green-600"
                            }`}
                          >
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-2 flex-1 rounded-full transition-all ${
                                level <= passwordStrength.strength
                                  ? passwordStrength.color
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Xác Nhận Mật Khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="pl-12 pr-12 py-7 border-2 border-gray-300 rounded-xl text-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Match Indicator */}
                    {confirmPassword && (
                      <div className="flex items-center gap-2">
                        {newPassword === confirmPassword ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">
                              Mật khẩu khớp
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-600 font-medium">
                              Mật khẩu không khớp
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Yêu cầu mật khẩu:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        {newPassword.length >= 8 ? (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        Ít nhất 8 ký tự
                      </li>
                      <li className="flex items-center gap-2">
                        {/[a-z]/.test(newPassword) &&
                        /[A-Z]/.test(newPassword) ? (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        Có chữ hoa và chữ thường
                      </li>
                      <li className="flex items-center gap-2">
                        {/\d/.test(newPassword) ? (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        Có ít nhất 1 số
                      </li>
                      <li className="flex items-center gap-2">
                        {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        Có ký tự đặc biệt (!@#$%^&*)
                      </li>
                    </ul>
                  </div>

                  {/* Error Messages */}
                  {(localError || apiError) && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                      <p className="text-sm text-red-700">
                        {localError || apiError}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !newPassword || !confirmPassword}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#B8962E] hover:to-[#9A7A25] text-white py-7 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang đặt lại...
                      </div>
                    ) : (
                      "Đặt Lại Mật Khẩu"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              // Success State
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-pulse">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2
                  className="text-3xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Thành Công!
                </h2>
                <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                  Mật khẩu của bạn đã được đặt lại thành công.
                </p>
                <div className="bg-[#FFFDF5] border-2 border-[#D4AF37] rounded-xl p-6 mb-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Bạn có thể sử dụng mật khẩu mới để đăng nhập vào tài khoản
                    của mình.
                  </p>
                </div>

                {/* Countdown */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6">
                  <p className="text-sm text-gray-600">
                    Đang chuyển đến trang đăng nhập sau{" "}
                    <span className="font-bold text-[#B71C1C]">3 giây</span>...
                  </p>
                </div>

                {/* Manual Login Button */}
                <Button
                  onClick={() => onNavigate?.("login")}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#B8962E] hover:to-[#9A7A25] text-white px-8 py-3 rounded-xl font-bold"
                >
                  Đăng Nhập Ngay
                </Button>
              </div>
            )}
          </div>

          {/* Help Text */}
          {!isSuccess && (
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Nhớ mật khẩu rồi?{" "}
                <button
                  onClick={() => onNavigate?.("login")}
                  className="text-[#B71C1C] hover:text-[#8B1538] font-medium hover:underline"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
