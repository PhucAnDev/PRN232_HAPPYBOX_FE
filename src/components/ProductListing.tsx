import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Heart,
  ShoppingCart,
  SlidersHorizontal,
  ChevronLeft,
  Package,
  X,
  TriangleAlert,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import giftBoxService, { GiftBoxResponse } from "../services/giftBoxService";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";

interface ProductListingProps {
  onNavigate?: (page: string) => void;
}

export function ProductListing({ onNavigate }: ProductListingProps) {
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();

  // Data state
  const [giftBoxes, setGiftBoxes] = useState<GiftBoxResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Toast state
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [successToast, setSuccessToast] = useState<{ name: string; image: string } | null>(null);

  // Filter/sort state
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch gift boxes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await giftBoxService.getActive();
        if (res.data.success) {
          setGiftBoxes(res.data.data);
        } else {
          setFetchError("Không thể tải dữ liệu giỏ quà. Vui lòng thử lại.");
        }
      } catch (err: unknown) {
        const axiosErr = err as { code?: string; message?: string };
        if (axiosErr?.code === "ECONNABORTED" || axiosErr?.message?.includes("timeout")) {
          setFetchError("Server đang khởi động, vui lòng thử lại sau vài giây.");
        } else {
          setFetchError("Không thể kết nối đến server. Vui lòng thử lại.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const priceRanges = [
    { label: "Dưới 500k", min: 0, max: 500000 },
    { label: "500k - 1 triệu", min: 500000, max: 1000000 },
    { label: "1 - 2 triệu", min: 1000000, max: 2000000 },
    { label: "Trên 2 triệu", min: 2000000, max: Infinity },
  ];

  // Derive unique categories from data
  const categories = Array.from(
    new Set(giftBoxes.map((g) => g.categoryName).filter(Boolean))
  ) as string[];

  // Filter
  const filtered = giftBoxes.filter((g) => {
    if (selectedPriceRanges.length > 0) {
      const inRange = selectedPriceRanges.some((label) => {
        const r = priceRanges.find((p) => p.label === label);
        return r && g.basePrice >= r.min && g.basePrice < r.max;
      });
      if (!inRange) return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(g.categoryName ?? "")) {
      return false;
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.basePrice - b.basePrice;
    if (sortBy === "price-high") return b.basePrice - a.basePrice;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const currentItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (box: GiftBoxResponse) => {
    if (!isLoggedIn) {
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 3500);
      return;
    }
    const mainImage =
      box.images?.find((i) => i.isMain)?.url ??
      box.images?.[0]?.url ??
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600";
    const result = await addItem({ giftBoxId: box.id, quantity: 1 });
    if ((result as any)?.error == null) {
      setSuccessToast({ name: box.name, image: mainImage });
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + " VNĐ";

  const getMainImage = (box: GiftBoxResponse) =>
    box.images?.find((i) => i.isMain)?.url ??
    box.images?.[0]?.url ??
    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600";

  const getComponentsSummary = (box: GiftBoxResponse) =>
    box.boxComponents?.map((c) => `${c.productName}${c.quantity > 1 ? ` x${c.quantity}` : ""}`).join(", ") ??
    box.description;

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Login Toast */}
      <div
        className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
          showLoginToast ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 bg-white border-l-4 border-[#B71C1C] rounded-xl shadow-2xl px-5 py-4 min-w-[320px] max-w-sm">
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-[#B71C1C] to-[#8B1538] flex items-center justify-center">
            <TriangleAlert className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#B71C1C]">Chưa đăng nhập</p>
            <p className="text-xs text-gray-600 mt-0.5">Vui lòng đăng nhập để thêm vào giỏ hàng.</p>
          </div>
          <button onClick={() => setShowLoginToast(false)} className="flex-shrink-0 text-gray-400 hover:text-[#B71C1C] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-1 bg-gray-100 rounded-b-xl overflow-hidden -mt-1 mx-px">
          <div className="h-full bg-gradient-to-r from-[#B71C1C] to-[#8B1538] rounded-b-xl" style={showLoginToast ? { animation: "shrink 3.5s linear forwards" } : {}} />
        </div>
      </div>

      {/* Success Toast */}
      <div
        className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
          successToast ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 bg-white border-l-4 border-[#2E7D32] rounded-xl shadow-2xl px-4 py-3 min-w-[320px] max-w-sm">
          <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-gray-100">
            <img src={successToast?.image} alt={successToast?.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
              <p className="text-sm font-semibold text-[#2E7D32]">Đã thêm vào giỏ hàng</p>
            </div>
            <p className="text-xs text-gray-600 truncate">{successToast?.name}</p>
          </div>
          <button onClick={() => setSuccessToast(null)} className="flex-shrink-0 text-gray-400 hover:text-[#2E7D32] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-1 bg-gray-100 rounded-b-xl overflow-hidden -mt-1 mx-px">
          <div className="h-full bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] rounded-b-xl" style={successToast ? { animation: "shrink 3s linear forwards" } : {}} />
        </div>
      </div>

      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Bộ Sưu Tập Giỏ Quà Tết 2026
          </h1>
          <p className="text-xl text-white/90">Khám phá những giỏ quà cao cấp mang đến tài lộc và thịnh vượng</p>
        </div>
      </div>

      {/* Breadcrumb & Sort */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <nav className="flex items-center space-x-2 text-sm">
              <button onClick={() => onNavigate?.("home")} className="text-gray-600 hover:text-[#B71C1C] transition-colors">Trang chủ</button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-[#B71C1C] font-semibold">Giỏ quà</span>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="lg:hidden" onClick={() => setShowMobileFilters(!showMobileFilters)}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Lọc
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
                >
                  <option value="featured">Nổi bật</option>
                  <option value="price-low">Giá: Thấp đến Cao</option>
                  <option value="price-high">Giá: Cao đến Thấp</option>
                  <option value="name">Tên: A-Z</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">{loading ? "..." : `${sorted.length} sản phẩm`}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 space-y-6">
              <div className="pb-4 border-b-2 border-[#B71C1C]">
                <h3 className="text-xl font-bold text-[#B71C1C] flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Giỏ Quà
                </h3>
                <p className="text-xs text-gray-500 mt-1">Gift Sets Collection</p>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-[#D4AF37]">■</span>
                  <span className="ml-2">Khoảng Giá</span>
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((r) => (
                    <label key={r.label} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(r.label)}
                        onChange={() => {
                          setSelectedPriceRanges((prev) =>
                            prev.includes(r.label) ? prev.filter((x) => x !== r.label) : [...prev, r.label]
                          );
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-[#B71C1C]">■</span>
                    <span className="ml-2">Danh Mục</span>
                  </h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => {
                            setSelectedCategories((prev) =>
                              prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]
                            );
                            setCurrentPage(1);
                          }}
                          className="w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#B71C1C]"
                        />
                        <span className="ml-2 text-sm text-gray-700 group-hover:text-[#B71C1C]">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {(selectedPriceRanges.length > 0 || selectedCategories.length > 0) && (
                <Button
                  variant="outline"
                  className="w-full border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
                  onClick={() => { setSelectedPriceRanges([]); setSelectedCategories([]); setCurrentPage(1); }}
                >
                  Xóa Bộ Lọc
                </Button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                <Loader2 className="w-12 h-12 animate-spin text-[#B71C1C] mb-4" />
                <p className="text-lg">Đang tải dữ liệu...</p>
              </div>
            )}

            {/* Error */}
            {!loading && fetchError && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-[#B71C1C] font-semibold text-lg mb-4">{fetchError}</p>
                <Button className="bg-[#B71C1C] hover:bg-[#8B1538] text-white" onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              </div>
            )}

            {/* Grid */}
            {!loading && !fetchError && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map((box, index) => (
                    <>
                      <div
                        key={box.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
                        onClick={() => onNavigate?.("product")}
                      >
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <img
                            src={getMainImage(box)}
                            alt={box.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                            <Heart className="h-5 w-5 text-gray-700 hover:text-[#B71C1C] hover:fill-[#B71C1C] transition-colors" />
                          </button>
                          {box.categoryName && (
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#B71C1C]/80 backdrop-blur-sm">
                              {box.categoryName}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {box.name}
                          </h3>

                          {/* Components summary */}
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2 min-h-[2rem]">
                            {getComponentsSummary(box)}
                          </p>

                          {/* Price */}
                          <div className="mb-3">
                            <div className="text-2xl font-bold text-[#D4AF37]">{formatPrice(box.basePrice)}</div>
                          </div>

                          <Button
                            className="w-full bg-[#B71C1C] hover:bg-[#8B1538] text-white font-bold mt-auto"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              handleAddToCart(box);
                            }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Thêm Vào Giỏ
                          </Button>
                        </div>
                      </div>

                      {/* B2B Banner after 6th item */}
                      {index === 5 && (
                        <div
                          key="b2b-banner"
                          className="col-span-1 sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-[#8B1538] via-[#B71C1C] to-[#D4AF37] rounded-lg p-8 my-4"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-between text-white">
                            <div className="mb-6 md:mb-0 text-center md:text-left">
                              <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Quà Tặng Doanh Nghiệp?
                              </h3>
                              <p className="text-xl text-white/90">Nhận giá sỉ &amp; in logo miễn phí cho đơn từ 50 hộp</p>
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
                {sorted.length === 0 && (
                  <div className="text-center py-16">
                    <ShoppingCart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy giỏ quà</h3>
                    <p className="text-gray-600 mb-6">Vui lòng thử điều chỉnh bộ lọc của bạn</p>
                    <Button
                      onClick={() => { setSelectedPriceRanges([]); setSelectedCategories([]); }}
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
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg border font-medium transition-all flex items-center gap-2 ${
                          currentPage === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:border-[#B71C1C] hover:text-[#B71C1C] hover:bg-red-50"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Trước</span>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                            currentPage === p ? "bg-[#B71C1C] text-white shadow-lg scale-110" : "bg-white text-gray-700 border border-gray-300 hover:border-[#D4AF37] hover:bg-[#FFFDF5] hover:text-[#B71C1C]"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg border font-medium transition-all flex items-center gap-2 ${
                          currentPage === totalPages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:border-[#B71C1C] hover:text-[#B71C1C] hover:bg-red-50"
                        }`}
                      >
                        <span className="hidden sm:inline">Sau</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
