import { Facebook, Instagram, Mail, Phone, MapPin, CreditCard } from "lucide-react";
import logoImage from "figma:asset/a3fa2786d2f68b7a9dfd274d63677f4d0b0ab4f1.png";
function Footer() {
  return <footer className="bg-[#8B0000] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {
    /* Column 1: About */
  }
          <div>
            <img
    src={logoImage}
    alt="Tetdenroi.vn"
    className="h-20 w-auto mb-4"
    style={{ filter: "brightness(0) saturate(100%) invert(88%) sepia(18%) saturate(1043%) hue-rotate(358deg) brightness(101%) contrast(87%)" }}
  />
            <p className="text-white/80 mb-6 leading-relaxed">
              Hộp quà Tết cao cấp và giải pháp quà tặng doanh nghiệp. 
              Tôn vinh truyền thống với sự sang trọng và tinh tế.
            </p>
            <div className="flex space-x-4">
              <a
    href="#"
    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4AF37] flex items-center justify-center transition-colors"
  >
                <Facebook className="h-5 w-5" />
              </a>
              <a
    href="#"
    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4AF37] flex items-center justify-center transition-colors"
  >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {
    /* Column 2: About Us */
  }
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">
              Về Chúng Tôi
            </h4>
            <ul className="space-y-3 text-white/80">
              <li>
                <a href="#" className="hover:text-[#D4AF37] transition-colors">
                  Câu Chuyện
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D4AF37] transition-colors">
                  Tại Sao Chọn Chúng Tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D4AF37] transition-colors">
                  Đối Tác Doanh Nghiệp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D4AF37] transition-colors">
                  Tuyển Dụng
                </a>
              </li>
            </ul>
          </div>

          {
    /* Column 3: Customer Support */
  }
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-3 text-white/80">
              <li>
                <a href="#" className="hover:text-[#D4AF37] transition-colors">
                  Tra Cứu Đơn Hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D4AF37] transition-colors">
                  Chính Sách Giao Hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D4AF37] transition-colors">
                  Đổi Trả & Hoàn Tiền
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D4AF37] transition-colors">
                  Câu Hỏi Thường Gặp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D4AF37] transition-colors">
                  Liên Hệ
                </a>
              </li>
            </ul>
          </div>

          {
    /* Column 4: Contact & Payment */
  }
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">
              Thông Tin Liên Hệ
            </h4>
            <ul className="space-y-3 text-white/80 mb-6">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-[#D4AF37]" />
                <span>123 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-[#D4AF37]" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-[#D4AF37]" />
                <span>support@tetdenroi.vn</span>
              </li>
            </ul>

            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">
              Phương Thức Thanh Toán
            </h4>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white rounded px-3 py-2 text-[#B71C1C] text-sm font-semibold">
                MoMo
              </div>
              <div className="bg-white rounded px-3 py-2 text-[#B71C1C] text-sm font-semibold flex items-center">
                <CreditCard className="h-4 w-4 mr-1" />
                Ngân hàng
              </div>
              <div className="bg-white rounded px-3 py-2 text-[#B71C1C] text-sm font-semibold">
                COD
              </div>
            </div>
          </div>
        </div>

        {
    /* Bottom Bar */
  }
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © 2026 Tetdenroi.vn. Bảo lưu mọi quyền.
            </p>
            <div className="flex space-x-6 text-sm text-white/60">
              <a href="#" className="hover:text-[#D4AF37] transition-colors">
                Chính Sách Bảo Mật
              </a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">
                Điều Khoản Dịch Vụ
              </a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">
                Sơ Đồ Trang
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}
export {
  Footer
};
