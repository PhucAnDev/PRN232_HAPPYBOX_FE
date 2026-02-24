import { useState } from "react";
import { ChevronRight, Heart, ShoppingCart, SlidersHorizontal, ChevronLeft, Star, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  category: string;
  origin: string;
  rating: number;
}

interface IndividualProductsProps {
  onNavigate?: (page: string) => void;
}

export function IndividualProducts({ onNavigate }: IndividualProductsProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([100000, 5000000]);
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const allProducts: Product[] = [
    {
      id: 1,
      name: "Rượu Vang Đỏ Cabernet Sauvignon",
      price: 850000,
      image: "https://images.unsplash.com/photo-1610631787813-9eeb1a2386cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Nhập khẩu",
      category: "Rượu Vang",
      origin: "Chile",
      rating: 5
    },
    {
      id: 2,
      name: "Hạt Macca Úc Nứt Vỏ (500g)",
      price: 250000,
      image: "https://images.unsplash.com/photo-1670941949362-4cd2b509158f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Organic",
      category: "Hạt Dinh Dưỡng",
      origin: "Nhập khẩu",
      rating: 5
    },
    {
      id: 3,
      name: "Trà Oolong Thượng Hạng",
      price: 300000,
      image: "https://images.unsplash.com/photo-1765153743376-6a87b3c3288b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "Trà Cao Cấp",
      origin: "Trong nước",
      rating: 5
    },
    {
      id: 4,
      name: "Socola Lindt Excellence Dark 85%",
      price: 180000,
      image: "https://images.unsplash.com/photo-1767510533183-425731f088a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Không đường",
      category: "Bánh Kẹo Nhập Khẩu",
      origin: "Pháp",
      rating: 5
    },
    {
      id: 5,
      name: "Mứt Gừng Thượng Hạng",
      price: 120000,
      image: "https://images.unsplash.com/photo-1587372267765-7ed350bb99ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "Mứt Tết",
      origin: "Trong nước",
      rating: 4
    },
    {
      id: 6,
      name: "Rượu Vang Trắng Chardonnay",
      price: 920000,
      image: "https://images.unsplash.com/photo-1534409385199-b60aa1bcffa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Nhập khẩu",
      category: "Rượu Vang",
      origin: "Pháp",
      rating: 5
    },
    {
      id: 7,
      name: "Hạt Điều Rang Muối (500g)",
      price: 190000,
      image: "https://images.unsplash.com/photo-1594900689460-fdad3599342c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "Hạt Dinh Dưỡng",
      origin: "Trong nước",
      rating: 5
    },
    {
      id: 8,
      name: "Mật Ong Rừng Organic (500ml)",
      price: 280000,
      image: "https://images.unsplash.com/photo-1645549826194-1956802d83c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Organic",
      category: "Mứt Tết",
      origin: "Trong nước",
      rating: 5
    },
    {
      id: 9,
      name: "Trà Sen Hồ Tây Premium",
      price: 380000,
      image: "https://images.unsplash.com/photo-1765153743376-6a87b3c3288b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "Trà Cao Cấp",
      origin: "Trong nước",
      rating: 5
    },
    {
      id: 10,
      name: "Rượu Vang Đỏ Bordeaux AOC",
      price: 1200000,
      originalPrice: 1500000,
      image: "https://images.unsplash.com/photo-1610631787813-9eeb1a2386cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Nhập khẩu",
      category: "Rượu Vang",
      origin: "Pháp",
      rating: 5
    },
    {
      id: 11,
      name: "Hạt Hạnh Nhân Mỹ (500g)",
      price: 220000,
      image: "https://images.unsplash.com/photo-1594900689460-fdad3599342c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Organic",
      category: "Hạt Dinh Dưỡng",
      origin: "Nhập khẩu",
      rating: 4
    },
    {
      id: 12,
      name: "Kẹo Ferrero Rocher T24",
      price: 350000,
      image: "https://images.unsplash.com/photo-1767510533183-425731f088a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "Bánh Kẹo Nhập Khẩu",
      origin: "Nhập khẩu",
      rating: 5
    },
    {
      id: 13,
      name: "Mứt Dừa Non Bến Tre",
      price: 150000,
      image: "https://images.unsplash.com/photo-1587372267765-7ed350bb99ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "Mứt Tết",
      origin: "Trong nước",
      rating: 5
    },
    {
      id: 14,
      name: "Trà Shan Tuyết Cổ Thụ",
      price: 450000,
      image: "https://images.unsplash.com/photo-1765153743376-6a87b3c3288b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Organic",
      category: "Trà Cao Cấp",
      origin: "Trong nước",
      rating: 5
    },
    {
      id: 15,
      name: "Hạt Óc Chó Mỹ (500g)",
      price: 280000,
      image: "https://images.unsplash.com/photo-1670941949362-4cd2b509158f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "Hạt Dinh Dưỡng",
      origin: "Nhập khẩu",
      rating: 5
    },
    {
      id: 16,
      name: "Rượu Vang Rosé Provence",
      price: 780000,
      image: "https://images.unsplash.com/photo-1534409385199-b60aa1bcffa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Nhập khẩu",
      category: "Rượu Vang",
      origin: "Pháp",
      rating: 5
    }
  ];

  const categories = ["Rượu Vang", "Hạt Dinh Dưỡng", "Trà Cao Cấp", "Bánh Kẹo Nhập Khẩu", "Mứt Tết"];
  const origins = ["Trong nước", "Nhập khẩu", "Hàn Quốc", "Pháp", "Chile"];

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    if (selectedOrigins.length > 0 && !selectedOrigins.includes(product.origin)) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleOrigin = (origin: string) => {
    setSelectedOrigins(prev =>
      prev.includes(origin) ? prev.filter(o => o !== origin) : [...prev, origin]
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-5xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Vật Phẩm Quà Tết Tự Chọn
            </h1>
            <p className="text-xl text-white/90">
              Chọn lựa từng món quà cao cấp để tạo nên giỏ quà riêng biệt
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Sort */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm">
              <button onClick={() => onNavigate?.("home")} className="text-gray-600 hover:text-[#B71C1C] transition-colors">
                Trang chủ
              </button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <button onClick={() => onNavigate?.("listing")} className="text-gray-600 hover:text-[#B71C1C] transition-colors">
                Quà Tết
              </button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-[#B71C1C] font-semibold">Sản phẩm lẻ</span>
            </nav>

            {/* Sort & Filter Toggle */}
            <div className="flex items-center space-x-4">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Lọc
              </Button>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
                >
                  <option value="featured">Nổi bật</option>
                  <option value="price-low">Giá: Thấp đến Cao</option>
                  <option value="price-high">Giá: Cao đến Thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="name">Tên: A-Z</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                {sortedProducts.length} sản phẩm
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showMobileFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 space-y-6">
              {/* Category Title */}
              <div className="pb-4 border-b-2 border-[#B71C1C]">
                <h3 className="text-xl font-bold text-[#B71C1C] flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Sản Phẩm Lẻ
                </h3>
                <p className="text-xs text-gray-500 mt-1">Individual Products</p>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#B71C1C]">■</span>
                  <span className="ml-2">Danh Mục</span>
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#B71C1C]"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Origin Filter */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#D4AF37]">■</span>
                  <span className="ml-2">Xuất Xứ</span>
                </h3>
                <div className="space-y-2">
                  {origins.map(origin => (
                    <label key={origin} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedOrigins.includes(origin)}
                        onChange={() => toggleOrigin(origin)}
                        className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">
                        {origin}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#B71C1C]">■</span>
                  <span className="ml-2">Khoảng Giá</span>
                </h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={100000}
                    max={5000000}
                    step={50000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategories.length > 0 || selectedOrigins.length > 0 || priceRange[0] !== 100000 || priceRange[1] !== 5000000) && (
                <Button
                  variant="outline"
                  className="w-full border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedOrigins([]);
                    setPriceRange([100000, 5000000]);
                  }}
                >
                  Xóa Bộ Lọc
                </Button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product, index) => (
                <>
                  {/* Product Card */}
                  <div
                    key={product.id}
                    onClick={() => onNavigate?.("product")}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold text-white bg-[#B71C1C]">
                          {product.badge}
                        </div>
                      )}

                      {/* Wishlist Heart */}
                      <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                        <Heart className="h-4 w-4 text-gray-700 hover:text-[#B71C1C] hover:fill-[#B71C1C] transition-colors" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] text-sm">
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="mb-2">
                        {renderStars(product.rating)}
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xl font-bold text-[#D4AF37]">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>

                      <Button className="w-full bg-[#B71C1C] hover:bg-[#8B1538] text-white font-semibold text-xs py-2 mt-auto">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Thêm Vào Giỏ
                      </Button>
                    </div>
                  </div>

                  {/* B2B Banner - Insert after 8th product */}
                  {index === 7 && (
                    <div
                      key="b2b-banner"
                      className="col-span-2 sm:col-span-3 lg:col-span-4 bg-gradient-to-r from-[#8B1538] via-[#B71C1C] to-[#D4AF37] rounded-lg p-8 my-4"
                    >
                      <div className="flex flex-col md:flex-row items-center justify-between text-white">
                        <div className="mb-6 md:mb-0 text-center md:text-left">
                          <h3
                            className="text-3xl font-bold mb-2"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            Cần Số Lượng Lớn?
                          </h3>
                          <p className="text-xl text-white/90">
                            Liên hệ để nhận giá ưu đãi doanh nghiệp
                          </p>
                        </div>
                        <Button
                          size="lg"
                          onClick={() => onNavigate?.("b2b")}
                          className="bg-white text-[#B71C1C] hover:bg-gray-100 font-bold px-8 py-6 text-lg"
                        >
                          Liên Hệ Ngay
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <ShoppingCart className="h-24 w-24 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 mb-6">
                  Vui lòng thử điều chỉnh bộ lọc của bạn
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedOrigins([]);
                    setPriceRange([100000, 5000000]);
                  }}
                  className="bg-[#B71C1C] hover:bg-[#8B1538] text-white"
                >
                  Xóa Tất Cả Bộ Lọc
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 pb-4">
                <nav className="inline-flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg border font-medium transition-all flex items-center gap-2 ${
                      currentPage === 1
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 hover:border-[#B71C1C] hover:text-[#B71C1C] hover:bg-red-50"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Trước</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                            currentPage === pageNumber
                              ? "bg-[#B71C1C] text-white shadow-lg transform scale-110"
                              : "bg-white text-gray-700 border border-gray-300 hover:border-[#D4AF37] hover:bg-[#FFFDF5] hover:text-[#B71C1C]"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg border font-medium transition-all flex items-center gap-2 ${
                      currentPage === totalPages
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 hover:border-[#B71C1C] hover:text-[#B71C1C] hover:bg-red-50"
                    }`}
                  >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
