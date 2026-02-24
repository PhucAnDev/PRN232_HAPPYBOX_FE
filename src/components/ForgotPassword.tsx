import { useState } from "react";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import logoImage from "figma:asset/a3fa2786d2f68b7a9dfd274d63677f4d0b0ab4f1.png";

interface ForgotPasswordProps {
  onNavigate?: (page: string) => void;
}

export function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      // Auto redirect to verify OTP page after 3 seconds
      setTimeout(() => {
        onNavigate?.("verify-otp");
      }, 3000);
    }, 1500);
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
              Đừng Lo Lắng
              <br />
              Chúng Tôi Hỗ Trợ Bạn
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Chỉ cần nhập email của bạn, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu ngay lập tức.
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
            {/* Back Button */}
            <button
              onClick={() => onNavigate?.("login")}
              className="flex items-center text-gray-600 hover:text-[#B71C1C] mb-8 group transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Quay lại đăng nhập</span>
            </button>

            {!isSubmitted ? (
              <>
                {/* Header */}
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#B71C1C] to-[#8B1538] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h2
                    className="text-4xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Quên Mật Khẩu?
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Nhập địa chỉ email đã đăng ký của bạn, chúng tôi sẽ gửi mã OTP để bạn có thể đặt lại mật khẩu.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Địa chỉ Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="pl-12 pr-4 py-7 border-2 border-gray-300 rounded-xl text-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#B8962E] hover:to-[#9A7A25] text-white py-7 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Đang gửi...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="h-5 w-5 mr-2" />
                        Gửi Mã OTP
                      </div>
                    )}
                  </Button>

                  {/* Info Box */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700 leading-relaxed">
                          Mã OTP sẽ được gửi đến email của bạn và có hiệu lực trong <span className="font-bold">10 phút</span>. Vui lòng kiểm tra cả thư mục spam.
                        </p>
                      </div>
                    </div>
                  </div>
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
                  Email Đã Được Gửi!
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Chúng tôi đã gửi mã OTP đến email:
                </p>
                <div className="bg-[#FFFDF5] border-2 border-[#D4AF37] rounded-xl p-4 mb-8 inline-block">
                  <p className="font-bold text-[#B71C1C] text-lg">{email}</p>
                </div>
                <p className="text-sm text-gray-500 mb-8">
                  Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để đặt lại mật khẩu.
                </p>
                
                {/* Countdown and redirect info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600">
                    Bạn sẽ được chuyển đến trang nhập mã OTP sau <span className="font-bold text-[#B71C1C]">3 giây</span>...
                  </p>
                </div>

                {/* Resend Link */}
                <div className="mt-6">
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-sm text-[#B71C1C] hover:text-[#8B1538] font-medium hover:underline"
                  >
                    Không nhận được email? Gửi lại
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Cần hỗ trợ?{" "}
              <a href="#" className="text-[#B71C1C] hover:text-[#8B1538] font-medium hover:underline">
                Liên hệ hỗ trợ khách hàng
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
