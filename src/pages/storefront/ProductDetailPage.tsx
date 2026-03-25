import { useState, useEffect } from "react";
import { ChevronRight, Minus, Plus, ShoppingCart, Truck, Award, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_PAGES } from "@/constants/pages";
import { STORAGE_KEYS } from "@/constants/storage";
import useAuth from "@/hooks/useAuth";
import useCatalog from "@/hooks/useCatalog";
import useCart from "@/hooks/useCart";
import type {
  BoxComponentResponse,
  GiftBoxResponse,
} from "@/services/giftBoxService";
import type { ImageResponse } from "@/services/imageService";
import { InventoryStatus } from "@/services/inventoryService";
import type { InventoryResponse } from "@/services/inventoryService";
import type { ProductResponse } from "@/services/productService";
import { redirectToLogin } from "@/utils/authRedirect";
import { getViewProduct } from "@/utils/productViewStore";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600";

interface ProductDetailProps {
  onNavigate?: (page: string) => void;
}

interface PageData {
  type: "giftbox" | "individual";
  name: string;
  code?: string;
  price: number;
  description: string;
  categoryName?: string;
  isActive: boolean;
  images: string[];
  components?: BoxComponentResponse[];
  inventory?: InventoryResponse | null;
}

export function ProductDetail({ onNavigate }: ProductDetailProps) {
  const { fetchGiftBoxDetail, fetchProductDetail, fetchProductImages } =
    useCatalog();
  const { isLoggedIn } = useAuth();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const giftBoxService = {
    getById: async (id: string) => ({
      data: {
        data: await fetchGiftBoxDetail(id),
      },
    }),
  };
  const productService = {
    getById: async (id: string) => {
      const data = await fetchProductDetail(id);
      return {
        data: {
          data: data.product,
        },
      };
    },
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
  const inventoryService = {
    getByProductId: async (productId: string) => {
      const data = await fetchProductDetail(productId);
      return {
        data: {
          success: true,
          data: data.inventory,
        },
      };
    },
  };
  const addItemToCart = async (
    payload: Parameters<typeof addItem>[0],
  ) => {
    const result = await addItem(payload);
    if ((result as { error?: unknown }).error) {
      throw new Error("Khong the them vao gio hang");
    }
    return result;
  };

  useEffect(() => {
    const view = getViewProduct();
    if (!view) {
      setError("Không tìm thấy thông tin sản phẩm.");
      setLoading(false);
      return;
    }

    if (view.type === "giftbox") {
      giftBoxService.getById(view.id)
        .then((res) => {
          const box: GiftBoxResponse = res.data.data;
          const imgs = (box.images || [])
            .sort((a, b) => (a.isMain ? -1 : 1) - (b.isMain ? -1 : 1))
            .map((i) => i.url);
          setData({
            type: "giftbox",
            name: box.name,
            code: box.code,
            price: box.basePrice,
            description: box.description,
            categoryName: box.categoryName,
            isActive: box.isActive,
            images: imgs.length > 0 ? imgs : [FALLBACK_IMAGE],
            components: box.boxComponents || [],
          });
        })
        .catch(() => setError("Không thể tải thông tin giỏ quà."))
        .finally(() => setLoading(false));
    } else {
      // individual product — 3 parallel calls
      Promise.all([
        productService.getById(view.id),
        imageService.getByProduct(view.id),
        inventoryService.getByProductId(view.id),
      ])
        .then(([prodRes, imgRes, invRes]) => {
          const prod: ProductResponse = prodRes.data.data;
          const imgs: ImageResponse[] = imgRes.data.success ? imgRes.data.data : [];
          const inv: InventoryResponse | null = invRes.data.success ? invRes.data.data : null;
          const sortedImgs = [...imgs]
            .sort((a, b) => (a.isMain ? -1 : 1) - (b.isMain ? -1 : 1))
            .map((i) => i.url);
          setData({
            type: "individual",
            name: prod.name,
            code: prod.sku,
            price: prod.price,
            description: prod.description,
            categoryName: prod.categoryName,
            isActive: prod.isActive,
            images: sortedImgs.length > 0 ? sortedImgs : [FALLBACK_IMAGE],
            inventory: inv,
          });
        })
        .catch(() => setError("Không thể tải thông tin sản phẩm."))
        .finally(() => setLoading(false));
    }
  }, []);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + " VND";

  const handleAddToCart = async () => {
    const view = getViewProduct();
    if (!view || addingToCart) return;

    if (!isLoggedIn) {
      redirectToLogin(
        onNavigate,
        APP_PAGES.PRODUCT,
        "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
      );
      return;
    }

    try {
      setAddingToCart(true);
      await addItemToCart({
        giftBoxId: view.type === "giftbox" ? view.id : null,
        productId: view.type === "individual" ? view.id : null,
        quantity,
      });
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2500);
    } catch {
      // silently fail — could show a toast in future
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    const view = getViewProduct();
    if (!view || buyingNow) return;

    if (!isLoggedIn) {
      redirectToLogin(
        onNavigate,
        APP_PAGES.PRODUCT,
        "Vui lòng đăng nhập để mua hàng ngay.",
      );
      return;
    }

    try {
      setBuyingNow(true);
      const result = await addItemToCart({
        giftBoxId: view.type === "giftbox" ? view.id : null,
        productId: view.type === "individual" ? view.id : null,
        quantity,
      });

      const updatedCart = (result as {
        payload?: {
          items?: Array<{
            id: string;
            productId: string | null;
            giftBoxId: string | null;
          }>;
        };
      }).payload;

      const selectedItem = updatedCart?.items?.find((item) =>
        view.type === "giftbox"
          ? item.giftBoxId === view.id
          : item.productId === view.id,
      );

      if (selectedItem) {
        sessionStorage.setItem(
          STORAGE_KEYS.CHECKOUT_SELECTED_ITEM_IDS,
          JSON.stringify([selectedItem.id]),
        );
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.CHECKOUT_SELECTED_ITEM_IDS);
      }

      onNavigate?.("checkout");
    } catch {
      sessionStorage.removeItem(STORAGE_KEYS.CHECKOUT_SELECTED_ITEM_IDS);
    } finally {
      setBuyingNow(false);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const productImages = data?.images ?? [FALLBACK_IMAGE];

  const stockStatus = () => {
    if (data?.type === "giftbox") {
      return data.isActive
        ? { color: "bg-green-500", textColor: "text-green-700", label: "Đang bán" }
        : { color: "bg-gray-400", textColor: "text-gray-600", label: "Ngừng bán" };
    }
    const inv = data?.inventory;
    if (!inv) return { color: "bg-gray-400", textColor: "text-gray-600", label: "Chưa rõ" };
    if (inv.status === InventoryStatus.OutOfStock) return { color: "bg-red-500", textColor: "text-red-700", label: "Hết hàng" };
    if (inv.status === InventoryStatus.LowStock) return { color: "bg-yellow-500", textColor: "text-yellow-700", label: "Sắp hết hàng" };
    if (inv.status === InventoryStatus.Inactive || !data?.isActive) return { color: "bg-gray-400", textColor: "text-gray-600", label: "Ngừng bán" };
    return { color: "bg-green-500", textColor: "text-green-700", label: "Còn hàng" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#B71C1C] mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || "Không tìm thấy sản phẩm."}</p>
          <Button onClick={() => onNavigate?.("listing")} className="bg-[#B71C1C] hover:bg-[#8B1538] text-white">
            Quay Lại Danh Sách
          </Button>
        </div>
      </div>
    );
  }

  const stock = stockStatus();

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button onClick={() => onNavigate?.("home")} className="text-gray-600 hover:text-[#B71C1C] transition-colors">
              Trang chủ
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <button
              onClick={() => onNavigate?.(data.type === "giftbox" ? "listing" : "individual-products")}
              className="text-gray-600 hover:text-[#B71C1C] transition-colors"
            >
              {data.type === "giftbox" ? "Giỏ Quà" : "Sản Phẩm Lẻ"}
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{data.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={data.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
              />
            </div>

            {/* Thumbnail Carousel */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#D4AF37] shadow-md"
                        : "border-gray-200 hover:border-[#D4AF37]/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1
                className="text-4xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {data.name}
              </h1>
              {data.code && (
                <p className="text-sm text-gray-500 mb-1">
                  Mã: <span className="font-medium text-gray-700">{data.code}</span>
                </p>
              )}
              {data.categoryName && (
                <p className="text-sm text-gray-500">
                  Danh mục: <span className="font-medium text-gray-700">{data.categoryName}</span>
                </p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <span className="text-gray-600">(128 đánh giá)</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-4">
              <div className="text-4xl font-bold text-[#D4AF37]">
                {formatPrice(data.price)}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${stock.color}`}></div>
              <span className={`font-medium ${stock.textColor}`}>{stock.label}</span>
              {data.type === "individual" && data.inventory && (
                <span className="text-gray-500 text-sm">({data.inventory.quantity} sản phẩm)</span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-700 leading-relaxed">
              {data.description || "Sản phẩm cao cấp, chất lượng được kiểm định nghiêm ngặt."}
            </p>

            {/* B2B Feature */}
            <div className="bg-gradient-to-r from-[#8B1538]/10 to-[#D4AF37]/10 border border-[#D4AF37] rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Dịch vụ Doanh nghiệp</h3>
                  <p className="text-sm text-gray-700 mb-3">In logo công ty, báo giá sỉ từ 50 hộp trở lên</p>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate?.("b2b")}
                    className="border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
                  >
                    Yêu cầu In Logo / Báo Giá Sỉ
                  </Button>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Số lượng:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button onClick={decrementQuantity} className="p-3 hover:bg-gray-100 transition-colors">
                    <Minus className="h-4 w-4 text-gray-700" />
                  </button>
                  <div className="px-6 py-2 font-bold text-gray-900">{quantity}</div>
                  <button onClick={incrementQuantity} className="p-3 hover:bg-gray-100 transition-colors">
                    <Plus className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Cart success toast */}
              {cartSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                  ✓ Đã thêm vào giỏ hàng!
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-[#B71C1C] hover:bg-[#8B1538] text-white py-6 text-lg font-bold rounded-lg shadow-lg disabled:opacity-60"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addingToCart ? "Đang thêm..." : "Thêm Vào Giỏ"}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={buyingNow}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#B8962E] text-white py-6 text-lg font-bold rounded-lg shadow-lg"
                >
                  {buyingNow ? "Đang chuyển..." : "Mua Ngay"}
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <Truck className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">Giao Hàng Nhanh</div>
                  <div className="text-xs text-gray-600">Miễn phí toàn quốc</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">Hàng Chính Hãng</div>
                  <div className="text-xs text-gray-600">100% nhập khẩu</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RefreshCw className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">Đổi Trả Dễ Dàng</div>
                  <div className="text-xs text-gray-600">Trong 7 ngày</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          {/* Tab Headers */}
          <div className="border-b border-gray-300">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 px-2 font-medium transition-colors relative ${
                  activeTab === "description" ? "text-[#B71C1C]" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mô Tả
                {activeTab === "description" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B71C1C]"></div>}
              </button>
              {data.type === "giftbox" && (
                <button
                  onClick={() => setActiveTab("components")}
                  className={`pb-4 px-2 font-medium transition-colors relative ${
                    activeTab === "components" ? "text-[#B71C1C]" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Danh Sách Thành Phần
                  {activeTab === "components" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B71C1C]"></div>}
                </button>
              )}
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 px-2 font-medium transition-colors relative ${
                  activeTab === "reviews" ? "text-[#B71C1C]" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Đánh Giá (128)
                {activeTab === "reviews" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B71C1C]"></div>}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-8 bg-white rounded-lg mt-4 px-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <h3
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Về Sản Phẩm
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                </p>
              </div>
            )}

            {activeTab === "components" && data.type === "giftbox" && (
              <div>
                <h3
                  className="text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Thành Phần Trong Hộp Quà
                </h3>
                {(!data.components || data.components.length === 0) ? (
                  <p className="text-gray-500">Chưa có thông tin thành phần.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.components.map((comp, index) => (
                      <div key={comp.id || index} className="flex items-start space-x-4 p-4 bg-[#FFFDF5] rounded-lg">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">{comp.productName || "Sản phẩm"}</h4>
                          <p className="text-sm text-gray-600">
                            {comp.productSKU && <span>SKU: {comp.productSKU} · </span>}
                            Số lượng: {comp.quantity}
                          </p>
                          {comp.productPrice > 0 && (
                            <p className="text-sm text-[#D4AF37] font-medium mt-1">
                              {comp.productPrice.toLocaleString("vi-VN")} VND
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3
                  className="text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Đánh Giá Từ Khách Hàng
                </h3>
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">N</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">Nguyễn Văn A</h4>
                          <span className="text-sm text-gray-500">15/01/2026</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                        </div>
                        <p className="text-gray-700">Hộp quà rất đẹp và sang trọng, giao hàng đúng hẹn. Dịch vụ in logo rất chuyên nghiệp. Chắc chắn sẽ đặt lại cho năm sau!</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#B71C1C] rounded-full flex items-center justify-center text-white font-bold">T</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">Trần Thị B</h4>
                          <span className="text-sm text-gray-500">12/01/2026</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                        </div>
                        <p className="text-gray-700">Đã mua 100 hộp cho công ty tặng đối tác. Chất lượng xuất sắc, đóng gói cẩn thận. Đội ngũ support rất nhiệt tình.</p>
                      </div>
                    </div>
                  </div>
                  <div className="pb-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">L</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">Lê Hoàng C</h4>
                          <span className="text-sm text-gray-500">10/01/2026</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(4)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <p className="text-gray-700">Sản phẩm tốt, đóng gói đẹp. Tuy nhiên giá hơi cao một chút. Nhưng nhìn chung vẫn xứng đáng với chất lượng.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
