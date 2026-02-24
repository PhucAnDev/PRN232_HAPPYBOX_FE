import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Shield, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import logoImage from "figma:asset/a3fa2786d2f68b7a9dfd274d63677f4d0b0ab4f1.png";
import usePasswordReset from "../hooks/usePasswordReset";

interface VerifyOTPProps {
  onNavigate?: (page: string) => void;
}

export function VerifyOTP({ onNavigate }: VerifyOTPProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes (matches BE Redis TTL)
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { forgotEmail, forgotPassword, setOtp: storeOtp } = usePasswordReset();

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số");
      return;
    }

    setIsLoading(true);
    setError("");

    // Store OTP in Redux and proceed to reset password page
    // Actual OTP validation happens at the reset-password step via BE API
    storeOtp(otpValue);
    setIsLoading(false);
    onNavigate?.("reset-password");
  };

  const handleResend = async () => {
    if (!canResend || !forgotEmail) return;

    const success = await forgotPassword(forgotEmail);
    if (success) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setTimer(300);
      setCanResend(false);
      inputRefs.current[0]?.focus();
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
              Xác Thực
              <br />
              Bảo Mật
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Chúng tôi đã gửi mã OTP 6 số đến email của bạn. Vui lòng kiểm tra
              và nhập mã để tiếp tục.
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
              onClick={() => onNavigate?.("forgot-password")}
              className="flex items-center text-gray-600 hover:text-[#B71C1C] mb-8 group transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Quay lại</span>
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B71C1C] to-[#8B1538] rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2
                className="text-4xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Nhập Mã OTP
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi đã gửi mã xác thực 6 số đến
              </p>
              <p className="font-bold text-[#B71C1C] mt-1">
                {forgotEmail || "email của bạn"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* OTP Input */}
              <div>
                <div className="flex justify-center gap-3 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`w-14 h-16 text-center text-2xl font-bold border-2 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                        error
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                      }`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-center">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                {/* Timer */}
                <div className="text-center mt-4">
                  {timer > 0 ? (
                    <p className="text-sm text-gray-600">
                      Mã có hiệu lực trong{" "}
                      <span className="font-bold text-[#B71C1C]">
                        {formatTime(timer)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 font-medium">
                      Mã OTP đã hết hạn
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || otp.some((d) => !d)}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#B8962E] hover:to-[#9A7A25] text-white py-7 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Đang xác thực...
                  </div>
                ) : (
                  "Xác Nhận"
                )}
              </Button>

              {/* Resend Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`text-sm font-medium inline-flex items-center ${
                    canResend
                      ? "text-[#B71C1C] hover:text-[#8B1538] cursor-pointer hover:underline"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {canResend ? "Gửi lại mã OTP" : "Gửi lại mã OTP"}
                </button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 leading-relaxed">
                      <span className="font-bold">Mẹo:</span> Không nhận được
                      email? Vui lòng kiểm tra thư mục spam hoặc chờ vài phút
                      trước khi gửi lại.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Gặp vấn đề?{" "}
              <a
                href="#"
                className="text-[#B71C1C] hover:text-[#8B1538] font-medium hover:underline"
              >
                Liên hệ hỗ trợ
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
