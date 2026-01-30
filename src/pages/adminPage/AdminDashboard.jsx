import { useState } from "react";
import { OrderManagement } from "./OrderManagement";
import { ProductManagement } from "./ProductManagement";
import { AdminSettings } from "./AdminSettings";
import { CustomerManagementSplit } from "./CustomerManagementSplit";
import { RevenueReport } from "./RevenueReport";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import logoImage from "figma:asset/a3fa2786d2f68b7a9dfd274d63677f4d0b0ab4f1.png";
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
  AlertTriangle
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
  ResponsiveContainer
} from "recharts";
function AdminDashboard({ onNavigate }) {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const revenueData = [
    { name: "T2", revenue: 45e6 },
    { name: "T3", revenue: 52e6 },
    { name: "T4", revenue: 48e6 },
    { name: "T5", revenue: 61e6 },
    { name: "T6", revenue: 55e6 },
    { name: "T7", revenue: 67e6 },
    { name: "CN", revenue: 73e6 }
  ];
  const categoryData = [
    { name: "Hampers Cao C\u1EA5p", value: 45, color: "#B71C1C" },
    { name: "R\u01B0\u1EE3u Vang", value: 25, color: "#D4AF37" },
    { name: "Tr\xE0 & Cafe", value: 15, color: "#8B1538" },
    { name: "B\xE1nh K\u1EB9o", value: 15, color: "#C19A6B" }
  ];
  const recentOrders = [
    {
      id: "ORD-2601-001",
      customer: "Nguy\u1EC5n V\u0103n An",
      amount: 45e5,
      status: "pending",
      date: "15/01/2026"
    },
    {
      id: "ORD-2601-002",
      customer: "Tr\u1EA7n Th\u1ECB B\xECnh",
      amount: 89e5,
      status: "shipping",
      date: "15/01/2026"
    },
    {
      id: "ORD-2601-003",
      customer: "C\xF4ng ty TNHH ABC",
      amount: 25e6,
      status: "done",
      date: "14/01/2026"
    },
    {
      id: "ORD-2601-004",
      customer: "L\xEA Minh Ch\xE2u",
      amount: 67e5,
      status: "shipping",
      date: "14/01/2026"
    },
    {
      id: "ORD-2601-005",
      customer: "Ph\u1EA1m Qu\u1ED1c D\u0169ng",
      amount: 32e5,
      status: "pending",
      date: "14/01/2026"
    }
  ];
  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Ch\u1EDD x\u1EED l\xFD"
      },
      shipping: { bg: "bg-blue-100", text: "text-blue-800", label: "\u0110ang giao" },
      done: { bg: "bg-green-100", text: "text-green-800", label: "Ho\xE0n th\xE0nh" }
    };
    const badge = badges[status];
    return <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
    >
        {badge.label}
      </span>;
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "S\u1EA3n Ph\u1EA9m", icon: Package },
    { id: "orders", label: "\u0110\u01A1n H\xE0ng", icon: ShoppingCart },
    { id: "customers", label: "Kh\xE1ch H\xE0ng", icon: Users },
    { id: "reports", label: "B\xE1o C\xE1o", icon: BarChart3 },
    { id: "settings", label: "C\xE0i \u0110\u1EB7t", icon: Settings }
  ];
  return <div className="flex h-screen bg-[#F5F5F5]">
      {
    /* Left Sidebar */
  }
      <aside className="w-64 bg-[#B71C1C] text-white flex flex-col">
        {
    /* Logo */
  }
        <div className="p-6 border-b border-white/10">
          <img
    src={logoImage}
    alt="Tetdenroi.vn"
    className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity brightness-0 invert"
    onClick={() => onNavigate?.("home")}
  />
        </div>

        {
    /* Navigation Menu */
  }
        <nav className="flex-1 py-6">
          {menuItems.map((item) => {
    const Icon = item.icon;
    const isActive = activeMenu === item.id;
    return <button
      key={item.id}
      onClick={() => setActiveMenu(item.id)}
      className={`w-full flex items-center px-6 py-3 text-left transition-all ${isActive ? "bg-[#D4AF37] text-white font-bold" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
    >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>;
  })}
        </nav>

        {
    /* User Profile */
  }
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold">
              AD
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-white/60">admin@tetdenroi.vn</p>
            </div>
            <button className="text-white/60 hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {
    /* Main Content */
  }
      <main className="flex-1 overflow-y-auto">
        {
    /* Conditionally render content based on active menu */
  }
        {activeMenu === "orders" ? <OrderManagement /> : activeMenu === "products" ? <ProductManagement /> : activeMenu === "customers" ? <CustomerManagementSplit /> : activeMenu === "reports" ? <RevenueReport /> : activeMenu === "settings" ? <AdminSettings /> : <>
            {
    /* Top Bar */
  }
            <header className="bg-white shadow-sm sticky top-0 z-10">
              <div className="flex items-center justify-between px-8 py-4">
                {
    /* Search Bar */
  }
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

                {
    /* Right Actions */
  }
                <div className="flex items-center space-x-4">
                  {
    /* Date Range Picker */
  }
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#D4AF37] transition-colors">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">15/01 - 21/01</span>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>

                  {
    /* Notifications */
  }
                  <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="h-6 w-6 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>
                </div>
              </div>
            </header>

            {
    /* Dashboard Content */
  }
            <div className="p-8">
              {
    /* Page Title */
  }
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

              {
    /* Statistics Cards */
  }
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {
    /* Total Revenue */
  }
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
                    {formatCurrency(401e6)}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 font-semibold">+15%</span>
                    <span className="text-gray-500 ml-2">so với tuần trước</span>
                  </div>
                </div>

                {
    /* New Orders */
  }
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
                    127
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-yellow-600 font-semibold">
                      24 chờ xử lý
                    </span>
                  </div>
                </div>

                {
    /* Products Sold */
  }
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
                    <span className="text-gray-500 ml-2">so với tuần trước</span>
                  </div>
                </div>

                {
    /* Low Stock Warning */
  }
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

              {
    /* Charts Row */
  }
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {
    /* Revenue Chart */
  }
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3
    className="text-xl font-bold text-gray-900 mb-6"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                    Doanh Thu Theo Thời Gian
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
    dataKey="name"
    stroke="#6b7280"
    style={{ fontSize: "12px" }}
  />
                      <YAxis
    stroke="#6b7280"
    style={{ fontSize: "12px" }}
    tickFormatter={(value) => `${(value / 1e6).toFixed(0)}M`}
  />
                      <Tooltip
    formatter={(value) => formatCurrency(value)}
    contentStyle={{
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "8px"
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

                {
    /* Category Sales Pie Chart */
  }
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3
    className="text-xl font-bold text-gray-900 mb-6"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                    Doanh Thu Theo Danh Mục
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
    data={categoryData}
    cx="50%"
    cy="50%"
    labelLine={false}
    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
    outerRadius={80}
    fill="#8884d8"
    dataKey="value"
  >
                        {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {
    /* Recent Orders Table */
  }
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
                      {recentOrders.map((order) => <tr
    key={order.id}
    className="hover:bg-gray-50 transition-colors"
  >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {order.id}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-700">
                              {order.customer}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {order.date}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(order.amount)}
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
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>}
      </main>
    </div>;
}
export {
  AdminDashboard
};

