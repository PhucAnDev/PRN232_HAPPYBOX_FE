import { useState } from "react";
import { ChevronRight, ChevronDown, Heart, ShoppingCart, SlidersHorizontal, ChevronLeft, Package } from "lucide-react";
import { Button } from "./ui/button";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "Bán Chạy" | "Mới" | "Giảm Giá";
  components: string; // Items included in the gift set
  material: string; // Box material
  hasWine: boolean;
  hasNuts: boolean;
  hasSnacks: boolean;
}

interface ProductListingProps {
  onNavigate?: (page: string) => void;
}

export function ProductListing({ onNavigate }: ProductListingProps) {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const allProducts: Product[] = [
    {
      id: 1,
      name: "Giỏ Quà Thịnh Vượng 01",
      price: 950000,
      originalPrice: 1200000,
      image: "https://images.unsplash.com/photo-1622153093514-4dd0078ac132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Bán Chạy",
      components: "Rượu Vang Chile, Hạt Macca, Trà Oolong",
      material: "Giỏ Mây",
      hasWine: true,
      hasNuts: true,
      hasSnacks: false
    },
    {
      id: 2,
      name: "Giỏ Quà Phú Quý Premium",
      price: 2800000,
      image: "https://images.unsplash.com/photo-1768224661768-7ba694d1422b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Mới",
      components: "Rượu Vang Pháp, Hạt Điều, Socola Lindt, Bánh Cookies",
      material: "Hộp Da",
      hasWine: true,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 3,
      name: "Giỏ Quà An Khang",
      price: 1350000,
      originalPrice: 1600000,
      image: "https://images.unsplash.com/photo-1761079989144-7ff17e97ef11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Giảm Giá",
      components: "Yến Sào, Nấm Đông Cô, Hạt Sen, Táo Đỏ",
      material: "Hộp Gỗ",
      hasWine: false,
      hasNuts: true,
      hasSnacks: false
    },
    {
      id: 4,
      name: "Giỏ Quà Tài Lộc Deluxe",
      price: 1850000,
      image: "https://images.unsplash.com/photo-1649789093457-3a973148fa27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Bán Chạy",
      components: "Rượu Vang Úc, Hạt Óc Chó, Kẹo Ferrero Rocher",
      material: "Hộp Gỗ",
      hasWine: true,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 5,
      name: "Giỏ Quà Sang Trọng 03",
      price: 680000,
      image: "https://images.unsplash.com/photo-1766727923624-2e8eede5aa8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      components: "Bánh Đặc Sản, Mứt Tết, Trà Sen",
      material: "Hộp Giấy",
      hasWine: false,
      hasNuts: false,
      hasSnacks: true
    },
    {
      id: 6,
      name: "Giỏ Quà Hạnh Phúc",
      price: 1200000,
      originalPrice: 1500000,
      image: "https://images.unsplash.com/photo-1625552187571-7ee60ac43d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Giảm Giá",
      components: "Rượu Vang Mỹ, Hạt Hỗn Hợp, Bánh Quy Bơ",
      material: "Giỏ Mây",
      hasWine: true,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 7,
      name: "Giỏ Quà Bình An",
      price: 850000,
      image: "https://images.unsplash.com/photo-1622153093514-4dd0078ac132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      components: "Hạt Điều, Nho Khô, Mứt Gừng, Trà Thái Nguyên",
      material: "Hộp Giấy",
      hasWine: false,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 8,
      name: "Giỏ Quà Vạn Lộc Premium",
      price: 3200000,
      image: "https://images.unsplash.com/photo-1761079989144-7ff17e97ef11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Mới",
      components: "Rượu Vang Ý, Caviar, Hạt Truffle, Socola Godiva",
      material: "Hộp Da",
      hasWine: true,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 9,
      name: "Giỏ Quà Như Ý",
      price: 1450000,
      image: "https://images.unsplash.com/photo-1768224661768-7ba694d1422b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Bán Chạy",
      components: "Hạt Macadamia, Hạt Hạnh Nhân, Trái Cây Sấy",
      material: "Hộp Gỗ",
      hasWine: false,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 10,
      name: "Giỏ Quà Xuân Sum Vầy",
      price: 1100000,
      image: "https://images.unsplash.com/photo-1649789093457-3a973148fa27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      components: "Rượu Vang Đỏ, Bánh Kẹo Cao Cấp, Mứt Tết",
      material: "Giỏ Mây",
      hasWine: true,
      hasNuts: false,
      hasSnacks: true
    },
    {
      id: 11,
      name: "Giỏ Quà Phát Tài",
      price: 2200000,
      originalPrice: 2600000,
      image: "https://images.unsplash.com/photo-1625552187571-7ee60ac43d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Giảm Giá",
      components: "Rượu Vang Úc, Hạt Óc Chó, Socola Ferrero, Trà Shan Tuyết",
      material: "Hộp Da",
      hasWine: true,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 12,
      name: "Giỏ Quà Truyền Thống",
      price: 580000,
      image: "https://images.unsplash.com/photo-1766727923624-2e8eede5aa8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      components: "Bánh Tét, Mứt Gừng, Mứt Dừa, Trà Sen",
      material: "Hộp Giấy",
      hasWine: false,
      hasNuts: false,
      hasSnacks: true
    }
  ];

  const priceRanges = [
    { label: "Dưới 500k", min: 0, max: 500000 },
    { label: "500k - 1 triệu", min: 500000, max: 1000000 },
    { label: "1 - 2 triệu", min: 1000000, max: 2000000 },
    { label: "Trên 2 triệu", min: 2000000, max: Infinity }
  ];

  const materials = ["Hộp Da", "Hộp Gỗ", "Giỏ Mây", "Hộp Giấy"];
  const components = ["Có Rượu Vang", "Hạt Dinh Dưỡng", "Bánh Kẹo"];

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    if (selectedPriceRanges.length > 0) {
      const inRange = selectedPriceRanges.some(range => {
        const priceRange = priceRanges.find(r => r.label === range);
        return priceRange && product.price >= priceRange.min && product.price < priceRange.max;
      });
      if (!inRange) return false;
    }
    
    if (selectedMaterials.length > 0 && !selectedMaterials.includes(product.material)) {
      return false;
    }
    
    if (selectedComponents.length > 0) {
      const hasRequiredComponents = selectedComponents.every(comp => {
        if (comp === "Có Rượu Vang") return product.hasWine;
        if (comp === "Hạt Dinh Dưỡng") return product.hasNuts;
        if (comp === "Bánh Kẹo") return product.hasSnacks;
        return false;
      });
      if (!hasRequiredComponents) return false;
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const togglePriceRange = (range: string) => {
    setSelectedPriceRanges(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
    );
  };

  const toggleComponent = (component: string) => {
    setSelectedComponents(prev =>
      prev.includes(component) ? prev.filter(c => c !== component) : [...prev, component]
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              Bộ Sưu Tập Giỏ Quà Tết 2026
            </h1>
            <p className="text-xl text-white/90">
              Khám phá những giỏ quà cao cấp mang đến tài lộc và thịnh vượng
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
              <span className="text-[#B71C1C] font-semibold">Giỏ quà</span>
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
                  <Package className="h-5 w-5 mr-2" />
                  Giỏ Quà
                </h3>
                <p className="text-xs text-gray-500 mt-1">Gift Sets Collection</p>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#D4AF37]">■</span>
                  <span className="ml-2">Khoảng Giá</span>
                </h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.label} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(range.label)}
                        onChange={() => togglePriceRange(range.label)}
                        className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#B71C1C]">■</span>
                  <span className="ml-2">Chất Liệu Hộp</span>
                </h3>
                <div className="space-y-2">
                  {materials.map(material => (
                    <label key={material} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material)}
                        onChange={() => toggleMaterial(material)}
                        className="w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#B71C1C]"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">
                        {material}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Component Filter */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#D4AF37]">■</span>
                  <span className="ml-2">Thành Phần</span>
                </h3>
                <div className="space-y-2">
                  {components.map(component => (
                    <label key={component} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedComponents.includes(component)}
                        onChange={() => toggleComponent(component)}
                        className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">
                        {component}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedPriceRanges.length > 0 || selectedMaterials.length > 0 || selectedComponents.length > 0) && (
                <Button
                  variant="outline"
                  className="w-full border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
                  onClick={() => {
                    setSelectedPriceRanges([]);
                    setSelectedMaterials([]);
                    setSelectedComponents([]);
                  }}
                >
                  Xóa Bộ Lọc
                </Button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product, index) => (
                <>
                  {/* Product Card */}
                  <div
                    key={product.id}
                    onClick={() => onNavigate?.("product")}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Badge */}
                      {product.badge && (
                        <div
                          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                            product.badge === "Bán Chạy"
                              ? "bg-[#B71C1C]"
                              : product.badge === "Mới"
                              ? "bg-[#D4AF37]"
                              : "bg-green-600"
                          }`}
                        >
                          {product.badge}
                        </div>
                      )}

                      {/* Wishlist Heart */}
                      <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                        <Heart className="h-5 w-5 text-gray-700 hover:text-[#B71C1C] hover:fill-[#B71C1C] transition-colors" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3
                        className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {product.name}
                      </h3>
                      
                      {/* Components Summary */}
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8">
                        {product.components}
                      </p>
                      
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-[#D4AF37]">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>

                      <Button className="w-full bg-[#B71C1C] hover:bg-[#8B1538] text-white font-bold mt-auto">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Thêm Vào Giỏ
                      </Button>
                    </div>
                  </div>

                  {/* B2B Banner - Insert after 6th product */}
                  {index === 5 && (
                    <div
                      key="b2b-banner"
                      className="col-span-1 sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-[#8B1538] via-[#B71C1C] to-[#D4AF37] rounded-lg p-8 my-4"
                    >
                      <div className="flex flex-col md:flex-row items-center justify-between text-white">
                        <div className="mb-6 md:mb-0 text-center md:text-left">
                          <h3
                            className="text-3xl font-bold mb-2"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            Quà Tặng Doanh Nghiệp?
                          </h3>
                          <p className="text-xl text-white/90">
                            Nhận giá sỉ & in logo miễn phí cho đơn từ 50 hộp
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
                    setSelectedPriceRanges([]);
                    setSelectedMaterials([]);
                    setSelectedComponents([]);
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