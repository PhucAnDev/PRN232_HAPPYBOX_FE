import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Chrome } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import logoImage from "figma:asset/a3fa2786d2f68b7a9dfd274d63677f4d0b0ab4f1.png";
function LoginRegister({ onNavigate, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login:", { loginEmail, loginPassword });
    if (loginEmail === "admin@gmail.com" && loginPassword === "12345") {
      onNavigate?.("admin");
    } else if (loginEmail === "user@gmail.com" && loginPassword === "12345") {
      onLoginSuccess?.();
      onNavigate?.("home");
    } else {
      alert("Email ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng!");
    }
  };
  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register:", { registerName, registerEmail, registerPassword });
  };
  return <div className="min-h-screen flex">
      {
    /* Left Side - Branding */
  }
      <div className="hidden lg:flex lg:w-1/2 bg-[#B71C1C] relative overflow-hidden">
        {
    /* Background Image */
  }
        <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1737054716083-000b1b2edfd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')`
    }}
  >
          {
    /* Dark Overlay */
  }
          <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C]/90 via-[#8B1538]/85 to-[#B71C1C]/90" />
        </div>

        {
    /* Content */
  }
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {
    /* Logo */
  }
          <div>
            <img
    src={logoImage}
    alt="Tetdenroi.vn"
    className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity brightness-0 invert"
    onClick={() => onNavigate?.("home")}
  />
          </div>

          {
    /* Center Content */
  }
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
              Khám phá bộ sưu tập quà Tết cao cấp, mang đến niềm vui và sự thịnh vượng
              cho năm mới.
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <div className="h-1 w-16 bg-[#D4AF37] rounded-full" />
              <div className="h-1 w-8 bg-[#D4AF37]/50 rounded-full" />
              <div className="h-1 w-4 bg-[#D4AF37]/30 rounded-full" />
            </div>
          </div>

          {
    /* Footer */
  }
          <div className="text-sm text-white/70">
            © 2026 TếtĐếnRồi.vn - Luxury Tet Gifts
          </div>
        </div>
      </div>

      {
    /* Right Side - Form */
  }
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FFFDF5]">
        <div className="w-full max-w-2xl">
          {
    /* Mobile Logo */
  }
          <div className="lg:hidden text-center mb-8">
            <img
    src={logoImage}
    alt="Tetdenroi.vn"
    className="h-12 w-auto mx-auto cursor-pointer hover:opacity-80 transition-opacity"
    onClick={() => onNavigate?.("home")}
  />
          </div>

          {
    /* Form Card */
  }
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {
    /* Tabs */
  }
            <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
              <button
    onClick={() => setActiveTab("login")}
    className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${activeTab === "login" ? "bg-[#B71C1C] text-white shadow-md" : "text-gray-600 hover:text-gray-900"}`}
  >
                Đăng Nhập
              </button>
              <button
    onClick={() => setActiveTab("register")}
    className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${activeTab === "register" ? "bg-[#B71C1C] text-white shadow-md" : "text-gray-600 hover:text-gray-900"}`}
  >
                Đăng Ký
              </button>
            </div>

            {
    /* Login Form */
  }
            {activeTab === "login" && <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <h2
    className="text-3xl font-bold text-gray-900 mb-2"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                    Chào Mừng Trở Lại
                  </h2>
                  <p className="text-gray-600">
                    Đăng nhập để tiếp tục mua sắm
                  </p>
                </div>

                {
    /* Email/Phone Input */
  }
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

                {
    /* Password Input */
  }
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
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {
    /* Forgot Password */
  }
                <div className="flex justify-end">
                  <a
    href="#"
    className="text-sm text-[#B71C1C] hover:text-[#8B1538] font-medium"
  >
                    Quên mật khẩu?
                  </a>
                </div>

                {
    /* Login Button */
  }
                <Button
    type="submit"
    className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white py-6 text-lg font-bold rounded-lg shadow-lg"
  >
                  Đăng Nhập
                </Button>

                {
    /* Divider */
  }
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Hoặc đăng nhập bằng
                    </span>
                  </div>
                </div>

                {
    /* Social Login */
  }
                <div>
                  <Button
    type="button"
    variant="outline"
    className="w-full py-6 border-2 border-gray-300 hover:border-[#B71C1C] hover:bg-gray-50"
  >
                    <Chrome className="h-5 w-5 mr-2" />
                    Google
                  </Button>
                </div>

                {
    /* Register Link */
  }
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
              </form>}

            {
    /* Register Form */
  }
            {activeTab === "register" && <form onSubmit={handleRegister} className="space-y-6">
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

                {
    /* Full Name Input */
  }
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
    type="text"
    value={registerName}
    onChange={(e) => setRegisterName(e.target.value)}
    placeholder="Nguyễn Văn A"
    className="pl-11 py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
    required
  />
                  </div>
                </div>

                {
    /* Email/Phone Input */
  }
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email hoặc Số điện thoại
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
    type="text"
    value={registerEmail}
    onChange={(e) => setRegisterEmail(e.target.value)}
    placeholder="example@email.com hoặc 0912345678"
    className="pl-11 py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
    required
  />
                  </div>
                </div>

                {
    /* Password Input */
  }
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mật khẩu
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
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {
    /* Confirm Password Input */
  }
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
    type={showConfirmPassword ? "text" : "password"}
    value={registerConfirmPassword}
    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
    placeholder="Nhập lại mật khẩu"
    className="pl-11 pr-11 py-6 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
    required
  />
                    <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
  >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {
    /* Terms & Conditions */
  }
                <div className="flex items-start space-x-2">
                  <input
    type="checkbox"
    id="terms"
    className="mt-1 w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#D4AF37]"
    required
  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-[#B71C1C] hover:text-[#8B1538] font-medium">
                      Điều khoản dịch vụ
                    </a>{" "}
                    và{" "}
                    <a href="#" className="text-[#B71C1C] hover:text-[#8B1538] font-medium">
                      Chính sách bảo mật
                    </a>
                  </label>
                </div>

                {
    /* Register Button */
  }
                <Button
    type="submit"
    className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white py-6 text-lg font-bold rounded-lg shadow-lg"
  >
                  Đăng Ký Tài Khoản
                </Button>

                {
    /* Divider */
  }
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Hoặc đăng ký bằng
                    </span>
                  </div>
                </div>

                {
    /* Social Register */
  }
                <div>
                  <Button
    type="button"
    variant="outline"
    className="w-full py-6 border-2 border-gray-300 hover:border-[#B71C1C] hover:bg-gray-50"
  >
                    <Chrome className="h-5 w-5 mr-2" />
                    Google
                  </Button>
                </div>

                {
    /* Login Link */
  }
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
              </form>}
          </div>

          {
    /* Trust Badges */
  }
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
    </div>;
}
export {
  LoginRegister
};
