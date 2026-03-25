import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/constants/env";
import useCatalog from "@/hooks/useCatalog";
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  FileText,
  ChevronRight,
  Home,
  Truck,
  Clock,
  Receipt,
} from "lucide-react";

interface OrderDetail {
  id: string;
  productId: string;
  giftBoxId: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderHistory {
  id: string;
  status: number;
  note: string;
  changedBy: string;
  createdAt: string;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  userId: string;
  voucherId?: string | null;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  currentStatus: number;
  paymentMethod: string;
  shippingAddress: string;
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  createdAt: string;
  note?: string | null;
  orderDetails: OrderDetail[];
  orderHistories: OrderHistory[];
}

interface OrderSuccessProps {
  orderData: OrderData | null;
  onNavigate: (page: string) => void;
}

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const normalizeImageUrl = (url: string | null | undefined): string | null => {
  if (!url) {
    return null;
  }

  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:")) {
    return url;
  }

  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
};

export function OrderSuccess({ orderData, onNavigate }: OrderSuccessProps) {
  const { fetchGiftBoxDetail, fetchProductDetail } = useCatalog();
  const [showDetails, setShowDetails] = useState(true);
  const [enrichedDetails, setEnrichedDetails] = useState<Record<string, { name: string; image: string | null }>>({});

  useEffect(() => {
    if (!orderData) return;
    const fetchItemInfo = async () => {
      const result: Record<string, { name: string; image: string | null }> = {};
      await Promise.all(
        orderData.orderDetails.map(async (item) => {
          try {
            if (item.giftBoxId) {
              const box = await fetchGiftBoxDetail(item.giftBoxId);
              const img = box?.images?.find((i: { isMain: boolean; url: string }) => i.isMain)?.url ?? box?.images?.[0]?.url ?? null;
              result[item.id] = {
                name: box?.name ?? "Giỏ Quà",
                image: normalizeImageUrl(img),
              };
            } else if (item.productId) {
              const productData = await fetchProductDetail(item.productId);
              const prod = productData.product;
              const img = prod?.images?.find((i: { isMain: boolean; url: string }) => i.isMain)?.url ?? prod?.images?.[0]?.url ?? null;
              result[item.id] = {
                name: prod?.name ?? "Sản Phẩm",
                image: normalizeImageUrl(img),
              };
            }
          } catch {
            result[item.id] = { name: item.giftBoxId ? "Giỏ Quà" : "Sản Phẩm", image: null };
          }
        })
      );
      setEnrichedDetails(result);
    };
    fetchItemInfo();
  }, [orderData]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFDF5] via-white to-[#FFF8E7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-6">Không tìm thấy thông tin đơn hàng</p>
          <button
            onClick={() => onNavigate("home")}
            className="px-6 py-3 bg-gradient-to-r from-[#B71C1C] to-[#8B1538] text-white rounded-xl hover:from-[#8B1538] hover:to-[#B71C1C] transition-all font-semibold"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "COD": return "Thanh toán khi nhận hàng (COD)";
      case "MoMo": return "Ví điện tử MoMo";
      case "BankTransfer": return "Chuyển khoản ngân hàng";
      default: return method;
    }
  };

  // 0=Pending,1=Confirmed,2=Processing,3=Shipping,4=Delivered,5=Cancelled,6=Returned
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return "text-yellow-700 bg-yellow-100";   // Pending
      case 1: return "text-blue-700 bg-blue-100";       // Confirmed
      case 2: return "text-indigo-700 bg-indigo-100";   // Processing
      case 3: return "text-purple-700 bg-purple-100";   // Shipping
      case 4: return "text-emerald-700 bg-emerald-100"; // Delivered
      case 5: return "text-red-700 bg-red-100";         // Cancelled
      case 6: return "text-gray-700 bg-gray-100";       // Returned
      default: return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return "Chờ xác nhận";
      case 1: return "Đã xác nhận";
      case 2: return "Đang xử lý";
      case 3: return "Đang giao hàng";
      case 4: return "Đã giao hàng";
      case 5: return "Đã hủy";
      case 6: return "Đã hoàn trả";
      default: return `Trạng thái ${status}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF5] via-white to-[#FFF8E7]">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-xl text-white/90 mb-2">
            Cảm ơn quý khách đã tin tưởng TếtĐếnRồi.vn
          </p>
          <p className="text-white/80">
            Đơn hàng của bạn đã được tiếp nhận và đang được xử lý
          </p>
        </div>
      </div>

      {/* Order Info */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Order Number Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-2 border-[#D4AF37]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
              <p
                className="text-3xl font-bold text-[#B71C1C]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {orderData.orderNumber}
              </p>
            </div>
            <div className={`px-6 py-3 rounded-full font-bold ${getStatusColor(orderData.currentStatus)}`}>
              {getStatusLabel(orderData.currentStatus)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-[#D4AF37] mt-1" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Ngày đặt hàng</p>
                <p className="font-semibold text-gray-900">{formatDate(orderData.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-[#D4AF37] mt-1" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Phương thức thanh toán</p>
                <p className="font-semibold text-gray-900">{getPaymentMethodLabel(orderData.paymentMethod)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-[#D4AF37] mt-1" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Phí vận chuyển</p>
                <p className="font-semibold text-gray-900">
                  {orderData.shippingFee === 0 ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    formatCurrency(orderData.shippingFee)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-[#B71C1C]" />
            <h3 className="text-xl font-bold text-gray-900">Địa Chỉ Giao Hàng</h3>
          </div>
          <p className="text-gray-700 leading-relaxed pl-9">{orderData.shippingAddress}</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-[#B71C1C]" />
              <h3 className="text-xl font-bold text-gray-900">Chi Tiết Đơn Hàng</h3>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[#D4AF37] hover:text-[#B8941F] transition-colors font-semibold"
            >
              {showDetails ? "Ẩn" : "Hiển thị"}
            </button>
          </div>

          {showDetails && (
            <div className="space-y-3 mb-6">
              {orderData.orderDetails.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-purple-200 flex-shrink-0 bg-gray-100 flex items-center justify-center text-2xl">
                      {enrichedDetails[item.id]?.image
                        ? <img src={enrichedDetails[item.id].image!} alt={enrichedDetails[item.id].name} className="w-full h-full object-cover" />
                        : (item.giftBoxId ? "🎁" : "📦")}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {enrichedDetails[item.id]?.name ?? (item.giftBoxId ? "Giỏ Quà" : "Sản Phẩm")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Số lượng: <span className="font-semibold">{item.quantity}</span> × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#B71C1C]">{formatCurrency(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price Summary */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Tạm tính:</span>
              <span className="font-semibold">{formatCurrency(orderData.totalAmount)}</span>
            </div>

            {orderData.discountAmount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Giảm giá (Voucher):</span>
                <span className="font-semibold">-{formatCurrency(orderData.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-700">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold">
                {orderData.shippingFee === 0 ? (
                  <span className="text-green-600">Miễn phí</span>
                ) : (
                  formatCurrency(orderData.shippingFee)
                )}
              </span>
            </div>

            <div className="flex justify-between text-2xl font-bold text-[#B71C1C] pt-3 border-t-2 border-gray-300">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(orderData.finalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        {orderData.note && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-6 w-6 text-[#B71C1C]" />
              <h3 className="text-xl font-bold text-gray-900">Ghi Chú</h3>
            </div>
            <p className="text-gray-700 pl-9 italic">{orderData.note}</p>
          </div>
        )}

        {/* Order History */}
        {orderData.orderHistories && orderData.orderHistories.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-[#B71C1C]" />
              <h3 className="text-xl font-bold text-gray-900">Lịch Sử Đơn Hàng</h3>
            </div>
            <div className="space-y-3">
              {orderData.orderHistories.map((history) => (
                <div
                  key={history.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(history.status)}`}>
                        {getStatusLabel(history.status)}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(history.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{history.note}</p>
                    <p className="text-xs text-gray-500 mt-1">Bởi: {history.changedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracking Number */}
        {orderData.trackingNumber && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mb-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <Receipt className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Mã Vận Đơn</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 pl-9">{orderData.trackingNumber}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => onNavigate("home")}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-300 rounded-xl hover:border-[#D4AF37] hover:bg-yellow-50 transition-all font-semibold"
          >
            <Home className="h-5 w-5" />
            Về Trang Chủ
          </button>

          <button
            onClick={() => onNavigate("order-history")}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#B71C1C] to-[#8B1538] text-white rounded-xl hover:from-[#8B1538] hover:to-[#B71C1C] transition-all font-semibold shadow-lg"
          >
            Xem Đơn Hàng Của Tôi
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
          <h4 className="font-bold text-gray-900 mb-3">📞 Cần hỗ trợ?</h4>
          <p className="text-sm text-gray-700 mb-2">
            Nếu bạn có bất kỳ thắc mắc nào về đơn hàng, vui lòng liên hệ:
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">
              📧 Email:{" "}
              <a href="mailto:support@tetdenroi.vn" className="text-[#B71C1C] font-semibold hover:underline">
                support@tetdenroi.vn
              </a>
            </p>
            <p className="text-gray-700">
              📱 Hotline:{" "}
              <a href="tel:1900xxxx" className="text-[#B71C1C] font-semibold hover:underline">
                1900 xxxx
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
