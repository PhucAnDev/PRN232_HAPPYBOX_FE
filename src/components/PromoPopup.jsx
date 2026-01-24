import { X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
function PromoPopup({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
    className="relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl"
    style={{
      background: `linear-gradient(135deg, var(--burgundy-dark) 0%, var(--burgundy) 100%)`
    }}
  >
        {
    /* Decorative Pattern */
  }
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="indochine" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="currentColor" />
                <path d="M 50 30 Q 40 50 50 70 Q 60 50 50 30" stroke="currentColor" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#indochine)" />
          </svg>
        </div>

        {
    /* Close Button */
  }
        <button
    onClick={onClose}
    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
  >
          <X className="h-5 w-5 text-white" />
        </button>

        {
    /* Content */
  }
        <div className="relative z-10 p-8 text-center">
          {
    /* Golden Blossom Decoration */
  }
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles className="h-8 w-8" style={{ color: "var(--champagne-gold)" }} />
            <div
    className="text-6xl"
    style={{
      background: `linear-gradient(135deg, var(--champagne-gold), var(--gold-light))`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    }}
  >
              ✿
            </div>
            <Sparkles className="h-8 w-8" style={{ color: "var(--champagne-gold)" }} />
          </div>

          {
    /* Title */
  }
          <h2
    className="text-3xl md:text-4xl font-serif mb-3"
    style={{ color: "var(--champagne-gold)" }}
  >
            Ưu Đãi Đặc Biệt
          </h2>
          <p className="text-xl text-white/90 mb-2">
            Early Bird Corporate Offer
          </p>
          <p className="text-white/70 mb-8">
            Đặt sớm - Nhận ngay ưu đãi doanh nghiệp lên đến
          </p>

          {
    /* Discount Badge */
  }
          <div
    className="inline-block px-8 py-4 rounded-full mb-8 shadow-xl"
    style={{
      background: `linear-gradient(135deg, var(--champagne-gold), var(--gold-metallic))`
    }}
  >
            <span className="text-5xl" style={{ color: "var(--burgundy-dark)" }}>
              25%
            </span>
          </div>

          {
    /* Email Capture */
  }
          <div className="space-y-4">
            <p className="text-white/90">
              Nhập email để nhận mã giảm giá ngay
            </p>
            <div className="flex gap-2">
              <Input
    type="email"
    placeholder="email@doanhnghiep.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="flex-1 bg-white/90 border-0 text-gray-900 placeholder:text-gray-500"
  />
              <Button
    onClick={() => {
      alert(`M\xE3 gi\u1EA3m gi\xE1 \u0111\xE3 \u0111\u01B0\u1EE3c g\u1EEDi \u0111\u1EBFn ${email}`);
      onClose();
    }}
    style={{
      backgroundColor: "var(--cream-bg)",
      color: "var(--burgundy-dark)"
    }}
  >
                Nhận mã
              </Button>
            </div>
          </div>

          {
    /* Fine Print */
  }
          <p className="text-xs text-white/60 mt-6">
            * Áp dụng cho đơn hàng doanh nghiệp từ 50 hộp trở lên
          </p>
          <p className="text-xs text-white/60">
            Chương trình có hiệu lực đến 31/01/2026
          </p>
        </div>

        {
    /* Bottom Decoration */
  }
        <div
    className="h-2"
    style={{
      background: `linear-gradient(90deg, var(--champagne-gold), var(--gold-light), var(--champagne-gold))`
    }}
  />
      </div>
    </div>;
}
export {
  PromoPopup
};
