import { useState } from "react";
import { ChevronRight, Heart, ShoppingCart, SlidersHorizontal, ChevronLeft, Package } from "lucide-react";
import { Button } from "../../components/ui/button";
function ProductListing({ onNavigate }) {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const allProducts = [
    {
      id: 1,
      name: "Gi\u1ECF Qu\xE0 Th\u1ECBnh V\u01B0\u1EE3ng 01",
      price: 95e4,
      originalPrice: 12e5,
      image: "https://images.unsplash.com/photo-1622153093514-4dd0078ac132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "B\xE1n Ch\u1EA1y",
      components: "R\u01B0\u1EE3u Vang Chile, H\u1EA1t Macca, Tr\xE0 Oolong",
      material: "Gi\u1ECF M\xE2y",
      hasWine: true,
      hasNuts: true,
      hasSnacks: false
    },
    {
      id: 2,
      name: "Gi\u1ECF Qu\xE0 Ph\xFA Qu\xFD Premium",
      price: 28e5,
      image: "https://images.unsplash.com/photo-1768224661768-7ba694d1422b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "M\u1EDBi",
      components: "R\u01B0\u1EE3u Vang Ph\xE1p, H\u1EA1t \u0110i\u1EC1u, Socola Lindt, B\xE1nh Cookies",
      material: "H\u1ED9p Da",
      hasWine: true,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 3,
      name: "Gi\u1ECF Qu\xE0 An Khang",
      price: 135e4,
      originalPrice: 16e5,
      image: "https://images.unsplash.com/photo-1761079989144-7ff17e97ef11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Gi\u1EA3m Gi\xE1",
      components: "Y\u1EBFn S\xE0o, N\u1EA5m \u0110\xF4ng C\xF4, H\u1EA1t Sen, T\xE1o \u0110\u1ECF",
      material: "H\u1ED9p G\u1ED7",
      hasWine: false,
      hasNuts: true,
      hasSnacks: false
    },
    {
      id: 4,
      name: "Gi\u1ECF Qu\xE0 T\xE0i L\u1ED9c Deluxe",
      price: 185e4,
      image: "https://images.unsplash.com/photo-1649789093457-3a973148fa27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "B\xE1n Ch\u1EA1y",
      components: "R\u01B0\u1EE3u Vang \xDAc, H\u1EA1t \xD3c Ch\xF3, K\u1EB9o Ferrero Rocher",
      material: "H\u1ED9p G\u1ED7",
      hasWine: true,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 5,
      name: "Gi\u1ECF Qu\xE0 Sang Tr\u1ECDng 03",
      price: 68e4,
      image: "https://images.unsplash.com/photo-1766727923624-2e8eede5aa8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      components: "B\xE1nh \u0110\u1EB7c S\u1EA3n, M\u1EE9t T\u1EBFt, Tr\xE0 Sen",
      material: "H\u1ED9p Gi\u1EA5y",
      hasWine: false,
      hasNuts: false,
      hasSnacks: true
    },
    {
      id: 6,
      name: "Gi\u1ECF Qu\xE0 H\u1EA1nh Ph\xFAc",
      price: 12e5,
      originalPrice: 15e5,
      image: "https://images.unsplash.com/photo-1625552187571-7ee60ac43d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Gi\u1EA3m Gi\xE1",
      components: "R\u01B0\u1EE3u Vang M\u1EF9, H\u1EA1t H\u1ED7n H\u1EE3p, B\xE1nh Quy B\u01A1",
      material: "Gi\u1ECF M\xE2y",
      hasWine: true,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 7,
      name: "Gi\u1ECF Qu\xE0 B\xECnh An",
      price: 85e4,
      image: "https://images.unsplash.com/photo-1622153093514-4dd0078ac132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      components: "H\u1EA1t \u0110i\u1EC1u, Nho Kh\xF4, M\u1EE9t G\u1EEBng, Tr\xE0 Th\xE1i Nguy\xEAn",
      material: "H\u1ED9p Gi\u1EA5y",
      hasWine: false,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 8,
      name: "Gi\u1ECF Qu\xE0 V\u1EA1n L\u1ED9c Premium",
      price: 32e5,
      image: "https://images.unsplash.com/photo-1761079989144-7ff17e97ef11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "M\u1EDBi",
      components: "R\u01B0\u1EE3u Vang \xDD, Caviar, H\u1EA1t Truffle, Socola Godiva",
      material: "H\u1ED9p Da",
      hasWine: true,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 9,
      name: "Gi\u1ECF Qu\xE0 Nh\u01B0 \xDD",
      price: 145e4,
      image: "https://images.unsplash.com/photo-1768224661768-7ba694d1422b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "B\xE1n Ch\u1EA1y",
      components: "H\u1EA1t Macadamia, H\u1EA1t H\u1EA1nh Nh\xE2n, Tr\xE1i C\xE2y S\u1EA5y",
      material: "H\u1ED9p G\u1ED7",
      hasWine: false,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 10,
      name: "Gi\u1ECF Qu\xE0 Xu\xE2n Sum V\u1EA7y",
      price: 11e5,
      image: "https://images.unsplash.com/photo-1649789093457-3a973148fa27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      components: "R\u01B0\u1EE3u Vang \u0110\u1ECF, B\xE1nh K\u1EB9o Cao C\u1EA5p, M\u1EE9t T\u1EBFt",
      material: "Gi\u1ECF M\xE2y",
      hasWine: true,
      hasNuts: false,
      hasSnacks: true
    },
    {
      id: 11,
      name: "Gi\u1ECF Qu\xE0 Ph\xE1t T\xE0i",
      price: 22e5,
      originalPrice: 26e5,
      image: "https://images.unsplash.com/photo-1625552187571-7ee60ac43d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      badge: "Gi\u1EA3m Gi\xE1",
      components: "R\u01B0\u1EE3u Vang \xDAc, H\u1EA1t \xD3c Ch\xF3, Socola Ferrero, Tr\xE0 Shan Tuy\u1EBFt",
      material: "H\u1ED9p Da",
      hasWine: true,
      hasNuts: true,
      hasSnacks: true
    },
    {
      id: 12,
      name: "Gi\u1ECF Qu\xE0 Truy\u1EC1n Th\u1ED1ng",
      price: 58e4,
      image: "https://images.unsplash.com/photo-1766727923624-2e8eede5aa8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      components: "B\xE1nh T\xE9t, M\u1EE9t G\u1EEBng, M\u1EE9t D\u1EEBa, Tr\xE0 Sen",
      material: "H\u1ED9p Gi\u1EA5y",
      hasWine: false,
      hasNuts: false,
      hasSnacks: true
    }
  ];
  const priceRanges = [
    { label: "D\u01B0\u1EDBi 500k", min: 0, max: 5e5 },
    { label: "500k - 1 tri\u1EC7u", min: 5e5, max: 1e6 },
    { label: "1 - 2 tri\u1EC7u", min: 1e6, max: 2e6 },
    { label: "Tr\xEAn 2 tri\u1EC7u", min: 2e6, max: Infinity }
  ];
  const materials = ["H\u1ED9p Da", "H\u1ED9p G\u1ED7", "Gi\u1ECF M\xE2y", "H\u1ED9p Gi\u1EA5y"];
  const components = ["C\xF3 R\u01B0\u1EE3u Vang", "H\u1EA1t Dinh D\u01B0\u1EE1ng", "B\xE1nh K\u1EB9o"];
  const filteredProducts = allProducts.filter((product) => {
    if (selectedPriceRanges.length > 0) {
      const inRange = selectedPriceRanges.some((range) => {
        const priceRange = priceRanges.find((r) => r.label === range);
        return priceRange && product.price >= priceRange.min && product.price < priceRange.max;
      });
      if (!inRange) return false;
    }
    if (selectedMaterials.length > 0 && !selectedMaterials.includes(product.material)) {
      return false;
    }
    if (selectedComponents.length > 0) {
      const hasRequiredComponents = selectedComponents.every((comp) => {
        if (comp === "C\xF3 R\u01B0\u1EE3u Vang") return product.hasWine;
        if (comp === "H\u1EA1t Dinh D\u01B0\u1EE1ng") return product.hasNuts;
        if (comp === "B\xE1nh K\u1EB9o") return product.hasSnacks;
        return false;
      });
      if (!hasRequiredComponents) return false;
    }
    return true;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });
  const togglePriceRange = (range) => {
    setSelectedPriceRanges(
      (prev) => prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };
  const toggleMaterial = (material) => {
    setSelectedMaterials(
      (prev) => prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
    );
  };
  const toggleComponent = (component) => {
    setSelectedComponents(
      (prev) => prev.includes(component) ? prev.filter((c) => c !== component) : [...prev, component]
    );
  };
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VN\u0110";
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              Bộ Sưu Tập Giỏ Quà Tết 2026
            </h1>
            <p className="text-xl text-white/90">
              Khám phá những giỏ quà cao cấp mang đến tài lộc và thịnh vượng
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
              <span className="text-[#B71C1C] font-semibold">Giỏ quà</span>
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
                  <Package className="h-5 w-5 mr-2" />
                  Giỏ Quà
                </h3>
                <p className="text-xs text-gray-500 mt-1">Gift Sets Collection</p>
              </div>

              {
    /* Price Range Filter */
  }
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#D4AF37]">■</span>
                  <span className="ml-2">Khoảng Giá</span>
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => <label key={range.label} className="flex items-center cursor-pointer group">
                      <input
    type="checkbox"
    checked={selectedPriceRanges.includes(range.label)}
    onChange={() => togglePriceRange(range.label)}
    className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
  />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">
                        {range.label}
                      </span>
                    </label>)}
                </div>
              </div>

              {
    /* Material Filter */
  }
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#B71C1C]">■</span>
                  <span className="ml-2">Chất Liệu Hộp</span>
                </h3>
                <div className="space-y-2">
                  {materials.map((material) => <label key={material} className="flex items-center cursor-pointer group">
                      <input
    type="checkbox"
    checked={selectedMaterials.includes(material)}
    onChange={() => toggleMaterial(material)}
    className="w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#B71C1C]"
  />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">
                        {material}
                      </span>
                    </label>)}
                </div>
              </div>

              {
    /* Component Filter */
  }
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#D4AF37]">■</span>
                  <span className="ml-2">Thành Phần</span>
                </h3>
                <div className="space-y-2">
                  {components.map((component) => <label key={component} className="flex items-center cursor-pointer group">
                      <input
    type="checkbox"
    checked={selectedComponents.includes(component)}
    onChange={() => toggleComponent(component)}
    className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
  />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">
                        {component}
                      </span>
                    </label>)}
                </div>
              </div>

              {
    /* Clear Filters */
  }
              {(selectedPriceRanges.length > 0 || selectedMaterials.length > 0 || selectedComponents.length > 0) && <Button
    variant="outline"
    className="w-full border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
    onClick={() => {
      setSelectedPriceRanges([]);
      setSelectedMaterials([]);
      setSelectedComponents([]);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  />
                      
                      {
    /* Badge */
  }
                      {product.badge && <div
    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${product.badge === "B\xE1n Ch\u1EA1y" ? "bg-[#B71C1C]" : product.badge === "M\u1EDBi" ? "bg-[#D4AF37]" : "bg-green-600"}`}
  >
                          {product.badge}
                        </div>}

                      {
    /* Wishlist Heart */
  }
                      <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                        <Heart className="h-5 w-5 text-gray-700 hover:text-[#B71C1C] hover:fill-[#B71C1C] transition-colors" />
                      </button>
                    </div>

                    {
    /* Product Info */
  }
                    <div className="p-4 flex flex-col flex-1">
                      <h3
    className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                        {product.name}
                      </h3>
                      
                      {
    /* Components Summary */
  }
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8">
                        {product.components}
                      </p>
                      
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-[#D4AF37]">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>}
                      </div>

                      <Button className="w-full bg-[#B71C1C] hover:bg-[#8B1538] text-white font-bold mt-auto">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Thêm Vào Giỏ
                      </Button>
                    </div>
                  </div>

                  {
    /* B2B Banner - Insert after 6th product */
  }
                  {index === 5 && <div
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
      setSelectedPriceRanges([]);
      setSelectedMaterials([]);
      setSelectedComponents([]);
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
  ProductListing
};

