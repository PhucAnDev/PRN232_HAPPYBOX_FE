import { useState } from "react";
import { ChevronRight, Heart, ShoppingCart, SlidersHorizontal, ChevronLeft, Star, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
function IndividualProducts({ onNavigate }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [priceRange, setPriceRange] = useState([1e5, 5e6]);
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const allProducts = [
    {
      id: 1,
      name: "R\u01B0\u1EE3u Vang \u0110\u1ECF Cabernet Sauvignon",
      price: 85e4,
      image: "https://images.unsplash.com/photo-1610631787813-9eeb1a2386cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Nh\u1EADp kh\u1EA9u",
      category: "R\u01B0\u1EE3u Vang",
      origin: "Chile",
      rating: 5
    },
    {
      id: 2,
      name: "H\u1EA1t Macca \xDAc N\u1EE9t V\u1ECF (500g)",
      price: 25e4,
      image: "https://images.unsplash.com/photo-1670941949362-4cd2b509158f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Organic",
      category: "H\u1EA1t Dinh D\u01B0\u1EE1ng",
      origin: "Nh\u1EADp kh\u1EA9u",
      rating: 5
    },
    {
      id: 3,
      name: "Tr\xE0 Oolong Th\u01B0\u1EE3ng H\u1EA1ng",
      price: 3e5,
      image: "https://images.unsplash.com/photo-1765153743376-6a87b3c3288b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "Tr\xE0 Cao C\u1EA5p",
      origin: "Trong n\u01B0\u1EDBc",
      rating: 5
    },
    {
      id: 4,
      name: "Socola Lindt Excellence Dark 85%",
      price: 18e4,
      image: "https://images.unsplash.com/photo-1767510533183-425731f088a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Kh\xF4ng \u0111\u01B0\u1EDDng",
      category: "B\xE1nh K\u1EB9o Nh\u1EADp Kh\u1EA9u",
      origin: "Ph\xE1p",
      rating: 5
    },
    {
      id: 5,
      name: "M\u1EE9t G\u1EEBng Th\u01B0\u1EE3ng H\u1EA1ng",
      price: 12e4,
      image: "https://images.unsplash.com/photo-1587372267765-7ed350bb99ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "M\u1EE9t T\u1EBFt",
      origin: "Trong n\u01B0\u1EDBc",
      rating: 4
    },
    {
      id: 6,
      name: "R\u01B0\u1EE3u Vang Tr\u1EAFng Chardonnay",
      price: 92e4,
      image: "https://images.unsplash.com/photo-1534409385199-b60aa1bcffa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Nh\u1EADp kh\u1EA9u",
      category: "R\u01B0\u1EE3u Vang",
      origin: "Ph\xE1p",
      rating: 5
    },
    {
      id: 7,
      name: "H\u1EA1t \u0110i\u1EC1u Rang Mu\u1ED1i (500g)",
      price: 19e4,
      image: "https://images.unsplash.com/photo-1594900689460-fdad3599342c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "H\u1EA1t Dinh D\u01B0\u1EE1ng",
      origin: "Trong n\u01B0\u1EDBc",
      rating: 5
    },
    {
      id: 8,
      name: "M\u1EADt Ong R\u1EEBng Organic (500ml)",
      price: 28e4,
      image: "https://images.unsplash.com/photo-1645549826194-1956802d83c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Organic",
      category: "M\u1EE9t T\u1EBFt",
      origin: "Trong n\u01B0\u1EDBc",
      rating: 5
    },
    {
      id: 9,
      name: "Tr\xE0 Sen H\u1ED3 T\xE2y Premium",
      price: 38e4,
      image: "https://images.unsplash.com/photo-1765153743376-6a87b3c3288b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "Tr\xE0 Cao C\u1EA5p",
      origin: "Trong n\u01B0\u1EDBc",
      rating: 5
    },
    {
      id: 10,
      name: "R\u01B0\u1EE3u Vang \u0110\u1ECF Bordeaux AOC",
      price: 12e5,
      originalPrice: 15e5,
      image: "https://images.unsplash.com/photo-1610631787813-9eeb1a2386cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Nh\u1EADp kh\u1EA9u",
      category: "R\u01B0\u1EE3u Vang",
      origin: "Ph\xE1p",
      rating: 5
    },
    {
      id: 11,
      name: "H\u1EA1t H\u1EA1nh Nh\xE2n M\u1EF9 (500g)",
      price: 22e4,
      image: "https://images.unsplash.com/photo-1594900689460-fdad3599342c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Organic",
      category: "H\u1EA1t Dinh D\u01B0\u1EE1ng",
      origin: "Nh\u1EADp kh\u1EA9u",
      rating: 4
    },
    {
      id: 12,
      name: "K\u1EB9o Ferrero Rocher T24",
      price: 35e4,
      image: "https://images.unsplash.com/photo-1767510533183-425731f088a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "B\xE1nh K\u1EB9o Nh\u1EADp Kh\u1EA9u",
      origin: "Nh\u1EADp kh\u1EA9u",
      rating: 5
    },
    {
      id: 13,
      name: "M\u1EE9t D\u1EEBa Non B\u1EBFn Tre",
      price: 15e4,
      image: "https://images.unsplash.com/photo-1587372267765-7ed350bb99ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "M\u1EE9t T\u1EBFt",
      origin: "Trong n\u01B0\u1EDBc",
      rating: 5
    },
    {
      id: 14,
      name: "Tr\xE0 Shan Tuy\u1EBFt C\u1ED5 Th\u1EE5",
      price: 45e4,
      image: "https://images.unsplash.com/photo-1765153743376-6a87b3c3288b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Organic",
      category: "Tr\xE0 Cao C\u1EA5p",
      origin: "Trong n\u01B0\u1EDBc",
      rating: 5
    },
    {
      id: 15,
      name: "H\u1EA1t \xD3c Ch\xF3 M\u1EF9 (500g)",
      price: 28e4,
      image: "https://images.unsplash.com/photo-1670941949362-4cd2b509158f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      category: "H\u1EA1t Dinh D\u01B0\u1EE1ng",
      origin: "Nh\u1EADp kh\u1EA9u",
      rating: 5
    },
    {
      id: 16,
      name: "R\u01B0\u1EE3u Vang Ros\xE9 Provence",
      price: 78e4,
      image: "https://images.unsplash.com/photo-1534409385199-b60aa1bcffa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Nh\u1EADp kh\u1EA9u",
      category: "R\u01B0\u1EE3u Vang",
      origin: "Ph\xE1p",
      rating: 5
    }
  ];
  const categories = ["R\u01B0\u1EE3u Vang", "H\u1EA1t Dinh D\u01B0\u1EE1ng", "Tr\xE0 Cao C\u1EA5p", "B\xE1nh K\u1EB9o Nh\u1EADp Kh\u1EA9u", "M\u1EE9t T\u1EBFt"];
  const origins = ["Trong n\u01B0\u1EDBc", "Nh\u1EADp kh\u1EA9u", "H\xE0n Qu\u1ED1c", "Ph\xE1p", "Chile"];
  const filteredProducts = allProducts.filter((product) => {
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
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });
  const toggleCategory = (category) => {
    setSelectedCategories(
      (prev) => prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };
  const toggleOrigin = (origin) => {
    setSelectedOrigins(
      (prev) => prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin]
    );
  };
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VN\u0110";
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const renderStars = (rating) => {
    return <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => <Star
      key={star}
      className={`h-4 w-4 ${star <= rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-300"}`}
    />)}
      </div>;
  };
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return <div className="min-h-screen bg-[#FFFDF5]">
      {
    /* Page Header Banner */
  }
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

      {
    /* Breadcrumb & Sort */
  }
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {
    /* Breadcrumb */
  }
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

            {
    /* Sort & Filter Toggle */
  }
            <div className="flex items-center space-x-4">
              {
    /* Mobile Filter Toggle */
  }
              <Button
    variant="outline"
    className="lg:hidden"
    onClick={() => setShowMobileFilters(!showMobileFilters)}
  >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Lọc
              </Button>

              {
    /* Sort Dropdown */
  }
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

      {
    /* Main Content */
  }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {
    /* Sidebar Filters */
  }
          <aside
    className={`lg:w-64 flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}
  >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 space-y-6">
              {
    /* Category Title */
  }
              <div className="pb-4 border-b-2 border-[#B71C1C]">
                <h3 className="text-xl font-bold text-[#B71C1C] flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Sản Phẩm Lẻ
                </h3>
                <p className="text-xs text-gray-500 mt-1">Individual Products</p>
              </div>

              {
    /* Category Filter */
  }
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#B71C1C]">■</span>
                  <span className="ml-2">Danh Mục</span>
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => <label key={category} className="flex items-center cursor-pointer group">
                      <input
    type="checkbox"
    checked={selectedCategories.includes(category)}
    onChange={() => toggleCategory(category)}
    className="w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#B71C1C]"
  />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">
                        {category}
                      </span>
                    </label>)}
                </div>
              </div>

              {
    /* Origin Filter */
  }
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#D4AF37]">■</span>
                  <span className="ml-2">Xuất Xứ</span>
                </h3>
                <div className="space-y-2">
                  {origins.map((origin) => <label key={origin} className="flex items-center cursor-pointer group">
                      <input
    type="checkbox"
    checked={selectedOrigins.includes(origin)}
    onChange={() => toggleOrigin(origin)}
    className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
  />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">
                        {origin}
                      </span>
                    </label>)}
                </div>
              </div>

              {
    /* Price Range Filter */
  }
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#B71C1C]">■</span>
                  <span className="ml-2">Khoảng Giá</span>
                </h3>
                <div className="space-y-4">
                  <Slider
    value={priceRange}
    onValueChange={setPriceRange}
    min={1e5}
    max={5e6}
    step={5e4}
    className="w-full"
  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {
    /* Clear Filters */
  }
              {(selectedCategories.length > 0 || selectedOrigins.length > 0 || priceRange[0] !== 1e5 || priceRange[1] !== 5e6) && <Button
    variant="outline"
    className="w-full border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
    onClick={() => {
      setSelectedCategories([]);
      setSelectedOrigins([]);
      setPriceRange([1e5, 5e6]);
    }}
  >
                  Xóa Bộ Lọc
                </Button>}
            </div>
          </aside>

          {
    /* Product Grid */
  }
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product, index) => <>
                  {
    /* Product Card */
  }
                  <div
    key={product.id}
    onClick={() => onNavigate?.("product")}
    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
  >
                    {
    /* Image Container */
  }
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  />
                      
                      {
    /* Badge */
  }
                      {product.badge && <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold text-white bg-[#B71C1C]">
                          {product.badge}
                        </div>}

                      {
    /* Wishlist Heart */
  }
                      <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                        <Heart className="h-4 w-4 text-gray-700 hover:text-[#B71C1C] hover:fill-[#B71C1C] transition-colors" />
                      </button>
                    </div>

                    {
    /* Product Info */
  }
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] text-sm">
                        {product.name}
                      </h3>
                      
                      {
    /* Rating */
  }
                      <div className="mb-2">
                        {renderStars(product.rating)}
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xl font-bold text-[#D4AF37]">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && <div className="text-xs text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>}
                      </div>

                      <Button className="w-full bg-[#B71C1C] hover:bg-[#8B1538] text-white font-semibold text-xs py-2 mt-auto">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Thêm Vào Giỏ
                      </Button>
                    </div>
                  </div>

                  {
    /* B2B Banner - Insert after 8th product */
  }
                  {index === 7 && <div
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
                    </div>}
                </>)}
            </div>

            {
    /* No Results */
  }
            {sortedProducts.length === 0 && <div className="text-center py-16">
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
      setPriceRange([1e5, 5e6]);
    }}
    className="bg-[#B71C1C] hover:bg-[#8B1538] text-white"
  >
                  Xóa Tất Cả Bộ Lọc
                </Button>
              </div>}

            {
    /* Pagination */
  }
            {totalPages > 1 && <div className="flex justify-center items-center mt-12 pb-4">
                <nav className="inline-flex items-center gap-2">
                  {
    /* Previous Button */
  }
                  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded-lg border font-medium transition-all flex items-center gap-2 ${currentPage === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:border-[#B71C1C] hover:text-[#B71C1C] hover:bg-red-50"}`}
  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Trước</span>
                  </button>

                  {
    /* Page Numbers */
  }
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;
    return <button
      key={pageNumber}
      onClick={() => handlePageChange(pageNumber)}
      className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === pageNumber ? "bg-[#B71C1C] text-white shadow-lg transform scale-110" : "bg-white text-gray-700 border border-gray-300 hover:border-[#D4AF37] hover:bg-[#FFFDF5] hover:text-[#B71C1C]"}`}
    >
                          {pageNumber}
                        </button>;
  })}
                  </div>

                  {
    /* Next Button */
  }
                  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-2 rounded-lg border font-medium transition-all flex items-center gap-2 ${currentPage === totalPages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:border-[#B71C1C] hover:text-[#B71C1C] hover:bg-red-50"}`}
  >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>}
          </div>
        </div>
      </div>
    </div>;
}
export {
  IndividualProducts
};
