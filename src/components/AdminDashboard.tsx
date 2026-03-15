import { useState, useEffect } from "react";
import { OrderManagement } from "./OrderManagement";
import dashboardService, {
  DashboardSummaryResponse,
  SalesTrendDto,
  OrderStatusChartDto,
  RecentOrderDto,
} from "../services/dashboardService";
import { ProductManagement } from "./ProductManagement";
import { CustomerManagement } from "./CustomerManagement";
import { AdminSettings } from "./AdminSettings";
import { CustomerManagementSplit } from "./CustomerManagementSplit";
import { RevenueReport } from "./RevenueReport";
import { VoucherManagement } from "./VoucherManagement";
import { HampersManagement } from "./HampersManagement";
import { CustomGiftManagement } from "./CustomGiftManagement";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import logoImage from "figma:asset/a3fa2786d2f68b7a9dfd274d63677f4d0b0ab4f1.png";
import useAuth from "../hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  TrendingUp,
  LogOut,
  AlertTriangle,
  Tag,
  Gift,
  Box,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AdminDashboardProps {
  onNavigate?: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#/admin/")) {
      const sub = hash.slice("#/admin/".length);
      if (sub) return sub;
    }
    return "dashboard";
  });
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isProductsExpanded, setIsProductsExpanded] = useState(() => {
    return window.location.hash.startsWith("#/admin/products-");
  });
  const [activeProductSubmenu, setActiveProductSubmenu] = useState<string | null>(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#/admin/products-")) return hash.slice("#/admin/".length);
    return null;
  });
  const [dashboardData, setDashboardData] =
    useState<DashboardSummaryResponse | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesTrendDto[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusChartDto[]>([]);
  const [recentOrdersApi, setRecentOrdersApi] = useState<RecentOrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get data for last 30 days
        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        const [summaryRes, trendRes, statusRes, recentRes] = await Promise.all([
          dashboardService.getSummary(startDate, endDate),
          dashboardService.getSalesTrend(startDate, endDate),
          dashboardService.getOrderStatus(startDate, endDate),
          dashboardService.getRecentOrders(5),
        ]);

        if (summaryRes.data.success) setDashboardData(summaryRes.data.data);
        if (trendRes.data.success) setSalesTrend(trendRes.data.data);
        if (statusRes.data.success) setOrderStatusData(statusRes.data.data);
        if (recentRes.data.success) setRecentOrdersApi(recentRes.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeMenu === "dashboard") {
      fetchDashboardData();
    }
  }, [activeMenu]);

  // Map order status to Vietnamese label and color for pie chart
  const STATUS_MAP: Record<string, { label: string; color: string }> = {
    Pending:        { label: "Chờ xử lý",    color: "#D4AF37" },
    Confirmed:      { label: "Đã xác nhận",  color: "#8B5CF6" },
    Processing:     { label: "Đang xử lý",   color: "#3B82F6" },
    Shipped:        { label: "Đang giao",    color: "#06B6D4" },
    OutForDelivery: { label: "Đang giao",    color: "#06B6D4" },
    Delivered:      { label: "Đã giao",      color: "#B71C1C" },
    Cancelled:      { label: "Đã hủy",       color: "#EF4444" },
    Returned:       { label: "Trả hàng",     color: "#6B7280" },
  };
  const FALLBACK_COLORS = ["#B71C1C", "#D4AF37", "#8B1538", "#C19A6B", "#3B82F6", "#6B7280"];

  const orderStatusChartData = orderStatusData.map((item, idx) => ({
    name: STATUS_MAP[item.statusName]?.label || item.statusName,
    value: item.count,
    color: STATUS_MAP[item.statusName]?.color || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
  }));

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      // Legacy mock keys
      pending:        { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ xử lý" },
      shipping:       { bg: "bg-blue-100",   text: "text-blue-800",   label: "Đang giao" },
      done:           { bg: "bg-green-100",  text: "text-green-800",  label: "Hoàn thành" },
      // API status strings
      Pending:        { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ xử lý" },
      Confirmed:      { bg: "bg-indigo-100", text: "text-indigo-800", label: "Đã xác nhận" },
      Processing:     { bg: "bg-purple-100", text: "text-purple-800", label: "Đang xử lý" },
      Shipped:        { bg: "bg-blue-100",   text: "text-blue-800",   label: "Đang giao" },
      OutForDelivery: { bg: "bg-cyan-100",   text: "text-cyan-800",   label: "Đang giao" },
      Delivered:      { bg: "bg-green-100",  text: "text-green-800",  label: "Hoàn thành" },
      Cancelled:      { bg: "bg-red-100",    text: "text-red-800",    label: "Đã hủy" },
      Returned:       { bg: "bg-gray-100",   text: "text-gray-800",   label: "Trả hàng" },
    };
    const badge = badges[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, hasSubmenu: false, children: null },
    { id: "products", label: "Sản Phẩm", icon: Package, hasSubmenu: true, children: null },
    { id: "orders", label: "Đơn Hàng", icon: ShoppingCart, hasSubmenu: false, children: null },
    { id: "customers", label: "Khách Hàng", icon: Users, hasSubmenu: false, children: null },
    { id: "vouchers", label: "Mã Giảm Giá", icon: Tag, hasSubmenu: false, children: null },
    { id: "reports", label: "Báo Cáo", icon: BarChart3, hasSubmenu: false, children: null },
    { id: "settings", label: "Cài Đặt", icon: Settings, hasSubmenu: false, children: null },
  ];

  const productSubmenuItems = [
    { id: "products-gift-box", label: "Giỏ Quà", icon: Gift },
    { id: "products-individual", label: "Sản Phẩm Lẻ", icon: Box },
    { id: "products-custom", label: "Sản Phẩm Thiết Kế", icon: Sparkles },
  ];

  const handleMenuClick = (menuId: string) => {
    if (menuId === "products") {
      setIsProductsExpanded(!isProductsExpanded);
      if (!isProductsExpanded) {
        setActiveMenu("products");
        window.location.hash = "#/admin/products";
      }
    } else {
      setActiveMenu(menuId);
      setIsProductsExpanded(false);
      setActiveProductSubmenu(null);
      window.location.hash = menuId === "dashboard" ? "#/admin" : `#/admin/${menuId}`;
    }
  };

  const handleSubmenuClick = (submenuId: string) => {
    setActiveProductSubmenu(submenuId);
    setActiveMenu(submenuId);
    window.location.hash = `#/admin/${submenuId}`;
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#B71C1C] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <img
            src={logoImage}
            alt="Tetdenroi.vn"
            className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity brightness-0 invert"
            onClick={() => onNavigate?.("home")}
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <div key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center justify-between px-6 py-3 text-left transition-all ${
                    isActive
                      ? "bg-[#D4AF37] text-white font-bold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </div>
                  {item.hasSubmenu && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isProductsExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Product Submenu with smooth animation */}
                {item.id === "products" && (
                  <div
                    className={`bg-white/5 overflow-hidden transition-all duration-300 ease-in-out ${
                      isProductsExpanded
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {productSubmenuItems.map((subitem, index) => {
                      const SubIcon = subitem.icon;
                      const isSubActive = activeProductSubmenu === subitem.id;
                      return (
                        <button
                          key={subitem.id}
                          onClick={() => handleSubmenuClick(subitem.id)}
                          className={`w-full flex items-center pl-14 pr-6 py-2.5 text-left transition-all duration-200 ${
                            isSubActive
                              ? "bg-[#D4AF37]/80 text-white font-semibold"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                          style={{
                            transitionDelay: isProductsExpanded
                              ? `${index * 50}ms`
                              : "0ms",
                          }}
                        >
                          <SubIcon className="h-4 w-4 mr-3" />
                          <span className="text-sm">{subitem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold">
              {user?.fullName
                ? user.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "AD"}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {user?.fullName || user?.username || "Admin User"}
              </p>
              <p className="text-xs text-white/60">
                {user?.email || "admin@tetdenroi.vn"}
              </p>
            </div>
            <button
              className="text-white/60 hover:text-white"
              onClick={async () => {
                await logout();
                onNavigate?.("home");
              }}
              title="Đăng xuất"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Conditionally render content based on active menu */}
        {activeMenu === "orders" ? (
          <OrderManagement />
        ) : activeMenu === "products-individual" ? (
          <ProductManagement />
        ) : activeMenu === "products-gift-box" ? (
          <HampersManagement onNavigate={onNavigate} />
        ) : activeMenu === "products-custom" ? (
          <CustomGiftManagement />
        ) : activeMenu === "customers" ? (
          <CustomerManagementSplit />
        ) : activeMenu === "vouchers" ? (
          <VoucherManagement />
        ) : activeMenu === "reports" ? (
          <RevenueReport />
        ) : activeMenu === "settings" ? (
          <AdminSettings />
        ) : (
          <>
            {/* Top Bar */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
              <div className="flex items-center justify-between px-8 py-4">
                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm đơn hàng, sản phẩm..."
                      className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                  {/* Date Range Picker */}
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#D4AF37] transition-colors">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">15/01 - 21/01</span>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>

                  {/* Notifications */}
                  <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="h-6 w-6 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="p-8">
              {/* Page Title */}
              <div className="mb-8">
                <h1
                  className="text-3xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Dashboard
                </h1>
                <p className="text-gray-600">
                  Tổng quan hoạt động kinh doanh hôm nay
                </p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-600">
                      Doanh Thu
                    </h3>
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <p
                    className="text-3xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {loading
                      ? "Đang tải..."
                      : formatCurrency(dashboardData?.totalRevenue || 0)}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 font-semibold">+15%</span>
                    <span className="text-gray-500 ml-2">
                      so với tuần trước
                    </span>
                  </div>
                </div>

                {/* New Orders */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-600">
                      Đơn Mới
                    </h3>
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <p
                    className="text-3xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {loading ? "..." : dashboardData?.totalOrders || 0}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-yellow-600 font-semibold">
                      24 chờ xử lý
                    </span>
                  </div>
                </div>

                {/* Products Sold */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-600">
                      Sản Phẩm Đã Bán
                    </h3>
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <p
                    className="text-3xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    3,456
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 font-semibold">+8%</span>
                    <span className="text-gray-500 ml-2">
                      so với tuần trước
                    </span>
                  </div>
                </div>

                {/* Low Stock Warning */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-600">
                      Cảnh Báo Tồn Kho
                    </h3>
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <p
                    className="text-3xl font-bold text-red-600 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    12
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-red-600 font-semibold">
                      Sắp hết hàng
                    </span>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3
                    className="text-xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Doanh Thu Theo Thời Gian
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        style={{ fontSize: "11px" }}
                        interval={Math.ceil(salesTrend.length / 7) - 1}
                      />
                      <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: "12px" }}
                        tickFormatter={(value) =>
                          `${(value / 1000000).toFixed(0)}M`
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Doanh thu"
                        stroke="#D4AF37"
                        strokeWidth={3}
                        dot={{ fill: "#D4AF37", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Sales Pie Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3
                    className="text-xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Trạng Thái Đơn Hàng
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={orderStatusChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value} đơn`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Đơn Hàng Gần Đây
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Mã Đơn
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Khách Hàng
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Ngày Đặt
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Số Tiền
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Trạng Thái
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Hành Động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrdersApi.length === 0 && !loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                            Chưa có đơn hàng nào.
                          </td>
                        </tr>
                      ) : (
                        recentOrdersApi.map((order) => (
                          <tr
                            key={order.orderId}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-900">
                                {order.orderNumber}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-700">
                                {order.customerName}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatCurrency(order.finalAmount)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#B71C1C] border-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
                              >
                                Chi Tiết
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
