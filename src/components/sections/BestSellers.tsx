import { useEffect, useState } from "react";
import { ShoppingCart, Flame, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { APP_PAGES } from "@/constants/pages";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import dashboardService, {
  type BestSellerItemDto,
} from "@/services/dashboardService";
import giftBoxService from "@/services/giftBoxService";
import imageService from "@/services/imageService";
import productService from "@/services/productService";
import { redirectToLogin } from "@/utils/authRedirect";
import { resolveImageUrl } from "@/utils/imageUrl";
import { setViewProduct } from "@/utils/productViewStore";

interface BestSellersProps {
  onNavigate?: (page: string) => void;
}

interface BestSellerCard {
  id: string;
  name: string;
  itemType: "Product" | "GiftBox";
  soldQuantity: number;
  totalRevenue: number;
  price: number;
  image: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600";

const formatDateParam = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getLastThirtyDaysRange = () => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 29);

  return {
    startDate: formatDateParam(startDate),
    endDate: formatDateParam(endDate),
  };
};

const getMainImageUrl = (urls: Array<string | null | undefined>) =>
  urls
    .map((url) => resolveImageUrl(url))
    .find((url) => typeof url === "string" && url.trim().length > 0) ?? "";

const buildProductCard = async (
  item: BestSellerItemDto,
): Promise<BestSellerCard> => {
  const [productResult, imageResult] = await Promise.allSettled([
    productService.getById(item.itemId),
    imageService.getByProduct(item.itemId),
  ]);

  const product =
    productResult.status === "fulfilled" ? productResult.value.data.data : null;
  const productImages =
    imageResult.status === "fulfilled" ? imageResult.value.data.data : [];

  const imageUrl = getMainImageUrl([
    productImages.find((image) => image.isMain)?.url,
    productImages[0]?.url,
    product?.images?.find((image) => image.isMain)?.url,
    product?.images?.[0]?.url,
  ]);

  return {
    id: item.itemId,
    name: product?.name ?? item.itemName,
    itemType: "Product",
    soldQuantity: item.totalSoldQuantity,
    totalRevenue: item.totalRevenue,
    price:
      typeof product?.price === "number"
        ? product.price
        : item.totalSoldQuantity > 0
          ? item.totalRevenue / item.totalSoldQuantity
          : 0,
    image: imageUrl || FALLBACK_IMAGE,
  };
};

const buildGiftBoxCard = async (
  item: BestSellerItemDto,
): Promise<BestSellerCard> => {
  const giftBoxResponse = await giftBoxService.getById(item.itemId);
  const giftBox = giftBoxResponse.data.data;

  const imageUrl = getMainImageUrl([
    giftBox.images?.find((image) => image.isMain)?.url,
    giftBox.images?.[0]?.url,
  ]);

  return {
    id: item.itemId,
    name: giftBox?.name ?? item.itemName,
    itemType: "GiftBox",
    soldQuantity: item.totalSoldQuantity,
    totalRevenue: item.totalRevenue,
    price:
      typeof giftBox?.basePrice === "number"
        ? giftBox.basePrice
        : item.totalSoldQuantity > 0
          ? item.totalRevenue / item.totalSoldQuantity
          : 0,
    image: imageUrl || FALLBACK_IMAGE,
  };
};

export function BestSellers({ onNavigate }: BestSellersProps) {
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState<BestSellerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingItemId, setAddingItemId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBestSellers = async () => {
      setLoading(true);
      setError(null);

      try {
        const { startDate, endDate } = getLastThirtyDaysRange();
        const response = await dashboardService.getBestSellers(
          startDate,
          endDate,
          4,
        );

        const items = response.data.data ?? [];
        const cards = await Promise.all(
          items.map(async (item) => {
            try {
              if (item.itemType === "GiftBox") {
                return await buildGiftBoxCard(item);
              }

              return await buildProductCard(item);
            } catch {
              return {
                id: item.itemId,
                name: item.itemName,
                itemType:
                  item.itemType === "GiftBox" ? "GiftBox" : "Product",
                soldQuantity: item.totalSoldQuantity,
                totalRevenue: item.totalRevenue,
                price:
                  item.totalSoldQuantity > 0
                    ? item.totalRevenue / item.totalSoldQuantity
                    : 0,
                image: FALLBACK_IMAGE,
              } satisfies BestSellerCard;
            }
          }),
        );

        if (isMounted) {
          setProducts(cards);
        }
      } catch {
        if (isMounted) {
          setError("Không thể tải danh sách bán chạy lúc này.");
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchBestSellers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewProduct = (product: BestSellerCard) => {
    setViewProduct({
      id: product.id,
      type: product.itemType === "GiftBox" ? "giftbox" : "individual",
    });
    onNavigate?.(APP_PAGES.PRODUCT);
  };

  const handleAddToCart = async (product: BestSellerCard) => {
    if (!isLoggedIn) {
      redirectToLogin(
        onNavigate,
        APP_PAGES.HOME,
        "Vui lòng đăng nhập để thêm vào giỏ hàng.",
      );
      return;
    }

    setAddingItemId(product.id);
    try {
      const result =
        product.itemType === "GiftBox"
          ? await addItem({ giftBoxId: product.id, quantity: 1 })
          : await addItem({ productId: product.id, quantity: 1 });

      if ((result as { error?: unknown })?.error == null) {
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng.`);
      } else {
        toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
      }
    } catch {
      toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
    } finally {
      setAddingItemId(null);
    }
  };

  return (
    <section className="py-20 bg-[#FFFDF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-4xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sản Phẩm Bán Chạy
          </h2>
          <p className="text-xl text-gray-600">
            Những món quà được yêu thích nhất trong 30 ngày gần đây
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mr-3" />
            Đang tải sản phẩm bán chạy...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-white px-6 py-10 text-center text-red-600">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-[#E8D9B5] bg-white px-6 py-10 text-center text-gray-600">
            Chưa có dữ liệu bán chạy trong 30 ngày gần đây.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={`${product.itemType}-${product.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      variant="outline"
                      className="bg-white text-gray-900 hover:bg-gray-100"
                      onClick={() => handleViewProduct(product)}
                    >
                      Xem nhanh
                    </Button>
                  </div>

                  <div className="absolute top-3 right-3 bg-[#B71C1C] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Bán chạy
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <button
                    type="button"
                    onClick={() => handleViewProduct(product)}
                    className="text-left text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] hover:text-[#B71C1C] transition-colors"
                  >
                    {product.name}
                  </button>

                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                    <Flame className="h-4 w-4 text-[#D4AF37]" />
                    <span>Đã bán {product.soldQuantity} sản phẩm</span>
                  </div>

                  <div className="text-2xl font-bold text-[#B71C1C] mb-4">
                    {product.price.toLocaleString("vi-VN")} đ
                  </div>

                  <Button
                    onClick={() => void handleAddToCart(product)}
                    disabled={addingItemId === product.id}
                    className="w-full rounded-full font-semibold hover:scale-105 transition-transform mt-auto"
                    style={{ backgroundColor: "#D4AF37", color: "white" }}
                  >
                    {addingItemId === product.id ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-5 w-5 mr-2" />
                    )}
                    Thêm vào giỏ
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-6 border-2 border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white font-semibold"
            onClick={() => onNavigate?.(APP_PAGES.LISTING)}
          >
            Xem Tất Cả Sản Phẩm
          </Button>
        </div>
      </div>
    </section>
  );
}
