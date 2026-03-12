import { useState, useEffect } from "react";
import {
  User,
  Edit3,
  Package,
  MapPin,
  Lock,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import useAuth from "../hooks/useAuth";
import orderService, {
  OrderResponse,
  OrderStatus,
  orderStatusLabels,
} from "../services/orderService";

interface OrderHistoryProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type TabFilter = "all" | "to-pay" | "to-ship" | "completed" | "cancelled";

export function OrderHistory({ onNavigate, onLogout }: OrderHistoryProps) {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("orders");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getAll();
        if (res.data.success) setOrders(res.data.data);
      } catch {
        setError("Không thể tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Map tab → OrderStatus values
  const TAB_STATUS_MAP: Record<TabFilter, OrderStatus[] | null> = {
    "all":       null,
    "to-pay":    [OrderStatus.Pending],
    "to-ship":   [OrderStatus.Confirmed, OrderStatus.Processing, OrderStatus.Shipping],
    "completed": [OrderStatus.Delivered],
    "cancelled": [OrderStatus.Cancelled, OrderStatus.Returned],
  };

  const filteredOrders = orders.filter((o) => {
    const allowed = TAB_STATUS_MAP[activeTab];
    if (!allowed) return true;
    return allowed.includes(o.currentStatus);
  });

  const STATUS_TEXT_COLORS: Record<number, string> = {
    [OrderStatus.Pending]:    "text-yellow-600",
    [OrderStatus.Confirmed]:  "text-blue-600",
    [OrderStatus.Processing]: "text-blue-600",
    [OrderStatus.Shipping]:   "text-indigo-600",
    [OrderStatus.Delivered]:  "text-green-600",
    [OrderStatus.Cancelled]:  "text-gray-500",
    [OrderStatus.Returned]:   "text-gray-500",
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + "đ";

  const tabs = [
    { id: "all",       label: "Tất cả" },
    { id: "to-pay",    label: "Chờ thanh toán" },
    { id: "to-ship",   label: "Đang vận chuyển" },
    { id: "completed", label: "Đã giao" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  const handleLogout = async () => {
    await logout();
    onLogout?.();
    onNavigate?.("home");
  };

  const displayName = user?.fullName || user?.username || "Khách";

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation (Same as Profile) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* User Summary Card */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#B71C1C] to-[#8B1538] flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-white" />
                  </div>

                  {/* Welcome Text */}
                  <h3
                    className="text-lg font-bold text-gray-900 mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Xin chào,
                  </h3>
                  <p className="text-base font-semibold text-gray-800 mb-2">
                    {displayName}
                  </p>

                  {/* Edit Link */}
                  <button className="flex items-center gap-1 text-sm text-[#B71C1C] hover:text-[#8B1538] transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="font-medium">Sửa hồ sơ</span>
                  </button>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-2">
                <button
                  onClick={() => {
                    setActiveSection("account");
                    onNavigate?.("profile");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === "account"
                      ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Thông tin tài khoản</span>
                </button>

                <button
                  onClick={() => setActiveSection("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === "orders"
                      ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Quản lý đơn hàng</span>
                </button>

                <button
                  onClick={() => setActiveSection("addresses")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === "addresses"
                      ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Sổ địa chỉ</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection("password");
                    onNavigate?.("change-password");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === "password"
                      ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span>Đổi mật khẩu</span>
                </button>

                <div className="border-t border-gray-100 my-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-[#B71C1C] transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Right Column - Order List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Header */}
              <div className="mb-6">
                <h1
                  className="text-3xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Đơn hàng của tôi
                </h1>

                {/* Filter Tabs */}
                <div className="flex gap-6 border-b border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as OrderStatus)}
                      className={`pb-3 font-semibold transition-all relative ${
                        activeTab === tab.id
                          ? "text-[#B71C1C]"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B71C1C]"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Cards List */}
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-16 text-gray-400">Đang tải đơn hàng...</div>
                )}
                {error && (
                  <div className="text-center py-8 text-red-500">{error}</div>
                )}
                {!loading && !error && filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-700">
                          Shop: Tetdenroi.vn
                        </span>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <span className={`text-sm font-semibold ${STATUS_TEXT_COLORS[order.currentStatus] ?? "text-gray-600"}`}>
                          {orderStatusLabels[order.currentStatus] ?? order.currentStatus}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        #{order.orderNumber}
                      </span>
                    </div>

                    {/* Product Rows */}
                    <div className="p-6 space-y-4">
                      {order.orderDetails.map((detail) => (
                        <div key={detail.id} className="flex items-center gap-4">
                          {/* Thumbnail placeholder */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-100 flex items-center justify-center text-3xl">
                            {detail.productImage
                              ? <img src={detail.productImage} alt={detail.productName ?? ""} className="w-full h-full object-cover" />
                              : "🎁"}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {detail.productName || "Sản phẩm"}
                            </h3>
                            <p className="text-sm text-gray-600">x{detail.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {formatCurrency(detail.unitPrice)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Card Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                      <div>
                        {order.currentStatus === OrderStatus.Cancelled && (
                          <p className="text-sm text-gray-500">Đã hủy bời bạn</p>
                        )}
                        <p className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                          <p className="text-sm text-gray-600 mb-1">Thành tiền:</p>
                          <p className="text-xl font-bold text-[#B71C1C]">
                            {formatCurrency(order.finalAmount)}
                          </p>
                        </div>

                        {(order.currentStatus === OrderStatus.Pending ||
                          order.currentStatus === OrderStatus.Confirmed ||
                          order.currentStatus === OrderStatus.Processing) && (
                          <Button
                            variant="outline"
                            className="border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white transition-colors font-semibold"
                          >
                            Liên hệ Shop
                          </Button>
                        )}

                        {order.currentStatus === OrderStatus.Delivered && (
                          <div className="flex gap-2">
                            <Button className="bg-[#D4AF37] hover:bg-[#B8962E] text-white font-semibold">
                              Mua Lại
                            </Button>
                            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold">
                              Đánh giá
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {!loading && !error && filteredOrders.length === 0 && (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Chưa có đơn hàng
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!
                  </p>
                  <Button
                    onClick={() => onNavigate?.("home")}
                    className="bg-[#D4AF37] hover:bg-[#B8962E] text-white font-semibold"
                  >
                    Mua sắm ngay
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}