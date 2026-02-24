import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import logoImage from "figma:asset/a3fa2786d2f68b7a9dfd274d63677f4d0b0ab4f1.png";
import useAuth from "../hooks/useAuth";

interface LoginRegisterProps {
  onNavigate?: (page: string) => void;
  onLoginSuccess?: () => void;
}

export function LoginRegister({
  onNavigate,
  onLoginSuccess,
}: LoginRegisterProps) {
  const { login, googleLogin, register, loading, error, clearError } =
    useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerAddress, setRegisterAddress] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const role = await login({ email: loginEmail, password: loginPassword });
    if (role) {
      onLoginSuccess?.();
      if (role === "Admin") {
        onNavigate?.("admin");
      } else {
        onNavigate?.("home");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setRegisterSuccess("");

    // Validate password match
    if (registerPassword !== registerConfirmPassword) {
      return;
    }

    // Validate password strength
    if (registerPassword.length < 8) {
      return;
    }

    const success = await register({
      username: registerUsername,
      fullName: registerName,
      email: registerEmail,
      phone: registerPhone || undefined,
      address: registerAddress || undefined,
      password: registerPassword,
    });
    if (success) {
      setRegisterSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      // Reset form
      setRegisterUsername("");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPhone("");
      setRegisterAddress("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      // Switch to login tab after 2 seconds
      setTimeout(() => {
        setActiveTab("login");
        setRegisterSuccess("");
      }, 2000);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    clearError();
    if (!credentialResponse.credential) {
      console.error("No credential received from Google");
      return;
    }

    console.log(
      "Google credential received:",
      credentialResponse.credential?.substring(0, 50) + "...",
    );

    const role = await googleLogin(credentialResponse.credential);
    if (role) {
      onLoginSuccess?.();
      if (role === "Admin") {
        onNavigate?.("admin");
      } else {
        onNavigate?.("home");
      }
    } else {
      console.error("Google login failed - check backend logs");
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
              Trao Quà Tết
              <br />
              Gửi Yêu Thương
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Khám phá bộ sưu tập quà Tết cao cấp, mang đến niềm vui và sự thịnh
              vượng cho năm mới.
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
        <div className="w-full max-w-2xl">
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
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Tabs */}
            <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                  activeTab === "login"
                    ? "bg-[#B71C1C] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                  activeTab === "register"
                    ? "bg-[#B71C1C] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Đăng Ký
              </button>
            </div>

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <h2
                    className="text-3xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Chào Mừng Trở Lại
                  </h2>
                  <p className="text-gray-600">Đăng nhập để tiếp tục mua sắm</p>
                </div>

                {/* Email/Phone Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email hoặc Số điện thoại
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="pl-11 py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-11 pr-11 py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onNavigate?.("forgot-password")}
                    className="text-sm text-[#B71C1C] hover:text-[#8B1538] font-medium"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white py-6 text-lg font-bold rounded-lg shadow-lg disabled:opacity-60"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Hoặc đăng nhập bằng
                    </span>
                  </div>
                </div>

                {/* Social Login - Google */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      console.error("Google Login Failed");
                    }}
                    useOneTap
                    theme="outline"
                    size="large"
                    text="signin_with"
                    width="100%"
                  />
                </div>

                {/* Register Link */}
                <div className="text-center text-sm text-gray-600">
                  Bạn chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="text-[#B71C1C] hover:text-[#8B1538] font-bold"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <h2
                    className="text-3xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Tạo Tài Khoản
                  </h2>
                  <p className="text-gray-600">
                    Đăng ký để trải nghiệm mua sắm cao cấp
                  </p>
                </div>

                {/* Full Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="pl-11 py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                      maxLength={100}
                      required
                    />
                  </div>
                </div>

                {/* Username Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      placeholder="nguyen_van_a"
                      className="pl-11 py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                      maxLength={100}
                      required
                    />
                  </div>
                </div>

                {/* Email/Phone Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="pl-11 py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                      maxLength={100}
                      required
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="tel"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      placeholder="0912345678"
                      className="pl-11 py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                      maxLength={20}
                      pattern="[0-9]{10,11}"
                    />
                  </div>
                </div>

                {/* Address Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Địa chỉ
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={registerAddress}
                      onChange={(e) => setRegisterAddress(e.target.value)}
                      placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                      className="py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                      maxLength={250}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Tối thiểu 8 ký tự"
                      className="pl-11 pr-11 py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {registerPassword && registerPassword.length < 8 && (
                    <p className="text-xs text-red-500">
                      Mật khẩu phải có ít nhất 8 ký tự
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerConfirmPassword}
                      onChange={(e) =>
                        setRegisterConfirmPassword(e.target.value)
                      }
                      placeholder="Nhập lại mật khẩu"
                      className="pl-11 pr-11 py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {registerConfirmPassword &&
                    registerPassword !== registerConfirmPassword && (
                      <p className="text-xs text-red-500">
                        Mật khẩu xác nhận không khớp
                      </p>
                    )}
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#D4AF37]"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    Tôi đồng ý với{" "}
                    <a
                      href="#"
                      className="text-[#B71C1C] hover:text-[#8B1538] font-medium"
                    >
                      Điều khoản dịch vụ
                    </a>{" "}
                    và{" "}
                    <a
                      href="#"
                      className="text-[#B71C1C] hover:text-[#8B1538] font-medium"
                    >
                      Chính sách bảo mật
                    </a>
                  </label>
                </div>

                {/* Success message */}
                {registerSuccess && (
                  <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
                    ✓ {registerSuccess}
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Register Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white py-6 text-lg font-bold rounded-lg shadow-lg disabled:opacity-60"
                >
                  {loading ? "Đang đăng ký..." : "Đăng Ký Tài Khoản"}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Hoặc đăng ký bằng
                    </span>
                  </div>
                </div>

                {/* Social Register - Google */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      console.error("Google Login Failed");
                    }}
                    useOneTap
                    theme="outline"
                    size="large"
                    text="signup_with"
                    width="100%"
                  />
                </div>

                {/* Login Link */}
                <div className="text-center text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-[#B71C1C] hover:text-[#8B1538] font-bold"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Trust Badges */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-4">
              <span>🔒 Bảo mật SSL</span>
              <span>•</span>
              <span>✓ Thanh toán an toàn</span>
              <span>•</span>
              <span>⚡ Giao hàng nhanh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
