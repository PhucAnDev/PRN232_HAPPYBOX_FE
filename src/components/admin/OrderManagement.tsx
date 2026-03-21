import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  ChevronDown,
  X,
  Check,
  PackageCheck,
  MapPin,
  Mail,
  Phone,
  StickyNote,
  CreditCard,
  Truck,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCatalog from "@/hooks/useCatalog";
import useOrders from "@/hooks/useOrders";
import useUsers from "@/hooks/useUsers";
import type {
  OrderResponse,
  OrderStatus,
} from "@/services/orderService";
import { orderStatusLabels, orderStatusColors } from "@/services/orderService";
import type { UserResponse } from "@/services/userService";
import { CreateOrder } from "./CreateOrder";

interface Order {
  id: string;
  backendId?: string; // Backend GUID for API calls
  customer: {
    name: string;
    avatar: string;
    email: string;
    phone: string;
    address: string;
  };
  date: string;
  amount: number;
  paymentStatus: "paid" | "unpaid";
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipping"
    | "delivered"
    | "cancelled"
    | "returned";
  items: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  paymentMethod: string;
  note?: string;
}

export function OrderManagement() {
  const {
    fetchOrders: loadOrders,
    updateOrderStatus,
    fetchOrderDetail,
  } = useOrders();
  const { fetchProductDetail } = useCatalog();
  const { fetchUserDetail } = useUsers();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [newStatus, setNewStatus] = useState<Order["orderStatus"]>("pending");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const [showCreateOrder, setShowCreateOrder] = useState(false);

  // API data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data with full order details - TODO: Replace with API
  const [orders, setOrders] = useState<Order[]>([]);
  const orderService = {
    getAll: async () => ({
      data: {
        success: true,
        data: await loadOrders(),
      },
    }),
    updateStatus: async (id: string, status: OrderStatus) => ({
      data: {
        success: true,
        data: await updateOrderStatus(id, status),
      },
    }),
    getById: async (id: string) => ({
      data: {
        success: true,
        data: await fetchOrderDetail(id),
      },
    }),
  };
  const userService = {
    getById: async (id: string) => ({
      data: await fetchUserDetail(id),
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

  // Fetch data from API
  useEffect(() => {
    fetchOrders();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };

    if (isStatusDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getAll();

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Map API data to UI format
      const apiOrders = response.data.data;
      const mappedOrders: Order[] = await Promise.all(
        apiOrders.map(async (apiOrder) => {
          // Fetch user data
          let userName = "N/A";
          let userEmail = "";
          let userPhone = "";
          let userAddress = apiOrder.shippingAddress;

          try {
            const userResponse = await userService.getById(apiOrder.userId);
            // UserController returns UserResponse directly (not wrapped in ApiResponse)
            const rawData = userResponse.data as any;
            // Handle both wrapped { success, data } and raw UserResponse formats
            const user = rawData?.data || rawData;
            if (user && (user.fullName || user.username || user.email)) {
              userName = user.fullName || user.username || "N/A";
              userEmail = user.email || "";
              userPhone = user.phone || "";
              userAddress = apiOrder.shippingAddress || user.address || "";
            }
          } catch (err) {
            console.warn(`Failed to fetch user ${apiOrder.userId}`, err);
          }

          // Map order details with product info
          const items = await Promise.all(
            apiOrder.orderDetails.map(async (detail) => {
              let productName = "Unknown Product";
              let productImage = "🎁";

              try {
                const prodResponse = await productService.getById(
                  detail.productId,
                );
                if (prodResponse.data.success) {
                  productName = prodResponse.data.data.name;
                  // Get first image if available
                  const images = prodResponse.data.data.images || [];
                  if (images.length > 0 && images[0].url) {
                    productImage = images[0].url;
                  }
                }
              } catch (err) {
                console.warn(
                  `Failed to fetch product ${detail.productId}`,
                  err,
                );
              }

              return {
                id: detail.id,
                name: productName,
                image: productImage,
                quantity: detail.quantity,
                price: detail.unitPrice,
              };
            }),
          );

          // Map order status to UI format (backend returns numeric OrderStatus enum)
          const statusMap: Record<OrderStatus, Order["orderStatus"]> = {
            [OrderStatus.Pending]: "pending",
            [OrderStatus.Confirmed]: "confirmed",
            [OrderStatus.Processing]: "processing",
            [OrderStatus.Shipping]: "shipping",
            [OrderStatus.Delivered]: "delivered",
            [OrderStatus.Cancelled]: "cancelled",
            [OrderStatus.Returned]: "returned",
          };

          return {
            id: apiOrder.orderNumber,
            backendId: apiOrder.id, // Store backend GUID for API updates
            customer: {
              name: userName,
              avatar: userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 3)
                .toUpperCase(),
              email: userEmail,
              phone: userPhone,
              address: userAddress,
            },
            date: new Date(apiOrder.createdAt).toLocaleDateString("vi-VN"),
            amount: apiOrder.finalAmount,
            paymentStatus: apiOrder.paymentMethod === "COD" ? "unpaid" : "paid",
            orderStatus: statusMap[apiOrder.currentStatus] || "pending",
            items,
            subtotal: apiOrder.totalAmount,
            shippingFee: apiOrder.shippingFee,
            discount: apiOrder.discountAmount,
            paymentMethod: apiOrder.paymentMethod,
            note: apiOrder.note,
          };
        }),
      );

      setOrders(mappedOrders);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err?.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Chờ xử lý",
      },
      confirmed: {
        bg: "bg-cyan-100",
        text: "text-cyan-800",
        label: "Đã xác nhận",
      },
      processing: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Đang xử lý",
      },
      shipping: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Đang giao",
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Đã giao",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Đã hủy",
      },
      returned: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        label: "Đã trả hàng",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          const order = orders.find((o) => o.orderStatus === status);
          if (order) {
            setSelectedOrder(order);
            setShowStatusModal(true);
          }
        }}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} hover:opacity-80 transition-opacity cursor-pointer`}
      >
        {config.label}
      </button>
    );
  };

  const getPaymentBadge = (status: string) => {
    const config = {
      paid: {
        bg: "bg-green-50",
        text: "text-green-700",
        label: "Đã thanh toán",
      },
      unpaid: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Chưa thanh toán",
      },
    };

    const badge = config[status as keyof typeof config];
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const handleUpdateStatus = async (newStatus: Order["orderStatus"]) => {
    if (!selectedOrder) return;

    try {
      // Map UI status back to API OrderStatus enum (numeric)
      const statusMap: Record<Order["orderStatus"], OrderStatus> = {
        pending: OrderStatus.Pending,
        confirmed: OrderStatus.Confirmed,
        processing: OrderStatus.Processing,
        shipping: OrderStatus.Shipping,
        delivered: OrderStatus.Delivered,
        cancelled: OrderStatus.Cancelled,
        returned: OrderStatus.Returned,
      };

      const apiStatus = statusMap[newStatus];

      if (!selectedOrder.backendId) {
        throw new Error("Không tìm thấy ID đơn hàng từ backend");
      }

      // Call API to update status
      await orderService.updateStatus(selectedOrder.backendId, apiStatus);

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, orderStatus: newStatus }
            : order,
        ),
      );

      setShowStatusModal(false);
      setSelectedOrder(null);

      console.log(
        `✅ Đã cập nhật trạng thái đơn hàng ${selectedOrder.id} thành ${newStatus}`,
      );
    } catch (err: any) {
      console.error("Error updating order status:", err);
      alert(`Lỗi khi cập nhật trạng thái: ${err?.message || "Unknown error"}`);
    }
  };

  const handleQuickStatusChange = (order: Order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;

    const matchesPayment =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "pending").length,
    processing: orders.filter((o) => o.orderStatus === "processing").length,
    shipping: orders.filter((o) => o.orderStatus === "shipping").length,
    completed: orders.filter((o) => o.orderStatus === "completed").length,
  };

  if (showCreateOrder) {
    return (
      <CreateOrder
        onBack={() => {
          setShowCreateOrder(false);
          fetchOrders();
        }}
      />
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quản Lý Đơn Hàng
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi tất cả đơn hàng của khách hàng
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all transform hover:scale-105"
          onClick={() => setShowCreateOrder(true)}
        >
          <Plus className="h-5 w-5" />
          Tạo Đơn Hàng
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">❌ {error}</p>
          <button
            onClick={fetchOrders}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Content - Only show when not loading */}
      {!loading && !error && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Tổng đơn</p>
              <p
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {orderStats.total}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-sm p-4 border border-yellow-200">
              <p className="text-sm text-yellow-800 mb-1">Chờ xử lý</p>
              <p
                className="text-2xl font-bold text-yellow-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {orderStats.pending}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
              <p className="text-sm text-blue-800 mb-1">Đang xử lý</p>
              <p
                className="text-2xl font-bold text-blue-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {orderStats.processing}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg shadow-sm p-4 border border-purple-200">
              <p className="text-sm text-purple-800 mb-1">Đang giao</p>
              <p
                className="text-2xl font-bold text-purple-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {orderStats.shipping}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg shadow-sm p-4 border border-green-200">
              <p className="text-sm text-green-800 mb-1">Hoàn thành</p>
              <p
                className="text-2xl font-bold text-green-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {orderStats.completed}
              </p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
                    className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Filters and Actions */}
              <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                  <option value="returned">Đã trả hàng</option>
                </select>

                {/* Payment Filter */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="all">Tất cả thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="unpaid">Chưa thanh toán</option>
                </select>

                {/* Export Button */}
                <Button className="bg-[#D4AF37] hover:bg-[#C19A6B] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Download className="h-4 w-4" />
                  Export Excel
                </Button>
              </div>
            </div>

            {/* Selected Orders Actions */}
            {selectedOrders.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Đã chọn{" "}
                    <span className="font-bold">{selectedOrders.length}</span>{" "}
                    đơn hàng
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-700 border-gray-300"
                      onClick={() => setSelectedOrders([])}
                    >
                      Bỏ chọn
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#B71C1C] hover:bg-[#8B1538] text-white"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      In hóa đơn
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#D4AF37]"
                        checked={selectedOrders.length === orders.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
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
                      Thanh Toán
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng Thái
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#D4AF37]"
                          checked={selectedOrders.includes(order.id)}
                          onChange={(e) =>
                            handleSelectOrder(order.id, e.target.checked)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-[#B71C1C]">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-semibold text-sm">
                            {order.customer.avatar}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {order.customer.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {order.date}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(order.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentBadge(order.paymentStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div onClick={() => handleQuickStatusChange(order)}>
                          {getStatusBadge(order.orderStatus)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 text-gray-600 hover:text-[#B71C1C] hover:bg-gray-100 rounded-lg transition-colors"
                            title="Xem chi tiết"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetailModal(true);
                            }}
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-[#D4AF37] hover:bg-gray-100 rounded-lg transition-colors"
                            title="In hóa đơn"
                          >
                            <Printer className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-gray-500 text-lg">
                  Không tìm thấy đơn hàng nào
                </p>
              </div>
            )}

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Hiển thị{" "}
                <span className="font-semibold">{filteredOrders.length}</span> /{" "}
                <span className="font-semibold">{orders.length}</span> đơn hàng
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#B71C1C] text-white border-[#B71C1C]"
                >
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Sau
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Status Update Modal */}
          {showStatusModal && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Cập Nhật Trạng Thái
                    </h3>
                    <p className="text-sm text-white/80 mt-1">
                      Đơn hàng: {selectedOrder.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Khách hàng:</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold">
                        {selectedOrder.customer.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.customer.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(selectedOrder.amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Chọn trạng thái mới:
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleUpdateStatus("pending")}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                          selectedOrder.orderStatus === "pending"
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-gray-200 hover:border-yellow-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          </div>
                          <span className="font-semibold text-gray-900">
                            Chờ xử lý
                          </span>
                        </div>
                        {selectedOrder.orderStatus === "pending" && (
                          <Check className="h-5 w-5 text-yellow-600" />
                        )}
                      </button>

                      <button
                        onClick={() => handleUpdateStatus("processing")}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                          selectedOrder.orderStatus === "processing"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          </div>
                          <span className="font-semibold text-gray-900">
                            Đang xử lý
                          </span>
                        </div>
                        {selectedOrder.orderStatus === "processing" && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </button>

                      <button
                        onClick={() => handleUpdateStatus("shipping")}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                          selectedOrder.orderStatus === "shipping"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <PackageCheck className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="font-semibold text-gray-900">
                            Đang giao hàng
                          </span>
                        </div>
                        {selectedOrder.orderStatus === "shipping" && (
                          <Check className="h-5 w-5 text-purple-600" />
                        )}
                      </button>

                      <button
                        onClick={() => handleUpdateStatus("completed")}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                          selectedOrder.orderStatus === "completed"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-semibold text-gray-900">
                            Hoàn thành
                          </span>
                        </div>
                        {selectedOrder.orderStatus === "completed" && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
                      </button>

                      <button
                        onClick={() => handleUpdateStatus("cancelled")}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                          selectedOrder.orderStatus === "cancelled"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <X className="h-4 w-4 text-red-600" />
                          </div>
                          <span className="font-semibold text-gray-900">
                            Đã hủy
                          </span>
                        </div>
                        {selectedOrder.orderStatus === "cancelled" && (
                          <Check className="h-5 w-5 text-red-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowStatusModal(false)}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Order Detail Modal */}
          {showDetailModal && selectedOrder && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0 rounded-t-xl">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3
                        className="text-2xl font-bold text-gray-900"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Chi tiết đơn hàng #{selectedOrder.id}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Đặt ngày {selectedOrder.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-semibold ${
                        selectedOrder.orderStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedOrder.orderStatus === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : selectedOrder.orderStatus === "shipping"
                              ? "bg-purple-100 text-purple-800"
                              : selectedOrder.orderStatus === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedOrder.orderStatus === "pending"
                        ? "Chờ xử lý"
                        : selectedOrder.orderStatus === "processing"
                          ? "Đang xử lý"
                          : selectedOrder.orderStatus === "shipping"
                            ? "Đang giao"
                            : selectedOrder.orderStatus === "completed"
                              ? "Hoàn thành"
                              : "Đã hủy"}
                    </span>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Modal Body - Two Column Layout */}
                <div
                  className="p-8 overflow-y-auto flex-1"
                  style={{ maxHeight: "calc(90vh - 180px)" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1: Customer & Shipping Info */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                          Thông Tin Khách Hàng
                        </h4>

                        <div className="space-y-4">
                          {/* Customer Name & Avatar */}
                          <div className="flex items-center space-x-3">
                            <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold text-lg">
                              {selectedOrder.customer.avatar}
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900">
                                {selectedOrder.customer.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Khách hàng
                              </p>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-3 pl-2">
                            <div className="flex items-start gap-3">
                              <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-gray-500">
                                  Số điện thoại
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {selectedOrder.customer.phone}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {selectedOrder.customer.email}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-gray-500">
                                  Địa chỉ giao hàng
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {selectedOrder.customer.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Customer Note */}
                      {selectedOrder.note && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <StickyNote className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wide mb-1">
                                Ghi chú từ khách hàng
                              </p>
                              <p className="text-sm text-yellow-900">
                                {selectedOrder.note}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Column 2: Order Items & Payment */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                          Danh Sách Sản Phẩm
                        </h4>

                        {/* Product List */}
                        <div className="space-y-3">
                          {selectedOrder.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#FFFDF5] to-[#F5F5F5] flex items-center justify-center text-3xl border border-gray-200 flex-shrink-0 overflow-hidden">
                                {item.image.startsWith("http") ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  item.image
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  x{item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                          Tổng Kết Thanh Toán
                        </h4>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">Tạm tính</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(selectedOrder.subtotal)}
                            </p>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                              Phí vận chuyển
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(selectedOrder.shippingFee)}
                            </p>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                              Giảm giá (Voucher)
                            </p>
                            <p className="text-sm font-medium text-green-600">
                              -{formatCurrency(selectedOrder.discount)}
                            </p>
                          </div>

                          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                            <p className="text-base font-bold text-gray-900">
                              Tổng cộng
                            </p>
                            <p
                              className="text-xl font-bold text-[#D4AF37]"
                              style={{
                                fontFamily: "'Playfair Display', serif",
                              }}
                            >
                              {formatCurrency(selectedOrder.amount)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-gray-600" />
                            <p className="text-sm font-semibold text-gray-700">
                              Phương thức thanh toán
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedOrder.paymentMethod === "MoMo" && (
                              <div className="w-8 h-8 rounded bg-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                M
                              </div>
                            )}
                            {selectedOrder.paymentMethod === "VNPay" && (
                              <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                VN
                              </div>
                            )}
                            <p className="text-sm font-medium text-gray-900">
                              {selectedOrder.paymentMethod}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Trạng thái thanh toán
                          </p>
                          <span
                            className={`text-sm font-bold ${
                              selectedOrder.paymentStatus === "paid"
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {selectedOrder.paymentStatus === "paid"
                              ? "Đã thanh toán"
                              : "Chưa thanh toán"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer - Admin Actions */}
                <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0 overflow-visible rounded-b-xl">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-white font-semibold px-6"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    In Hóa Đơn
                  </Button>

                  <div className="flex items-center gap-3">
                    {/* Custom Status Dropdown */}
                    <div className="relative" ref={statusDropdownRef}>
                      <button
                        type="button"
                        onClick={() =>
                          setIsStatusDropdownOpen(!isStatusDropdownOpen)
                        }
                        className={`px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all flex items-center gap-2 min-w-[200px] justify-between ${
                          newStatus === "pending"
                            ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                            : newStatus === "confirmed"
                              ? "bg-cyan-50 text-cyan-800 border-cyan-200"
                              : newStatus === "processing"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : newStatus === "shipping"
                                  ? "bg-purple-50 text-purple-800 border-purple-200"
                                  : newStatus === "delivered"
                                    ? "bg-green-50 text-green-800 border-green-200"
                                    : newStatus === "cancelled"
                                      ? "bg-red-50 text-red-800 border-red-200"
                                      : newStatus === "returned"
                                        ? "bg-orange-50 text-orange-800 border-orange-200"
                                        : "bg-gray-50 text-gray-800 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              newStatus === "pending"
                                ? "bg-yellow-100 border-yellow-400"
                                : newStatus === "confirmed"
                                  ? "bg-cyan-100 border-cyan-400"
                                  : newStatus === "processing"
                                    ? "bg-blue-100 border-blue-400"
                                    : newStatus === "shipping"
                                      ? "bg-purple-100 border-purple-400"
                                      : newStatus === "delivered"
                                        ? "bg-green-100 border-green-400"
                                        : newStatus === "cancelled"
                                          ? "bg-red-100 border-red-400"
                                          : newStatus === "returned"
                                            ? "bg-orange-100 border-orange-400"
                                            : "bg-gray-100 border-gray-400"
                            }`}
                          />
                          <span>
                            {newStatus === "pending"
                              ? "Chờ xử lý"
                              : newStatus === "confirmed"
                                ? "Đã xác nhận"
                                : newStatus === "processing"
                                  ? "Đang xử lý"
                                  : newStatus === "shipping"
                                    ? "Đang giao hàng"
                                    : newStatus === "delivered"
                                      ? "Đã giao"
                                      : newStatus === "cancelled"
                                        ? "Đã hủy"
                                        : newStatus === "returned"
                                          ? "Đã hoàn trả"
                                          : ""}
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isStatusDropdownOpen && (
                        <div
                          className="absolute left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-[100] overflow-hidden"
                          style={{ bottom: "100%", marginBottom: "8px" }}
                        >
                          {[
                            {
                              value: "pending",
                              label: "Chờ xử lý",
                              bg: "bg-yellow-50",
                              border: "border-yellow-400",
                              text: "text-yellow-800",
                              circleBg: "bg-yellow-100",
                            },
                            {
                              value: "confirmed",
                              label: "Đã xác nhận",
                              bg: "bg-cyan-50",
                              border: "border-cyan-400",
                              text: "text-cyan-800",
                              circleBg: "bg-cyan-100",
                            },
                            {
                              value: "processing",
                              label: "Đang xử lý",
                              bg: "bg-blue-50",
                              border: "border-blue-400",
                              text: "text-blue-800",
                              circleBg: "bg-blue-100",
                            },
                            {
                              value: "shipping",
                              label: "Đang giao hàng",
                              bg: "bg-purple-50",
                              border: "border-purple-400",
                              text: "text-purple-800",
                              circleBg: "bg-purple-100",
                            },
                            {
                              value: "delivered",
                              label: "Đã giao",
                              bg: "bg-green-50",
                              border: "border-green-400",
                              text: "text-green-800",
                              circleBg: "bg-green-100",
                            },
                            {
                              value: "cancelled",
                              label: "Đã hủy",
                              bg: "bg-red-50",
                              border: "border-red-400",
                              text: "text-red-800",
                              circleBg: "bg-red-100",
                            },
                            {
                              value: "returned",
                              label: "Đã hoàn trả",
                              bg: "bg-orange-50",
                              border: "border-orange-400",
                              text: "text-orange-800",
                              circleBg: "bg-orange-100",
                            },
                          ].map((status) => (
                            <button
                              key={status.value}
                              type="button"
                              onClick={() => {
                                setNewStatus(
                                  status.value as Order["orderStatus"],
                                );
                                setIsStatusDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:${status.bg} transition-colors ${
                                newStatus === status.value
                                  ? status.bg
                                  : "bg-white"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${status.border} ${status.circleBg}`}
                              />
                              <span
                                className={`flex-1 text-left text-sm font-medium ${status.text}`}
                              >
                                {status.label}
                              </span>
                              {newStatus === status.value && (
                                <svg
                                  className="w-4 h-4 text-gray-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => {
                        handleUpdateStatus(newStatus);
                        setShowDetailModal(false);
                      }}
                      className="bg-[#B71C1C] hover:bg-[#8B1538] text-white font-semibold px-6"
                    >
                      Cập Nhật Trạng Thái
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
