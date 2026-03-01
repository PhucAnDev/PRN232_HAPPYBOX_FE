import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  Check,
  Mail,
  Phone,
  Calendar,
  Building2,
  User,
  Crown,
  MapPin,
  ShoppingBag,
  Clock,
  Filter,
  Ban,
  Printer,
  Package,
  Truck,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import userService, { UserResponse } from "../services/userService";
import orderService, {
  OrderResponse,
  OrderStatus,
} from "../services/orderService";

interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  type: "individual" | "enterprise";
  isVip: boolean;
  totalOrders: number;
  totalSpent: number;
  registrationDate: string;
  status: "active" | "blocked";
  avatar: string;
  address: string;
  lastLogin: string;
  orders: {
    id: string;
    date: string;
    amount: number;
    status: "completed" | "shipping" | "pending" | "cancelled";
  }[];
}

export function CustomerManagementSplit() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allOrders, setAllOrders] = useState<OrderResponse[]>([]);

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users and orders in parallel
      const [usersResponse, ordersResponse] = await Promise.all([
        userService.getAll(),
        orderService.getAll(),
      ]);

      // Handle users - check both wrapped and unwrapped response formats
      let users: UserResponse[] = [];
      const userData = usersResponse.data as any;
      if (userData?.success && userData?.data) {
        users = userData.data;
      } else if (Array.isArray(userData)) {
        users = userData;
      }

      // Handle orders - OrderController returns wrapped ApiResponse
      let orders: OrderResponse[] = [];
      if (ordersResponse.data?.success && ordersResponse.data?.data) {
        orders = ordersResponse.data.data;
      }

      setAllOrders(orders);

      // Transform users to customers with statistics
      const customersData: Customer[] = users.map((user) => {
        // Find all orders for this user
        const userOrders = orders.filter((order) => order.userId === user.id);

        // Calculate statistics
        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce(
          (sum, order) => sum + order.finalAmount,
          0,
        );

        // Determine if VIP (e.g., total spent > 10M VND)
        const isVip = totalSpent >= 10000000;

        // Determine type based on role or company name
        const type =
          user.roleName?.toLowerCase().includes("enterprise") ||
          user.roleName?.toLowerCase().includes("doanh nghiệp")
            ? "enterprise"
            : "individual";

        // Get user initials for avatar
        const avatar = user.fullName
          ? user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 3)
              .toUpperCase()
          : user.username.substring(0, 3).toUpperCase();

        // Calculate last login (mock for now as we don't have this data)
        const lastLogin = user.updatedAt
          ? getTimeAgo(new Date(user.updatedAt))
          : "Chưa xác định";

        // Map orders to simplified format
        const ordersList = userOrders.map((order) => ({
          id: order.orderNumber,
          date: new Date(order.createdAt).toLocaleDateString("vi-VN"),
          amount: order.finalAmount,
          status: mapOrderStatus(order.currentStatus),
        }));

        return {
          id: user.id,
          userId: `CST-${user.id.substring(0, 8)}`,
          name: user.fullName || user.username,
          email: user.email,
          phone: user.phone,
          type,
          isVip,
          totalOrders,
          totalSpent,
          registrationDate: new Date(user.createdAt).toLocaleDateString(
            "vi-VN",
          ),
          status: user.isActive ? "active" : "blocked",
          avatar,
          address: user.address || "Chưa cập nhật",
          lastLogin,
          orders: ordersList,
        };
      });

      // Sort by total spent (descending)
      customersData.sort((a, b) => b.totalSpent - a.totalSpent);

      setCustomers(customersData);
    } catch (err: any) {
      console.error("Error fetching customer data:", err);
      setError(err?.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Helper: Map OrderStatus enum to UI status
  const mapOrderStatus = (
    status: OrderStatus,
  ): "completed" | "shipping" | "pending" | "cancelled" => {
    switch (status) {
      case OrderStatus.Delivered:
        return "completed";
      case OrderStatus.Shipping:
        return "shipping";
      case OrderStatus.Cancelled:
      case OrderStatus.Returned:
        return "cancelled";
      default:
        return "pending";
    }
  };

  // Helper: Calculate time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} tuần trước`;
    } else {
      return `${Math.floor(diffInDays / 30)} tháng trước`;
    }
  };

  // Mock data with full customer details - TODO: Replace with API
  const mockCustomers: Customer[] = [
    {
      id: "1",
      userId: "CST-2026-001",
      name: "Nguyễn Văn An",
      email: "nguyenvanan@gmail.com",
      phone: "0901234567",
      type: "individual",
      isVip: true,
      totalOrders: 5,
      totalSpent: 45000000,
      registrationDate: "12 Th1, 2026",
      status: "active",
      avatar: "NVA",
      address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
      lastLogin: "2 giờ trước",
      orders: [
        {
          id: "ORD-2025-001",
          date: "15 Th1, 2026",
          amount: 4500000,
          status: "completed",
        },
        {
          id: "ORD-2025-012",
          date: "10 Th1, 2026",
          amount: 8900000,
          status: "shipping",
        },
        {
          id: "ORD-2025-025",
          date: "5 Th1, 2026",
          amount: 6700000,
          status: "completed",
        },
        {
          id: "ORD-2024-156",
          date: "28 Th12, 2025",
          amount: 12500000,
          status: "completed",
        },
        {
          id: "ORD-2024-143",
          date: "20 Th12, 2025",
          amount: 12400000,
          status: "completed",
        },
      ],
    },
    {
      id: "2",
      userId: "CST-2026-002",
      name: "Công ty TNHH ABC",
      email: "contact@abc.com.vn",
      phone: "0281234567",
      type: "enterprise",
      isVip: true,
      totalOrders: 2,
      totalSpent: 43000000,
      registrationDate: "10 Th1, 2026",
      status: "active",
      avatar: "ABC",
      address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
      lastLogin: "1 ngày trước",
      orders: [
        {
          id: "ORD-2025-045",
          date: "14 Th1, 2026",
          amount: 25000000,
          status: "completed",
        },
        {
          id: "ORD-2025-038",
          date: "12 Th1, 2026",
          amount: 18000000,
          status: "shipping",
        },
      ],
    },
    {
      id: "3",
      userId: "CST-2026-003",
      name: "Trần Thị Bình",
      email: "tranthibinh@yahoo.com",
      phone: "0912345678",
      type: "individual",
      isVip: false,
      totalOrders: 2,
      totalSpent: 6700000,
      registrationDate: "15 Th1, 2026",
      status: "active",
      avatar: "TTB",
      address: "789 Lê Văn Sỹ, Quận 3, TP.HCM",
      lastLogin: "5 giờ trước",
      orders: [
        {
          id: "ORD-2025-003",
          date: "15 Th1, 2026",
          amount: 4500000,
          status: "pending",
        },
        {
          id: "ORD-2025-015",
          date: "8 Th1, 2026",
          amount: 2200000,
          status: "completed",
        },
      ],
    },
    {
      id: "4",
      userId: "CST-2026-004",
      name: "Lê Minh Châu",
      email: "leminhchau@gmail.com",
      phone: "0923456789",
      type: "individual",
      isVip: false,
      totalOrders: 1,
      totalSpent: 6700000,
      registrationDate: "14 Th1, 2026",
      status: "active",
      avatar: "LMC",
      address: "321 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
      lastLogin: "3 ngày trước",
      orders: [
        {
          id: "ORD-2025-004",
          date: "14 Th1, 2026",
          amount: 6700000,
          status: "shipping",
        },
      ],
    },
    {
      id: "5",
      userId: "CST-2026-005",
      name: "Tập đoàn XYZ",
      email: "info@xyz.com.vn",
      phone: "0281239876",
      type: "enterprise",
      isVip: true,
      totalOrders: 1,
      totalSpent: 35000000,
      registrationDate: "28 Th12, 2025",
      status: "active",
      avatar: "XYZ",
      address: "555 Võ Văn Tần, Quận 3, TP.HCM",
      lastLogin: "30 phút trước",
      orders: [
        {
          id: "ORD-2025-050",
          date: "15 Th1, 2026",
          amount: 35000000,
          status: "completed",
        },
      ],
    },
    {
      id: "6",
      userId: "CST-2026-006",
      name: "Phạm Quốc Dũng",
      email: "phamquocdung@outlook.com",
      phone: "0934567890",
      type: "individual",
      isVip: false,
      totalOrders: 1,
      totalSpent: 3200000,
      registrationDate: "14 Th1, 2026",
      status: "active",
      avatar: "PQD",
      address: "888 Phan Xích Long, Quận Phú Nhuận, TP.HCM",
      lastLogin: "1 tuần trước",
      orders: [
        {
          id: "ORD-2025-005",
          date: "14 Th1, 2026",
          amount: 3200000,
          status: "completed",
        },
      ],
    },
    {
      id: "7",
      userId: "CST-2026-007",
      name: "Hoàng Thị Mai",
      email: "hoangthimai@gmail.com",
      phone: "0945678901",
      type: "individual",
      isVip: true,
      totalOrders: 3,
      totalSpent: 18700000,
      registrationDate: "20 Th12, 2025",
      status: "active",
      avatar: "HTM",
      address: "222 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
      lastLogin: "1 giờ trước",
      orders: [
        {
          id: "ORD-2025-008",
          date: "12 Th1, 2026",
          amount: 5500000,
          status: "completed",
        },
        {
          id: "ORD-2025-021",
          date: "6 Th1, 2026",
          amount: 7200000,
          status: "completed",
        },
        {
          id: "ORD-2024-178",
          date: "25 Th12, 2025",
          amount: 6000000,
          status: "completed",
        },
      ],
    },
    {
      id: "8",
      userId: "CST-2026-008",
      name: "Đỗ Văn Hùng",
      email: "dovanhung@example.com",
      phone: "0956789012",
      type: "individual",
      isVip: false,
      totalOrders: 1,
      totalSpent: 5400000,
      registrationDate: "13 Th1, 2026",
      status: "blocked",
      avatar: "DVH",
      address: "666 Cách Mạng Tháng 8, Quận 10, TP.HCM",
      lastLogin: "2 tuần trước",
      orders: [
        {
          id: "ORD-2025-007",
          date: "13 Th1, 2026",
          amount: 5400000,
          status: "cancelled",
        },
      ],
    },
  ];

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  // Auto-select first customer when data loads
  useEffect(() => {
    if (customers.length > 0 && !selectedCustomer) {
      setSelectedCustomer(customers[0]);
    }
  }, [customers]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Hoàn thành",
      },
      shipping: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Đang giao",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Chờ xử lý",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Đã hủy",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.userId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "vip" && customer.isVip) ||
      (typeFilter === "individual" &&
        customer.type === "individual" &&
        !customer.isVip) ||
      (typeFilter === "enterprise" && customer.type === "enterprise");

    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Quản Lý Khách Hàng
        </h1>
        <p className="text-gray-600">
          Xem thông tin chi tiết và lịch sử mua hàng của khách hàng
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#B71C1C]" />
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">❌ {error}</p>
          <button
            onClick={fetchData}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Master-Detail Split Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* LEFT PANEL: Customer List (35% - 4 columns) */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              {/* Search & Filter */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Tìm tên hoặc SĐT..."
                      className="pl-9 pr-3 py-2 w-full text-sm border-gray-300 rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 px-3"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setTypeFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      typeFilter === "all"
                        ? "bg-[#B71C1C] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setTypeFilter("vip")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      typeFilter === "vip"
                        ? "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    VIP
                  </button>
                  <button
                    onClick={() => setTypeFilter("enterprise")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      typeFilter === "enterprise"
                        ? "bg-[#B71C1C] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    DN
                  </button>
                </div>
              </div>

              {/* Customer List */}
              <div className="space-y-2 max-h-[700px] overflow-y-auto pr-2">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`w-full bg-white rounded-xl shadow-sm p-4 text-left transition-all hover:shadow-md ${
                      selectedCustomer?.id === customer.id
                        ? "border-2 border-[#D4AF37] bg-yellow-50"
                        : "border border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                          customer.isVip
                            ? "bg-gradient-to-br from-[#D4AF37] to-[#FFD700]"
                            : customer.type === "enterprise"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                        }`}
                      >
                        {customer.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {customer.name}
                          </p>
                          {customer.isVip && (
                            <Crown className="h-3.5 w-3.5 text-[#D4AF37] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {customer.phone}
                        </p>
                        <div className="flex items-center gap-2">
                          {customer.isVip ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white">
                              VIP
                            </span>
                          ) : customer.type === "enterprise" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                              DN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                              Cá nhân
                            </span>
                          )}
                          {customer.status === "blocked" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              Blocked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT PANEL: Customer Detail (65% - 8 columns) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {!selectedCustomer ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Chọn một khách hàng để xem chi tiết
                  </p>
                </div>
              ) : (
                <>
                  {/* Profile Overview Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-6">
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 ${
                            selectedCustomer.isVip
                              ? "bg-gradient-to-br from-[#D4AF37] to-[#FFD700]"
                              : selectedCustomer.type === "enterprise"
                                ? "bg-blue-500"
                                : "bg-gray-500"
                          }`}
                        >
                          {selectedCustomer.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2
                              className="text-2xl font-bold text-gray-900"
                              style={{
                                fontFamily: "'Playfair Display', serif",
                              }}
                            >
                              {selectedCustomer.name}
                            </h2>
                            {selectedCustomer.isVip && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white">
                                <Crown className="h-3 w-3" />
                                VIP CUSTOMER
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-4 font-mono">
                            {selectedCustomer.userId}
                          </p>

                          {/* Contact Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {selectedCustomer.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {selectedCustomer.phone}
                              </span>
                            </div>
                            <div className="flex items-start gap-2 col-span-2">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">
                                {selectedCustomer.address}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${
                            selectedCustomer.status === "blocked"
                              ? "border-green-500 text-green-700 hover:bg-green-50"
                              : "border-red-500 text-red-700 hover:bg-red-50"
                          }`}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          {selectedCustomer.status === "blocked"
                            ? "Mở khóa"
                            : "Chặn"}
                        </Button>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Tổng chi tiêu
                        </p>
                        <p
                          className="text-2xl font-bold text-[#D4AF37]"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {formatCurrency(selectedCustomer.totalSpent)}
                        </p>
                      </div>
                      <div className="text-center border-l border-r border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">
                          Tổng đơn hàng
                        </p>
                        <p
                          className="text-2xl font-bold text-gray-900"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {selectedCustomer.totalOrders}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Đăng nhập lần cuối
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">
                            {selectedCustomer.lastLogin}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order History Section */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3
                          className="text-xl font-bold text-gray-900"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          Lịch Sử Đơn Hàng
                        </h3>
                        <span className="text-sm text-gray-600">
                          {selectedCustomer.orders.length} đơn hàng
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Mã Đơn
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Ngày Đặt
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Số Tiền
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Trạng Thái
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Hành Động
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedCustomer.orders.map((order) => (
                            <tr
                              key={order.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-bold text-[#B71C1C]">
                                  {order.id}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-700">
                                    {order.date}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-bold text-gray-900">
                                  {formatCurrency(order.amount)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {getStatusBadge(order.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                  onClick={() => {
                                    setSelectedOrderId(order.id);
                                    setShowOrderDetailModal(true);
                                  }}
                                  className="p-2 text-gray-600 hover:text-[#B71C1C] hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center"
                                  title="Xem chi tiết đơn hàng"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {selectedCustomer.orders.length === 0 && (
                      <div className="py-12 text-center">
                        <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                          Khách hàng chưa có đơn hàng nào
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Order Detail Modal */}
          {showOrderDetailModal && selectedOrderId && selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-4">
                    <h3
                      className="text-2xl font-bold text-gray-900"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Chi tiết đơn hàng #{selectedOrderId}
                    </h3>
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-semibold ${
                        selectedOrderId === "ORD-2025-001"
                          ? "bg-green-100 text-green-800"
                          : selectedOrderId === "ORD-2025-012"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedOrderId === "ORD-2025-012"
                        ? "Đang giao"
                        : "Hoàn thành"}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowOrderDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                {/* Modal Body - Two Column Layout */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Delivery Info */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                          Thông Tin Giao Hàng
                        </h4>

                        <div className="space-y-4 bg-gray-50 rounded-lg p-5">
                          {/* Receiver */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Người nhận
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {selectedCustomer.name}
                            </p>
                          </div>

                          {/* Phone */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Số điện thoại
                            </p>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <p className="text-sm font-medium text-gray-900">
                                {selectedCustomer.phone}
                              </p>
                            </div>
                          </div>

                          {/* Address */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Địa chỉ giao hàng
                            </p>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm font-medium text-gray-900">
                                {selectedCustomer.address}
                              </p>
                            </div>
                          </div>

                          {/* Shipping Method */}
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">
                              Phương thức vận chuyển
                            </p>
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-blue-600" />
                              <p className="text-sm font-semibold text-gray-900">
                                Giao hàng tiêu chuẩn - GiaoHangNhanh
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Product & Payment */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                          Sản Phẩm
                        </h4>

                        {/* Product Item */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center text-3xl border border-gray-200 flex-shrink-0">
                              🎁
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900">
                                Hộp Quà Phú Quý 2025
                              </p>
                              <p className="text-xs text-gray-500 mt-1">x3</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">
                                {formatCurrency(1500000)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                          Thanh Toán
                        </h4>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">Tạm tính</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(4500000)}
                            </p>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                              Phí vận chuyển
                            </p>
                            <p className="text-sm font-medium text-green-600">
                              {formatCurrency(0)} (Miễn phí)
                            </p>
                          </div>

                          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                            <p className="text-base font-bold text-gray-900">
                              Tổng cộng
                            </p>
                            <p
                              className="text-2xl font-bold text-[#D4AF37]"
                              style={{
                                fontFamily: "'Playfair Display', serif",
                              }}
                            >
                              {formatCurrency(4500000)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-gray-600" />
                            <p className="text-sm font-semibold text-gray-700">
                              Phương thức thanh toán
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-pink-500 flex items-center justify-center text-white text-xs font-bold">
                              M
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              MoMo
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">Trạng thái</p>
                          <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                            <Check className="h-4 w-4" />
                            Đã thanh toán
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-white font-semibold px-6"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    In Hóa Đơn
                  </Button>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => setShowOrderDetailModal(false)}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-white font-semibold px-6"
                    >
                      Đóng
                    </Button>
                    <Button className="bg-[#B71C1C] hover:bg-[#8B1538] text-white font-semibold px-6">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Mua Lại Đơn Này
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
