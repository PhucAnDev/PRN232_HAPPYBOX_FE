import { Package, Percent, Truck, FileText, CheckCircle, Download, Phone, Mail, MapPin, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useMemo } from "react";

interface B2BLandingProps {
  onNavigate?: (page: string) => void;
}

export function B2BLanding({ onNavigate }: B2BLandingProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    taxCode: "",
    product: "",
    quantity: "",
    message: ""
  });

  // Product catalog with prices
  const products = [
    { id: "hop-phu-quy", name: "Hộp Quà Phú Quý Premium", price: 1500000 },
    { id: "hop-thinh-vuong", name: "Hộp Quà Thịnh Vượng Deluxe", price: 2500000 },
    { id: "hop-an-khang", name: "Hộp Quà An Khang Classic", price: 850000 },
    { id: "hop-dai-phat", name: "Hộp Quà Đại Phát Executive", price: 3200000 },
    { id: "hop-loc-phat", name: "Hộp Quà Lộc Phát Standard", price: 650000 },
  ];

  // Discount tiers
  const getDiscountTier = (qty: number) => {
    if (qty >= 500) return { rate: 0.30, label: "Giảm 30%" };
    if (qty >= 200) return { rate: 0.20, label: "Giảm 20%" };
    if (qty >= 100) return { rate: 0.15, label: "Giảm 15%" };
    if (qty >= 50) return { rate: 0.10, label: "Giảm 10%" };
    return { rate: 0, label: "Chưa đủ điều kiện" };
  };

  // Calculate pricing
  const pricingCalculation = useMemo(() => {
    const selectedProduct = products.find(p => p.id === formData.product);
    const quantity = parseInt(formData.quantity) || 0;
    
    if (!selectedProduct || quantity === 0) {
      return null;
    }

    const unitPrice = selectedProduct.price;
    const subtotal = unitPrice * quantity;
    const discountTier = getDiscountTier(quantity);
    const discountAmount = subtotal * discountTier.rate;
    const finalTotal = subtotal - discountAmount;

    return {
      productName: selectedProduct.name,
      unitPrice,
      quantity,
      subtotal,
      discountTier,
      discountAmount,
      finalTotal
    };
  }, [formData.product, formData.quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Cảm ơn bạn! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.");
  };

  return (
    <div className="bg-[#FFFDF5]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-[#B71C1C] to-[#8B0000] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1689152496131-9cecc95cde25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBoYW5kc2hha2UlMjBnaWZ0fGVufDF8fHx8MTc2ODIyNjYwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Business Partnership"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#B71C1C]/90 via-[#B71C1C]/70 to-[#B71C1C]/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37] text-[#D4AF37] px-6 py-2 rounded-full text-sm font-semibold mb-6">
              <Award className="h-4 w-4 mr-2" />
              DỊCH VỤ DOANH NGHIỆP
            </div>
            
            <h1 
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight" 
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Giải Pháp Quà Tết<br />
              Doanh Nghiệp Trọn Gói
            </h1>
            
            <p className="text-xl md:text-2xl mb-4 text-white/95 font-medium">
              Chiết khấu cao tới 30% - Thiết kế & In ấn Logo theo yêu cầu
            </p>

            <p className="text-lg mb-8 text-white/80 leading-relaxed max-w-2xl">
              Tạo dấu ấn thương hiệu với bộ quà Tết cao cấp được cá nhân hóa. 
              Dịch vụ chuyên nghiệp từ tư vấn, thiết kế đến giao hàng toàn quốc.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                size="lg"
                className="rounded-full text-lg px-10 py-7 font-semibold hover:scale-105 transition-transform shadow-lg"
                style={{ backgroundColor: "#D4AF37", color: "white" }}
                onClick={() => {
                  document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Nhận Báo Giá Ngay
              </Button>
              <Button
                size="lg"
                className="rounded-full text-lg px-10 py-7 font-semibold bg-white text-[#B71C1C] hover:bg-white/90"
              >
                <Download className="h-5 w-5 mr-2" />
                Tải Catalogue 2026
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FFFDF5] to-transparent"></div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl font-bold text-[#B71C1C] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ưu Điểm Vượt Trội
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Giải pháp toàn diện cho nhu cầu quà tặng doanh nghiệp của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit 1 */}
            <div className="bg-[#FFFDF5] rounded-2xl p-8 text-center hover:shadow-xl transition-shadow border border-[#D4AF37]/20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#B71C1C]/10 mb-6">
                <Package className="h-10 w-10 text-[#B71C1C]" />
              </div>
              <h3 className="text-xl font-bold text-[#B71C1C] mb-3">
                In Logo Doanh Nghiệp
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Thiết kế và in logo độc quyền lên bao bì, tạo dấu ấn thương hiệu chuyên nghiệp
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-[#FFFDF5] rounded-2xl p-8 text-center hover:shadow-xl transition-shadow border border-[#D4AF37]/20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#D4AF37]/10 mb-6">
                <Percent className="h-10 w-10 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-[#B71C1C] mb-3">
                Chiết Khấu Hấp Dẫn
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Giảm giá lên đến 30% cho đơn hàng số lượng lớn, tiết kiệm ngân sách đáng kể
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-[#FFFDF5] rounded-2xl p-8 text-center hover:shadow-xl transition-shadow border border-[#D4AF37]/20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#B71C1C]/10 mb-6">
                <Truck className="h-10 w-10 text-[#B71C1C]" />
              </div>
              <h3 className="text-xl font-bold text-[#B71C1C] mb-3">
                Giao Hàng Đa Điểm
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Vận chuyển đến nhiều địa điểm khác nhau, phù hợp với chi nhánh và đối tác
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-[#FFFDF5] rounded-2xl p-8 text-center hover:shadow-xl transition-shadow border border-[#D4AF37]/20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#D4AF37]/10 mb-6">
                <FileText className="h-10 w-10 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-[#B71C1C] mb-3">
                Xuất Hóa Đơn VAT
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Hỗ trợ đầy đủ chứng từ, hóa đơn VAT hợp lệ cho doanh nghiệp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Branding Showcase */}
      <section className="py-20 bg-gradient-to-br from-[#FFFDF5] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              <div className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                TÙY CHỈNH THƯƠNG HIỆU
              </div>
              
              <h2 
                className="text-4xl md:text-5xl font-bold text-[#B71C1C] mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Nâng Tầm Thương Hiệu<br />
                Với Quà Tặng Độc Quyền
              </h2>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Mỗi sản phẩm đều được cá nhân hóa theo thương hiệu của bạn, 
                từ thiết kế đến in ấn logo chất lượng cao. Tạo ấn tượng mạnh mẽ 
                và khẳng định đẳng cấp doanh nghiệp.
              </p>

              {/* Process Steps */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#B71C1C] mb-1">Thiết Kế Logo</h4>
                    <p className="text-gray-600">Gửi logo hoặc yêu cầu thiết kế mới theo phong cách doanh nghiệp</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-[#B71C1C] mb-1">Duyệt Mẫu</h4>
                    <p className="text-gray-600">Xem và phê duyệt thiết kế trước khi tiến hành in ấn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-[#B71C1C] mb-1">In Ấn & Giao Hàng</h4>
                    <p className="text-gray-600">Sản xuất và vận chuyển đến đúng địa điểm theo yêu cầu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759563874745-47e35c0a9572?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwYnJhbmRpbmclMjBtb2NrdXB8ZW58MXx8fHwxNzY4MjI2NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Custom Branded Gift Box"
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Before/After Label */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-bold text-gray-900">Logo Doanh Nghiệp Của Bạn</span>
                  </div>
                </div>
              </div>

              {/* Decorative Gold Border */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-[#D4AF37] rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Request Form */}
      <section id="quote-form" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl md:text-5xl font-bold text-[#B71C1C] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Gửi Yêu Cầu Báo Giá
            </h2>
            <p className="text-xl text-gray-600">
              Để lại thông tin, chúng tôi sẽ liên hệ tư vấn trong 24h
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Side - Contact Info */}
            <div className="lg:col-span-2 bg-gradient-to-r from-[#8B1538] via-[#B71C1C] to-[#D4AF37] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Thông Tin Liên Hệ
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Hotline B2B</h4>
                    <p className="text-white/90">1900 8888 (8:00 - 21:00)</p>
                    <p className="text-white/90">0909 123 456</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-white/90">b2b@tetdenroi.vn</p>
                    <p className="text-white/90">doanhnghiep@tetdenroi.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Văn Phòng</h4>
                    <p className="text-white/90">
                      123 Nguyễn Huệ, Q.1,<br />
                      TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <h4 className="font-semibold mb-3">Giờ Làm Việc</h4>
                <p className="text-white/90">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                <p className="text-white/90">Thứ 7: 8:00 - 12:00</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3 bg-[#FFFDF5] rounded-2xl p-8 border border-[#D4AF37]/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Họ và tên người liên hệ <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tên Doanh nghiệp <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    placeholder="Công ty TNHH ABC"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>

                {/* Tax Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mã số thuế
                  </label>
                  <Input
                    type="text"
                    name="taxCode"
                    value={formData.taxCode}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Số điện thoại người đại diện <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="0909 123 456"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="example@company.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                    />
                  </div>
                </div>

                {/* Product Selection - NEW FIELD */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Sản phẩm quan tâm <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 bg-white"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.price.toLocaleString()}đ)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity - Modified for specific numbers */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Số lượng dự kiến <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="Nhập số lượng (VD: 200)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>

                {/* DYNAMIC CALCULATION CARD */}
                {pricingCalculation && (
                  <div className="bg-[#FFFDF5] rounded-xl p-6 border-2 border-[#D4AF37] shadow-lg">
                    {/* Header with Discount Badge */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#D4AF37]/30">
                      <span className="text-sm font-semibold text-gray-700">
                        Áp dụng mức chiết khấu doanh nghiệp (Số lượng {pricingCalculation.quantity >= 50 ? `> ${pricingCalculation.quantity >= 500 ? '500' : pricingCalculation.quantity >= 200 ? '200' : pricingCalculation.quantity >= 100 ? '100' : '50'}` : '< 50'}):
                      </span>
                      <span className="inline-block px-4 py-2 rounded-full text-sm font-bold" style={{
                        backgroundColor: pricingCalculation.discountTier.rate > 0 ? '#22c55e' : '#ef4444',
                        color: 'white'
                      }}>
                        {pricingCalculation.discountTier.label}
                      </span>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      {/* Unit Price */}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Đơn giá gốc:</span>
                        <span className="font-semibold text-gray-900">
                          {pricingCalculation.unitPrice.toLocaleString()}đ
                        </span>
                      </div>

                      {/* Subtotal */}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Tổng giá trị (x{pricingCalculation.quantity}):</span>
                        <span className="font-semibold text-gray-900">
                          {pricingCalculation.subtotal.toLocaleString()}đ
                        </span>
                      </div>

                      {/* Savings */}
                      {pricingCalculation.discountAmount > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Tiết kiệm được:</span>
                          <span className="font-bold text-[#B71C1C]">
                            -{pricingCalculation.discountAmount.toLocaleString()}đ
                          </span>
                        </div>
                      )}

                      {/* Divider */}
                      <div className="border-t-2 border-[#D4AF37]/50 pt-3 mt-3">
                        {/* Final Total */}
                        <div className="flex justify-between items-center">
                          <span className="text-base font-bold text-gray-900">
                            Thành tiền dự kiến (Chưa VAT):
                          </span>
                          <span 
                            className="text-3xl font-bold"
                            style={{ 
                              fontFamily: "'Playfair Display', serif",
                              color: '#B71C1C' 
                            }}
                          >
                            {pricingCalculation.finalTotal.toLocaleString()}đ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Note */}
                    <div className="mt-4 pt-4 border-t border-[#D4AF37]/30">
                      <p className="text-xs text-gray-600 text-center italic">
                        💡 Giá trên là ước tính. Báo giá chính thức sẽ được gửi sau khi xem xét yêu cầu của bạn.
                      </p>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nội dung yêu cầu
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Vui lòng cho chúng tôi biết thêm về yêu cầu của bạn: loại sản phẩm, thời gian giao hàng, yêu cầu in logo..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full text-lg py-6 rounded-lg font-semibold hover:scale-[1.02] transition-transform"
                  style={{ backgroundColor: "#D4AF37", color: "white" }}
                >
                  Gửi Yêu Cầu & Giữ Giá Tốt
                </Button>

                <p className="text-sm text-gray-600 text-center">
                  Bằng cách gửi form, bạn đồng ý với{" "}
                  <a href="#" className="text-[#B71C1C] underline">Chính sách bảo mật</a> của chúng tôi
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Trusted Partners */}
      <section className="py-16 bg-[#FFFDF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-center text-[#B71C1C] mb-12">
            Đối Tác Tin Cậy Của Chúng Tôi
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {/* Placeholder Company Logos */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-center h-20 bg-white rounded-lg shadow-sm border border-gray-200 px-4">
                <div className="text-gray-400 font-bold text-lg">
                  COMPANY {i}
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                500+
              </div>
              <p className="text-gray-600">Doanh nghiệp đồng hành</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                50,000+
              </div>
              <p className="text-gray-600">Đơn hàng hoàn thành</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                98%
              </div>
              <p className="text-gray-600">Khách hàng hài lòng</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}