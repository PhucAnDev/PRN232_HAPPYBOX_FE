import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ClipboardList,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { API_BASE_URL } from "@/constants/env";
import useCatalog from "@/hooks/useCatalog";
import useOrders from "@/hooks/useOrders";
import {
  OrderStatus,
  orderStatusColors,
  orderStatusLabels,
} from "@/services/orderService";
import type { OrderHistoryResponse, OrderResponse } from "@/services/orderService";
import type { GiftBoxResponse } from "@/services/giftBoxService";
import type { ProductResponse } from "@/services/productService";

interface OrderTrackingProps {
  onNavigate?: (page: string) => void;
}

interface TrackingStep {
  id: number;
  title: string;
  description: string;
  icon: typeof ClipboardList;
}

interface TrackedItem {
  key: string;
  title: string;
  subtitle: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
const FALLBACK_ITEM_IMAGE =
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400";

const TRACKING_STEPS: TrackingStep[] = [
  {
    id: 0,
    title: "Chờ xử lý",
    description: "Đơn hàng đã được tiếp nhận",
    icon: ClipboardList,
  },
  {
    id: 1,
    title: "Đang xử lý",
    description: "Đơn hàng đang được chuẩn bị",
    icon: Package,
  },
  {
    id: 2,
    title: "Đang giao",
    description: "Đơn hàng đang trên đường giao",
    icon: Truck,
  },
  {
    id: 3,
    title: "Hoàn thành",
    description: "Đơn hàng đã giao thành công",
    icon: CheckCircle,
  },
];

const normalizeText = (value: string) => value.trim().toLowerCase();

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );

const formatCurrency = (value: number) =>
  `${new Intl.NumberFormat("vi-VN").format(value || 0)}đ`;

