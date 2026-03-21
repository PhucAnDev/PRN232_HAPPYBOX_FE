import { useState, useEffect } from "react";
import {
  ChevronRight,
  Heart,
  ShoppingCart,
  SlidersHorizontal,
  ChevronLeft,
  Star,
  Sparkles,
  X,
  TriangleAlert,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import useAuth from "@/hooks/useAuth";
import useCatalog from "@/hooks/useCatalog";
import useCart from "@/hooks/useCart";
import type { CategoryResponse } from "@/services/categoryService";
import type { ProductResponse } from "@/services/productService";
import { setViewProduct } from "@/utils/productViewStore";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  category: string;
  categoryId: string;
  origin: string;
  rating: number;
  description: string;
  sku: string;
}

interface IndividualProductsProps {
  onNavigate?: (page: string) => void;
}

export function IndividualProducts({ onNavigate }: IndividualProductsProps) {
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();
  const { fetchProducts, fetchCategories, fetchProductImages } = useCatalog();
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [successToast, setSuccessToast] = useState<{ name: string; image: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const productService = {
    getAll: async () => {
      const data = await fetchProducts();
      return {
        data: {
          success: true,
          data: data.map((item) => item.product),
        },
      };
    },
  };
  const categoryService = {
    getAll: async () => ({
      data: {
        success: true,
        data: await fetchCategories(),
      },
    }),
  };
  const imageService = {
    getByProduct: async (productId: string) => {
      const data = await fetchProductImages(productId);
      return {
        data: {
          success: true,
          data: data.images,
        },
      };
    },
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products and categories in parallel
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);

        if (productsRes.data.success && categoriesRes.data.success) {
          const productData = productsRes.data.data;
          const categoryData = categoriesRes.data.data;

          setCategories(categoryData);

          // Fetch images for all products
          const productsWithImages = await Promise.all(
            productData.map(async (product: ProductResponse) => {
              try {
                const imagesRes = await imageService.getByProduct(product.id);
                const images = imagesRes.data.success
                  ? imagesRes.data.data
                  : [];

                // Get main image or first image
                const mainImage = images.find((img) => img.isMain) || images[0];

                return {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image:
                    mainImage?.url ||
                    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600",
                  category: product.categoryName || "Chưa phân loại",
                  categoryId: product.categoryId,
                  origin: "Trong nước", // Default - can be extended later
                  rating: 5, // Default - can be extended with reviews system
                  description: product.description,
                  sku: product.sku,
                  badge: undefined, // Can be set based on tags/properties
                };
              } catch (err) {
                // If image fetch fails, use placeholder
                return {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image:
                    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600",
                  category: product.categoryName || "Chưa phân loại",
                  categoryId: product.categoryId,
                  origin: "Trong nước",
                  rating: 5,
                  description: product.description,
                  sku: product.sku,
                };
              }
            }),
          );

          setProducts(productsWithImages);

          // Set initial price range based on actual products
          if (productsWithImages.length > 0) {
            const prices = productsWithImages.map((p) => p.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setPriceRange([minPrice, maxPrice]);
          }
        } else {
          setError("Không thể tải dữ liệu sản phẩm");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const origins = ["Trong nước", "Nhập khẩu", "Hàn Quốc", "Pháp", "Chile"];

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.category)
    ) {
      return false;
    }
    if (
      selectedOrigins.length > 0 &&
      !selectedOrigins.includes(product.origin)
    ) {
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
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const toggleOrigin = (origin: string) => {
    setSelectedOrigins((prev) =>
      prev.includes(origin)
        ? prev.filter((o) => o !== origin)
        : [...prev, origin],
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VNĐ";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    if (!isLoggedIn) {
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 3500);
      return;
    }
    const result = await addItem({ productId: product.id, quantity: 1 });
    if ((result as any)?.error == null) {
      setSuccessToast({ name: product.name, image: product.image });
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedOrigins([]);
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Success Toast Notification */}
      <div
        className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
          successToast
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 bg-white border-l-4 border-[#2E7D32] rounded-xl shadow-2xl px-4 py-3 min-w-[320px] max-w-sm">
          {/* Product image */}
          <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-gray-100">
            <img
              src={successToast?.image}
              alt={successToast?.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Text + icon */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
              <p className="text-sm font-semibold text-[#2E7D32]">Đã thêm vào giỏ hàng</p>
            </div>
            <p className="text-xs text-gray-600 truncate">{successToast?.name}</p>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="flex-shrink-0 text-gray-400 hover:text-[#2E7D32] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-1 bg-gray-100 rounded-b-xl overflow-hidden -mt-1 mx-px">
          <div
            className="h-full bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] rounded-b-xl"
            style={successToast ? { animation: "shrink 3s linear forwards" } : {}}
          />
        </div>
      </div>

      {/* Login Toast Notification */}
      <div
        className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
          showLoginToast
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 bg-white border-l-4 border-[#B71C1C] rounded-xl shadow-2xl px-5 py-4 min-w-[320px] max-w-sm">
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-[#B71C1C] to-[#8B1538] flex items-center justify-center">
            <TriangleAlert className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#B71C1C]">Chưa đăng nhập</p>
            <p className="text-xs text-gray-600 mt-0.5">Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.</p>
          </div>
          <button
            onClick={() => setShowLoginToast(false)}
            className="flex-shrink-0 text-gray-400 hover:text-[#B71C1C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100 rounded-b-xl overflow-hidden -mt-1 mx-px">
          <div
            className={`h-full bg-gradient-to-r from-[#B71C1C] to-[#8B1538] rounded-b-xl ${
              showLoginToast ? "animate-[shrink_3.5s_linear_forwards]" : ""
            }`}
            style={showLoginToast ? { animation: "shrink 3.5s linear forwards" } : {}}
          />
        </div>
      </div>

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
              <button
                onClick={() => onNavigate?.("home")}
                className="text-gray-600 hover:text-[#B71C1C] transition-colors"
              >
                Trang chủ
              </button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <button
                onClick={() => onNavigate?.("listing")}
                className="text-gray-600 hover:text-[#B71C1C] transition-colors"
              >
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
                <p className="text-xs text-gray-500 mt-1">
                  Individual Products
                </p>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#B71C1C]">■</span>
                  <span className="ml-2">Danh Mục</span>
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => toggleCategory(category.name)}
                        className="w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#B71C1C]"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">
                        {category.name}
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
                  {origins.map((origin) => (
                    <label
                      key={origin}
                      className="flex items-center cursor-pointer group"
                    >
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
                    min={0}
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
              {(selectedCategories.length > 0 ||
                selectedOrigins.length > 0) && (
                <Button
                  variant="outline"
                  className="w-full border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
                  onClick={resetFilters}
                >
                  Xóa Bộ Lọc
                </Button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#B71C1C] mb-4"></div>
                  <p className="text-gray-600">Đang tải sản phẩm...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <p className="text-red-600 font-semibold mb-2">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-[#B71C1C] hover:bg-[#8B1538] text-white mt-4"
                >
                  Thử lại
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentProducts.map((product, index) => (
                  <>
                    {/* Product Card */}
                    <div
                      key={product.id}
                      onClick={() => {
                          setViewProduct({ id: product.id, type: "individual" });
                          onNavigate?.("product");
                        }}
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

                        <Button
                          className="w-full bg-[#B71C1C] hover:bg-[#8B1538] text-white font-semibold text-xs py-2 mt-auto"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
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
                              style={{
                                fontFamily: "'Playfair Display', serif",
                              }}
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
            )}

            {/* No Results */}
            {!loading && !error && sortedProducts.length === 0 && (
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
                  onClick={resetFilters}
                  className="bg-[#B71C1C] hover:bg-[#8B1538] text-white"
                >
                  Xóa Tất Cả Bộ Lọc
                </Button>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
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
