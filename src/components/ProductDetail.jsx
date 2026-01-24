import { useState } from "react";
import { ChevronRight, Minus, Plus, ShoppingCart, Truck, Award, RefreshCw, Star } from "lucide-react";
import { Button } from "./ui/button";
function ProductDetail({ onNavigate }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const productImages = [
    "https://images.unsplash.com/photo-1761479267954-983e006443f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWQlMjBnaWZ0JTIwYm94fGVufDF8fHx8MTc2Nzk2ODYxNXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1615212995098-3c2aebfff863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwd2luZSUyMGdpZnQlMjBzZXR8ZW58MXx8fHwxNzY4MDY1NzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1580364545822-71c817ec6c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmb29kJTIwaGFtcGVyfGVufDF8fHx8MTc2Nzk5MzYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1759563874833-d8f97cef9d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZ2lmdCUyMHBhY2thZ2luZ3xlbnwxfHx8fDE3NjgwNjU3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  ];
  const relatedProducts = [
    {
      id: 1,
      name: "H\u1ED9p Qu\xE0 Ph\xFA Qu\xFD Premium",
      price: "1,800,000 VND",
      image: "https://images.unsplash.com/photo-1761479267954-983e006443f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
      id: 2,
      name: "B\u1ED9 Qu\xE0 T\u1EBFt An Khang",
      price: "1,200,000 VND",
      image: "https://images.unsplash.com/photo-1580364545822-71c817ec6c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
      id: 3,
      name: "Set Qu\xE0 Th\u1ECBnh V\u01B0\u1EE3ng",
      price: "2,500,000 VND",
      image: "https://images.unsplash.com/photo-1615212995098-3c2aebfff863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
      id: 4,
      name: "Hamper Sang Tr\u1ECDng Deluxe",
      price: "3,200,000 VND",
      image: "https://images.unsplash.com/photo-1759563874833-d8f97cef9d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    }
  ];
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => prev > 1 ? prev - 1 : 1);
  return <div className="min-h-screen bg-[#FFFDF5]">
      {
    /* Breadcrumb Navigation */
  }
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="#" className="text-gray-600 hover:text-[#B71C1C] transition-colors">
              Trang chủ
            </a>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <a href="#" className="text-gray-600 hover:text-[#B71C1C] transition-colors">
              Quà Tết
            </a>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Hộp Quà Phú Quý 2026</span>
          </nav>
        </div>
      </div>

      {
    /* Main Product Section */
  }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {
    /* Left Column - Image Gallery */
  }
          <div className="space-y-4">
            {
    /* Main Image */
  }
            <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
              <img
    src={productImages[selectedImage]}
    alt="Main product"
    className="w-full h-full object-cover"
  />
            </div>

            {
    /* Thumbnail Carousel */
  }
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => <button
    key={index}
    onClick={() => setSelectedImage(index)}
    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? "border-[#D4AF37] shadow-md" : "border-gray-200 hover:border-[#D4AF37]/50"}`}
  >
                  <img
    src={image}
    alt={`Thumbnail ${index + 1}`}
    className="w-full h-full object-cover"
  />
                </button>)}
            </div>
          </div>

          {
    /* Right Column - Product Info */
  }
          <div className="space-y-6">
            {
    /* Product Title */
  }
            <div>
              <h1
    className="text-4xl font-bold text-gray-900 mb-2"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                Hộp Quà Phú Quý 2026
              </h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => <Star
    key={i}
    className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]"
  />)}
                </div>
                <span className="text-gray-600">(128 đánh giá)</span>
              </div>
            </div>

            {
    /* Price */
  }
            <div className="border-t border-b border-gray-200 py-4">
              <div className="text-4xl font-bold text-[#D4AF37]">
                1,500,000 VND
              </div>
              <div className="text-sm text-gray-500 line-through mt-1">
                1,800,000 VND
              </div>
            </div>

            {
    /* Stock Status */
  }
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-green-700 font-medium">Còn hàng</span>
            </div>

            {
    /* Short Description */
  }
            <p className="text-gray-700 leading-relaxed">
              Bộ quà tặng cao cấp Phú Quý là sự kết hợp hoàn hảo giữa truyền thống 
              và sang trọng. Được thiết kế đặc biệt cho doanh nghiệp và đối tác 
              quan trọng, mang đến thông điệp tài lộc và thịnh vượng trong năm mới.
            </p>

            {
    /* B2B Feature - Logo Printing */
  }
            <div className="bg-gradient-to-r from-[#8B1538]/10 to-[#D4AF37]/10 border border-[#D4AF37] rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    Dịch vụ Doanh nghiệp
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    In logo công ty, báo giá sỉ từ 50 hộp trở lên
                  </p>
                  <Button
    variant="outline"
    className="border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
  >
                    Yêu cầu In Logo / Báo Giá Sỉ
                  </Button>
                </div>
              </div>
            </div>

            {
    /* Quantity Selector */
  }
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Số lượng:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
    onClick={decrementQuantity}
    className="p-3 hover:bg-gray-100 transition-colors"
  >
                    <Minus className="h-4 w-4 text-gray-700" />
                  </button>
                  <div className="px-6 py-2 font-bold text-gray-900">
                    {quantity}
                  </div>
                  <button
    onClick={incrementQuantity}
    className="p-3 hover:bg-gray-100 transition-colors"
  >
                    <Plus className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              </div>

              {
    /* Action Buttons */
  }
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
    className="flex-1 bg-[#B71C1C] hover:bg-[#8B1538] text-white py-6 text-lg font-bold rounded-lg shadow-lg"
  >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Thêm Vào Giỏ
                </Button>
                <Button
    onClick={() => onNavigate && onNavigate("checkout")}
    className="flex-1 bg-[#D4AF37] hover:bg-[#B8962E] text-white py-6 text-lg font-bold rounded-lg shadow-lg"
  >
                  Mua Ngay
                </Button>
              </div>
            </div>

            {
    /* Trust Badges */
  }
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <Truck className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    Giao Hàng Nhanh
                  </div>
                  <div className="text-xs text-gray-600">
                    Miễn phí toàn quốc
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    Hàng Chính Hãng
                  </div>
                  <div className="text-xs text-gray-600">
                    100% nhập khẩu
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RefreshCw className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    Đổi Trả Dễ Dàng
                  </div>
                  <div className="text-xs text-gray-600">
                    Trong 7 ngày
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {
    /* Tabs Section */
  }
        <div className="mt-16">
          {
    /* Tab Headers */
  }
          <div className="border-b border-gray-300">
            <div className="flex space-x-8">
              <button
    onClick={() => setActiveTab("description")}
    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === "description" ? "text-[#B71C1C]" : "text-gray-600 hover:text-gray-900"}`}
  >
                Mô Tả
                {activeTab === "description" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B71C1C]" />}
              </button>
              <button
    onClick={() => setActiveTab("components")}
    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === "components" ? "text-[#B71C1C]" : "text-gray-600 hover:text-gray-900"}`}
  >
                Danh Sách Thành Phần
                {activeTab === "components" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B71C1C]" />}
              </button>
              <button
    onClick={() => setActiveTab("reviews")}
    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === "reviews" ? "text-[#B71C1C]" : "text-gray-600 hover:text-gray-900"}`}
  >
                Đánh Giá (128)
                {activeTab === "reviews" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B71C1C]" />}
              </button>
            </div>
          </div>

          {
    /* Tab Content */
  }
          <div className="py-8 bg-white rounded-lg mt-4 px-8">
            {activeTab === "description" && <div className="prose max-w-none">
                <h3
    className="text-2xl font-bold text-gray-900 mb-4"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                  Về Sản Phẩm
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hộp quà Phú Quý 2026 là biểu tượng của sự thịnh vượng và sang trọng. 
                  Được thiết kế với màu đỏ burgundy cao cấp và điểm nhấn vàng ánh kim, 
                  bộ quà này không chỉ mang giá trị vật chất mà còn chứa đựng ý nghĩa 
                  văn hóa sâu sắc của người Việt.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mỗi món quà trong set được tuyển chọn kỹ lưỡng từ các thương hiệu 
                  nổi tiếng, đảm bảo chất lượng cao cấp và đẳng cấp quốc tế. Phù hợp 
                  để tặng đối tác kinh doanh, khách hàng VIP, hoặc người thân trong 
                  dịp Tết Nguyên Đán.
                </p>
                <div className="bg-[#FFFDF5] border-l-4 border-[#D4AF37] p-4 my-6">
                  <p className="text-gray-800 italic">
                    "Món quà không chỉ là vật phẩm, mà là thông điệp về sự trân trọng 
                    và tôn kính dành cho người nhận."
                  </p>
                </div>
              </div>}

            {activeTab === "components" && <div>
                <h3
    className="text-2xl font-bold text-gray-900 mb-6"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                  Thành Phần Trong Hộp Quà
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4 p-4 bg-[#FFFDF5] rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Rượu Vang Nhập Khẩu</h4>
                      <p className="text-sm text-gray-600">
                        Bordeaux AOC, Pháp - Chai 750ml
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-[#FFFDF5] rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Hạt Macadamia Úc</h4>
                      <p className="text-sm text-gray-600">
                        Rang muối - Hộp 250g cao cấp
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-[#FFFDF5] rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Trà Ô Long Đài Loan</h4>
                      <p className="text-sm text-gray-600">
                        Ali Shan Premium - Hộp 100g
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-[#FFFDF5] rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Mứt Tết Cao Cấp</h4>
                      <p className="text-sm text-gray-600">
                        Set 4 loại mứt truyền thống
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-[#FFFDF5] rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Bánh Cookies Butter</h4>
                      <p className="text-sm text-gray-600">
                        Jenny's Premium - Hộp thiếc 200g
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-[#FFFDF5] rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                      6
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Hộp Gỗ Sang Trọng</h4>
                      <p className="text-sm text-gray-600">
                        Thiết kế velvet đỏ, có thể in logo
                      </p>
                    </div>
                  </div>
                </div>
              </div>}

            {activeTab === "reviews" && <div>
                <h3
    className="text-2xl font-bold text-gray-900 mb-6"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                  Đánh Giá Từ Khách Hàng
                </h3>
                <div className="space-y-6">
                  {
    /* Review 1 */
  }
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                        N
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">Nguyễn Văn A</h4>
                          <span className="text-sm text-gray-500">15/01/2026</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => <Star
    key={i}
    className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]"
  />)}
                        </div>
                        <p className="text-gray-700">
                          Hộp quà rất đẹp và sang trọng, giao hàng đúng hẹn. 
                          Dịch vụ in logo rất chuyên nghiệp. Chắc chắn sẽ đặt lại 
                          cho năm sau!
                        </p>
                      </div>
                    </div>
                  </div>

                  {
    /* Review 2 */
  }
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#B71C1C] rounded-full flex items-center justify-center text-white font-bold">
                        T
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">Trần Thị B</h4>
                          <span className="text-sm text-gray-500">12/01/2026</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => <Star
    key={i}
    className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]"
  />)}
                        </div>
                        <p className="text-gray-700">
                          Đã mua 100 hộp cho công ty tặng đối tác. Chất lượng 
                          xuất sắc, đóng gói cẩn thận. Đội ngũ support rất nhiệt tình.
                        </p>
                      </div>
                    </div>
                  </div>

                  {
    /* Review 3 */
  }
                  <div className="pb-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                        L
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">Lê Hoàng C</h4>
                          <span className="text-sm text-gray-500">10/01/2026</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(4)].map((_, i) => <Star
    key={i}
    className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]"
  />)}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <p className="text-gray-700">
                          Sản phẩm tốt, đóng gói đẹp. Tuy nhiên giá hơi cao một chút. 
                          Nhưng nhìn chung vẫn xứng đáng với chất lượng.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
          </div>
        </div>

        {
    /* Related Products */
  }
        <div className="mt-16">
          <h2
    className="text-3xl font-bold text-gray-900 mb-8 text-center"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
            Sản Phẩm Liên Quan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => <div
    key={product.id}
    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
  >
                <div className="aspect-square overflow-hidden">
                  <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="text-xl font-bold text-[#D4AF37]">
                    {product.price}
                  </div>
                  <Button
    className="w-full mt-4 bg-[#B71C1C] hover:bg-[#8B1538] text-white"
  >
                    Xem Chi Tiết
                  </Button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}
export {
  ProductDetail
};