const formatDate = (value?: string | null) => {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const resolveImageUrl = (url?: string | null) => {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${API_ORIGIN}${url}`;
  }

  return `${API_ORIGIN}/${url.replace(/^\/+/, "")}`;
};

const pickMainImageUrl = (
  images?: Array<{ url: string; isMain?: boolean; sortOrder?: number }>,
) => {
  if (!images || images.length === 0) {
    return "";
  }

  const mainImage = images.find((image) => image.isMain);
  if (mainImage?.url) {
    return mainImage.url;
  }

  const sortedImages = [...images].sort(
    (left, right) => (left.sortOrder ?? 999) - (right.sortOrder ?? 999),
  );

  return sortedImages[0]?.url ?? "";
};

const getProgressIndex = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return 0;
    case OrderStatus.Confirmed:
    case OrderStatus.Processing:
      return 1;
    case OrderStatus.Shipping:
      return 2;
    case OrderStatus.Delivered:
      return 3;
    case OrderStatus.Cancelled:
    case OrderStatus.Returned:
      return 0;
    default:
      return 0;
  }
};

const getTrackingStepState = (
  currentStatus: OrderStatus,
  stepIndex: number,
  currentStepIndex: number,
) => {
  const isTerminal =
    currentStatus === OrderStatus.Cancelled ||
    currentStatus === OrderStatus.Returned;

  if (isTerminal) {
    return {
      isCompleted: false,
      isActive: stepIndex === currentStepIndex,
    };
  }

  return {
    isCompleted: stepIndex < currentStepIndex,
    isActive: stepIndex === currentStepIndex,
  };
};

const getStatusBadgeLabel = (status: OrderStatus) =>
  orderStatusLabels[status] ?? "Đang cập nhật";

const getItemSnapshot = (
  detail: OrderResponse["orderDetails"][number],
  product?: ProductResponse,
  giftBox?: GiftBoxResponse,
): TrackedItem => {
  const imageUrl = resolveImageUrl(
    pickMainImageUrl(product?.images) || pickMainImageUrl(giftBox?.images),
  );

  if (detail.productId) {
    return {
      key: detail.id,
      title: product?.name ?? "Sản phẩm",
      subtitle: product?.sku ? `SKU: ${product.sku}` : "Sản phẩm lẻ",
      image: imageUrl || FALLBACK_ITEM_IMAGE,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
      totalPrice: detail.totalPrice,
    };
  }

  return {
    key: detail.id,
    title: giftBox?.name ?? "Giỏ quà",
    subtitle: giftBox?.code ? `Mã: ${giftBox.code}` : "Giỏ quà",
    image: imageUrl || FALLBACK_ITEM_IMAGE,
    quantity: detail.quantity,
    unitPrice: detail.unitPrice,
    totalPrice: detail.totalPrice,
  };
};

export function OrderTracking({ onNavigate }: OrderTrackingProps) {
  const [orderNumber, setOrderNumber] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { fetchOrders, fetchOrderDetail } = useOrders();
  const {
    fetchGiftBoxDetail,
    fetchProductDetail,
    giftBoxDetailsById,
    productDetailsById,
  } = useCatalog();

  const currentStepIndex = selectedOrder
    ? getProgressIndex(selectedOrder.currentStatus)
    : 0;

  const sortedHistories = useMemo<OrderHistoryResponse[]>(() => {
    if (!selectedOrder?.orderHistories) {
      return [];
    }

    return [...selectedOrder.orderHistories].sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    );
  }, [selectedOrder]);

  const trackedItems = useMemo<TrackedItem[]>(() => {
    if (!selectedOrder) {
      return [];
    }

    return selectedOrder.orderDetails.map((detail) =>
      getItemSnapshot(
        detail,
        detail.productId ? productDetailsById[detail.productId] : undefined,
        detail.giftBoxId ? giftBoxDetailsById[detail.giftBoxId] : undefined,
      ),
    );
  }, [giftBoxDetailsById, productDetailsById, selectedOrder]);

  const loadOrderItemDetails = async (order: OrderResponse) => {
    const tasks = order.orderDetails.flatMap((detail) => {
      if (detail.productId && !productDetailsById[detail.productId]) {
        return [fetchProductDetail(detail.productId)];
      }

      if (detail.giftBoxId && !giftBoxDetailsById[detail.giftBoxId]) {
        return [fetchGiftBoxDetail(detail.giftBoxId)];
      }

      return [];
    });

    if (tasks.length > 0) {
      await Promise.allSettled(tasks);
    }
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSearched(true);
    setSearchError(null);
    setSelectedOrder(null);

    const trimmedOrderNumber = orderNumber.trim();
    if (!trimmedOrderNumber) {
      setSearchError("Vui lòng nhập mã đơn hàng để tra cứu.");
      return;
    }

    setIsSearching(true);

    try {
      let matchedOrder: OrderResponse | null = null;
      const orders = await fetchOrders();
      matchedOrder =
        orders.find(
          (order) =>
            normalizeText(order.orderNumber) === normalizeText(trimmedOrderNumber),
        ) ?? null;

      if (!matchedOrder && isUuid(trimmedOrderNumber)) {
        try {
          matchedOrder = await fetchOrderDetail(trimmedOrderNumber);
        } catch {
          matchedOrder = null;
        }
      }

      if (!matchedOrder) {
        setSearchError("Không tìm thấy đơn hàng với mã bạn đã nhập.");
        return;
      }

      const detailedOrder = await fetchOrderDetail(matchedOrder.id).catch(
        () => matchedOrder as OrderResponse,
      );

      setSelectedOrder(detailedOrder);
      await loadOrderItemDetails(detailedOrder);
    } catch (error) {
      const fallbackMessage = "Không thể tra cứu đơn hàng lúc này.";
      const maybeError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setSearchError(
        maybeError?.response?.data?.message ||
          maybeError?.message ||
          fallbackMessage,
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#FFFDF5]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <section className="relative bg-gradient-to-br from-[#FFFDF5] via-white to-[#FFFDF5] py-20">
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #B71C1C 0, #B71C1C 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-[#B71C1C]/10 px-6 py-2 text-sm font-semibold text-[#B71C1C]">
              <Package className="mr-2 h-4 w-4" />
              THEO DÕI ĐƠN HÀNG
            </div>

            <h1
              className="mb-4 text-4xl font-bold text-[#B71C1C] md:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Theo Dõi Đơn Hàng Của Bạn
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Phiên bản hiện tại tra cứu theo mã đơn hàng và hiển thị các dữ liệu
              backend đang hỗ trợ.
            </p>
          </div>

          <div className="rounded-2xl border border-[#D4AF37]/20 bg-white p-8 shadow-xl">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Mã đơn hàng <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      value={orderNumber}
                      onChange={(event) => setOrderNumber(event.target.value)}
                      placeholder="ORD-202603211230-ABCD"
                      className="w-full rounded-lg border-2 border-gray-300 py-3 pl-12 pr-4 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Số điện thoại / Email
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      value={contactInfo}
                      onChange={(event) => setContactInfo(event.target.value)}
                      placeholder="Trường này đang là thông tin tham chiếu"
                      className="w-full rounded-lg border-2 border-gray-300 py-3 pl-12 pr-4 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                API hiện tại chưa hỗ trợ lọc theo số điện thoại hoặc email. Trang
                này đang tra cứu theo mã đơn hàng và hiển thị trạng thái, lịch sử,
                vận chuyển, tổng tiền cùng danh sách sản phẩm.
              </div>

              <Button
                type="submit"
                disabled={isSearching}
                className="w-full rounded-lg py-6 text-lg font-semibold shadow-lg transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: "#D4AF37", color: "white" }}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang tra cứu...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Tra cứu ngay
                  </>
                )}
              </Button>
            </form>

            {searchError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>{searchError}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedOrder && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-t-2xl bg-gradient-to-r from-[#B71C1C] to-[#8B0000] px-8 py-6 text-white">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2
                    className="mb-2 text-2xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Đơn hàng #{selectedOrder.orderNumber}
                  </h2>
                  <div className="flex items-center gap-2 text-white/90">
                    <Calendar className="h-4 w-4" />
                    <span>Ngày đặt: {formatDate(selectedOrder.createdAt)}</span>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold ${orderStatusColors[selectedOrder.currentStatus] ?? "bg-white/10 text-white"}`}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  {getStatusBadgeLabel(selectedOrder.currentStatus)}
                </div>
              </div>
            </div>

            <div className="rounded-b-2xl border-x border-b border-gray-200 bg-white shadow-xl">
              <div className="border-b border-gray-200 px-8 py-12">
                {(selectedOrder.currentStatus === OrderStatus.Cancelled ||
                  selectedOrder.currentStatus === OrderStatus.Returned) && (
                  <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Đơn hàng hiện đang ở trạng thái{" "}
                    <strong>{getStatusBadgeLabel(selectedOrder.currentStatus)}</strong>.
                    Thanh tiến trình bên dưới chỉ thể hiện mốc xử lý gần nhất trước
                    khi đơn dừng.
                  </div>
                )}

                <div className="relative">
                  <div className="absolute left-0 right-0 top-8 h-1 bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-[#D4AF37] transition-all duration-500"
                      style={{
                        width: `${(currentStepIndex / (TRACKING_STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="relative grid grid-cols-2 gap-6 md:grid-cols-4">
                    {TRACKING_STEPS.map((step, index) => {
                      const StepIcon = step.icon;
                      const { isActive, isCompleted } = getTrackingStepState(
                        selectedOrder.currentStatus,
                        index,
                        currentStepIndex,
                      );

                      return (
                        <div key={step.id} className="flex flex-col items-center">
                          <div
                            className={[
                              "mb-3 flex h-16 w-16 items-center justify-center rounded-full transition-all",
                              isCompleted ? "bg-green-500 text-white" : "",
                              isActive ? "bg-[#D4AF37] text-white" : "",
                              !isCompleted && !isActive
                                ? "bg-gray-200 text-gray-400"
                                : "",
                            ].join(" ")}
                          >
                            <StepIcon className="h-8 w-8" />
                          </div>
                          <h4
                            className={[
                              "mb-1 text-center text-sm font-bold",
                              isCompleted || isActive
                                ? "text-gray-900"
                                : "text-gray-400",
                            ].join(" ")}
                          >
                            {step.title}
                          </h4>
                          <p className="hidden text-center text-xs text-gray-500 sm:block">
                            {step.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 border-b border-gray-200 px-8 py-8 lg:grid-cols-2">
                <div>
                  <h3
                    className="mb-6 text-xl font-bold text-[#B71C1C]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Thông Tin Đơn Hàng
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D4AF37]" />
                      <div>
                        <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.shippingAddress || "--"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D4AF37]" />
                      <div>
                        <p className="text-sm text-gray-600">Phương thức vận chuyển</p>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.shippingMethod || "Đang cập nhật"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D4AF37]" />
                      <div>
                        <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.paymentMethod || "--"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D4AF37]" />
                      <div>
                        <p className="text-sm text-gray-600">Mã vận đơn</p>
                        <p className="font-semibold text-[#B71C1C]">
                          {selectedOrder.trackingNumber || "Chưa có mã vận đơn"}
                        </p>
                      </div>
                    </div>

                    {selectedOrder.note && (
                      <div className="rounded-xl border border-gray-200 bg-[#FFFDF5] p-4 text-sm text-gray-700">
                        <p className="mb-1 font-semibold text-gray-900">Ghi chú đơn hàng</p>
                        <p>{selectedOrder.note}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3
                    className="mb-6 text-xl font-bold text-[#B71C1C]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Lịch Sử Trạng Thái
                  </h3>

                  {sortedHistories.length > 0 ? (
                    <div className="space-y-4">
                      {sortedHistories.map((history, index) => (
                        <div key={history.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="h-3 w-3 rounded-full bg-[#D4AF37]" />
                            {index < sortedHistories.length - 1 && (
                              <div className="mt-1 h-full w-px bg-gray-200" />
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="font-semibold text-gray-900">
                              {orderStatusLabels[history.status] ?? "Cập nhật trạng thái"}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              {history.note || "Hệ thống đã cập nhật trạng thái đơn hàng."}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatDate(history.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-600">
                      Chưa có lịch sử cập nhật chi tiết cho đơn hàng này.
                    </div>
                  )}
                </div>
              </div>

              <div className="px-8 py-8">
                <h3
                  className="mb-6 text-xl font-bold text-[#B71C1C]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Sản Phẩm Trong Đơn Hàng
                </h3>

                <div className="space-y-4">
                  {trackedItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-4 rounded-lg border border-gray-200 bg-[#FFFDF5] p-4"
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="mb-1 font-semibold text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500">{item.subtitle}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          Số lượng: {item.quantity} x {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#B71C1C]">
                          {formatCurrency(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-3 border-t border-gray-200 pt-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Giảm giá:</span>
                    <span className="font-semibold">
                      {formatCurrency(selectedOrder.discountAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold">
                      {formatCurrency(selectedOrder.shippingFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-300 pt-3 text-xl font-bold">
                    <span className="text-gray-900">Tổng cộng:</span>
                    <span
                      className="text-[#D4AF37]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {formatCurrency(selectedOrder.finalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {hasSearched && !selectedOrder && !searchError && (
        <section className="bg-white py-10">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10">
              <Package className="mx-auto mb-4 h-10 w-10 text-gray-400" />
              <p className="text-gray-600">
                Chưa có kết quả phù hợp với mã đơn hàng bạn vừa nhập.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#FFFDF5] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h3
            className="mb-4 text-2xl font-bold text-[#B71C1C]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Cần Hỗ Trợ?
          </h3>
          <p className="mb-8 text-gray-600">
            Nếu bạn cần hỗ trợ thêm về đơn hàng, đội ngũ chăm sóc khách hàng luôn
            sẵn sàng giúp bạn.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              className="rounded-full px-8 py-6 font-semibold"
              style={{ backgroundColor: "#D4AF37", color: "white" }}
            >
              <Phone className="mr-2 h-5 w-5" />
              Gọi: 1900 8888
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-2 border-[#B71C1C] px-8 py-6 font-semibold text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
            >
              <Mail className="mr-2 h-5 w-5" />
              Email: support@tetdenroi.vn
            </Button>
            {onNavigate && (
              <Button
                variant="ghost"
                className="rounded-full px-8 py-6 font-semibold text-[#B71C1C] hover:bg-[#B71C1C]/5"
                onClick={() => onNavigate("home")}
              >
                Về trang chủ
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
