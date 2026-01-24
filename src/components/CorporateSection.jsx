import { Building2, FileText, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
function CorporateSection({ onNavigate }) {
  return <section className="py-20 bg-gradient-to-br from-[#B71C1C] to-[#8B0000] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {
    /* Left: Content */
  }
          <div className="space-y-6">
            <div className="inline-flex items-center bg-[#D4AF37] px-4 py-2 rounded-full text-sm font-semibold">
              <Building2 className="h-4 w-4 mr-2" />
              DỊCH VỤ B2B
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quà Tặng Doanh Nghiệp & In Logo
            </h2>

            <p className="text-xl text-white/90 leading-relaxed">
              Giảm giá sỉ và in logo thương hiệu cho doanh nghiệp. 
              Hoàn hảo cho quà tri ân nhân viên, quà tặng khách hàng và sự kiện công ty.
            </p>

            {
    /* Benefits */
  }
            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="h-6 w-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Giảm Giá Số Lượng</h4>
                  <p className="text-white/80">Tiết kiệm đến 30% cho đơn hàng sỉ</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="h-6 w-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Hóa Đơn VAT</h4>
                  <p className="text-white/80">Đầy đủ chứng từ cho mua hàng doanh nghiệp</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Chất Lượng Cao Cấp</h4>
                  <p className="text-white/80">Bộ sưu tập được chọn lọc cho quà tặng doanh nghiệp</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
    size="lg"
    className="rounded-full text-lg px-8 py-6 font-semibold hover:scale-105 transition-transform"
    style={{ backgroundColor: "#D4AF37", color: "white" }}
    onClick={() => onNavigate?.("b2b")}
  >
                Nhận Báo Giá
              </Button>
            </div>
          </div>

          {
    /* Right: Image */
  }
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-2xl border-4 border-[#D4AF37]">
              <ImageWithFallback
    src="https://images.unsplash.com/photo-1625552185153-7a8d8f3794a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBnaWZ0JTIwYm94fGVufDF8fHx8MTc2ODA2MjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
    alt="Corporate Gifts"
    className="w-full h-[400px] object-cover"
  />
            </div>
            {
    /* Decorative Element */
  }
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#D4AF37] rounded-full opacity-20 blur-2xl" />
          </div>
        </div>
      </div>
    </section>;
}
function Award(props) {
  return <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>;
}
export {
  CorporateSection
};
