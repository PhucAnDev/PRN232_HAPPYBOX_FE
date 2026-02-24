import { useState } from "react";
import {
  User,
  Edit3,
  Package,
  MapPin,
  Lock,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface OrderHistoryProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type OrderStatus =
  | "all"
  | "to-pay"
  | "to-ship"
  | "completed"
  | "cancelled";

interface Order {
  id: string;
  status: "processing" | "completed" | "cancelled";
  statusText: string;
  statusColor: string;
  productImage: string;
  productName: string;
  quantity: number;
  price: string;
  total: string;
  cancelReason?: string;
}

export function OrderHistory({ onNavigate, onLogout }: OrderHistoryProps) {
  const [activeSection, setActiveSection] = useState("orders");
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");

  const orders: Order[] = [
    {
      id: "#ORD-2025-009",
      status: "processing",
      statusText: "Đang xử lý",
      statusColor: "text-blue-600",
      productImage: "https://images.unsplash.com/photo-1761479267954-983e006443f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWQlMjBnaWZ0JTIwYm94fGVufDF8fHx8MTc2ODQ4NzU0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      productName: "Hộp Quà Phú Quý",
      quantity: 1,
      price: "1.500.000đ",
      total: "1.500.000đ",
    },
    {
      id: "#ORD-2024-888",
      status: "completed",
      statusText: "Giao hàng thành công",
      statusColor: "text-green-600",
      productImage: "https://images.unsplash.com/photo-1610631787813-9eeb1a2386cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB3aW5lJTIwYm90dGxlfGVufDF8fHx8MTc2ODQxMjkxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      productName: "Rượu Vang Đỏ",
      quantity: 2,
      price: "1.000.000đ",
      total: "2.000.000đ",
    },
    {
      id: "#ORD-2024-777",
      status: "cancelled",
      statusText: "Đã hủy",
      statusColor: "text-gray-500",
      productImage: "https://images.unsplash.com/photo-1615485737643-406ce5bac81f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwbnV0cyUyMGdpZnQlMjBib3h8ZW58MXx8fHwxNzY4NDg3OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      productName: "Hộp Hạt Dinh Dưỡng",
      quantity: 1,
      price: "800.000đ",
      total: "800.000đ",
      cancelReason: "Đã hủy bởi bạn",
    },
  ];

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "to-pay", label: "Chờ thanh toán" },
    { id: "to-ship", label: "Đang vận chuyển" },
    { id: "completed", label: "Đã giao" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  const handleLogout = () => {
    onLogout?.();
    onNavigate?.("home");
  };

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
                    Nguyễn Văn An
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
                {orders.map((order) => (
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
                        <span className={`text-sm font-semibold ${order.statusColor}`}>
                          {order.statusText}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {order.id}
                      </span>
                    </div>

                    {/* Product Row */}
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Product Thumbnail */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          <ImageWithFallback
                            src={order.productImage}
                            alt={order.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {order.productName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            x{order.quantity}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{order.price}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                      <div>
                        {order.cancelReason && (
                          <p className="text-sm text-gray-500">
                            {order.cancelReason}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Total */}
                        <div className="text-right mr-4">
                          <p className="text-sm text-gray-600 mb-1">
                            Thành tiền:
                          </p>
                          <p className="text-xl font-bold text-[#B71C1C]">
                            {order.total}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        {order.status === "processing" && (
                          <Button
                            variant="outline"
                            className="border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white transition-colors font-semibold"
                          >
                            Liên hệ Shop
                          </Button>
                        )}

                        {order.status === "completed" && (
                          <div className="flex gap-2">
                            <Button
                              className="bg-[#D4AF37] hover:bg-[#B8962E] text-white font-semibold"
                            >
                              Mua Lại
                            </Button>
                            <Button
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
                            >
                              Đánh giá
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State (if needed) */}
              {orders.length === 0 && (
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