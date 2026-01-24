import { useState } from "react";
import {
  Search,
  Download,
  Eye,
  Printer,
  X,
  Check,
  PackageCheck,
  MapPin,
  Mail,
  Phone,
  StickyNote,
  CreditCard
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
function OrderManagement() {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [newStatus, setNewStatus] = useState("pending");
  const [orders, setOrders] = useState([
    {
      id: "ORD-2025-001",
      customer: {
        name: "Nguy\u1EC5n V\u0103n An",
        avatar: "NVA",
        email: "an.nguyen@email.com",
        phone: "0909 123 456",
        address: "123 \u0110\u01B0\u1EDDng L\xEA L\u1EE3i, Qu\u1EADn 1, TP.HCM"
      },
      date: "15/01/2026",
      amount: 455e4,
      paymentStatus: "paid",
      orderStatus: "pending",
      items: [
        {
          id: "1",
          name: "H\u1ED9p Qu\xE0 Ph\xFA Qu\xFD",
          image: "\u{1F381}",
          quantity: 2,
          price: 15e5
        },
        {
          id: "2",
          name: "Vang \u0110\u1ECF Chile Premium",
          image: "\u{1F377}",
          quantity: 1,
          price: 15e5
        }
      ],
      subtotal: 45e5,
      shippingFee: 5e4,
      discount: 0,
      paymentMethod: "MoMo",
      note: "Giao h\xE0ng trong gi\u1EDD h\xE0nh ch\xEDnh, g\xF3i qu\xE0 c\u1EA9n th\u1EADn."
    },
    {
      id: "ORD-2025-002",
      customer: {
        name: "Tr\u1EA7n Th\u1ECB B\xECnh",
        avatar: "TTB",
        email: "binh.tran@company.vn",
        phone: "0912 345 678",
        address: "456 Nguy\u1EC5n Hu\u1EC7, Qu\u1EADn 1, TP.HCM"
      },
      date: "15/01/2026",
      amount: 89e5,
      paymentStatus: "paid",
      orderStatus: "shipping",
      items: [
        {
          id: "1",
          name: "Hamper T\u1EBFt Sang Tr\u1ECDng",
          image: "\u{1F381}",
          quantity: 3,
          price: 28e5
        },
        {
          id: "2",
          name: "Tr\xE0 Cao C\u1EA5p Premium",
          image: "\u{1F375}",
          quantity: 1,
          price: 5e5
        }
      ],
      subtotal: 88e5,
      shippingFee: 1e5,
      discount: 0,
      paymentMethod: "VNPay"
    },
    {
      id: "ORD-2025-003",
      customer: {
        name: "C\xF4ng ty TNHH ABC",
        avatar: "ABC",
        email: "abc@company.vn",
        phone: "0987 654 321",
        address: "789 \u0110\u01B0\u1EDDng V\xF5 V\u0103n T\u1EA7n, Qu\u1EADn 2, TP.HCM"
      },
      date: "14/01/2026",
      amount: 25e6,
      paymentStatus: "paid",
      orderStatus: "completed",
      items: [
        {
          id: "1",
          name: "B\u1ED9 S\u01B0u T\u1EADp Ngh\u1EC7 Thu\u1EADt",
          image: "\u{1F5BC}\uFE0F",
          quantity: 1,
          price: 25e6
        }
      ],
      subtotal: 25e6,
      shippingFee: 0,
      discount: 0,
      paymentMethod: "Bank Transfer"
    },
    {
      id: "ORD-2025-004",
      customer: {
        name: "L\xEA Minh Ch\xE2u",
        avatar: "LMC",
        email: "chau.le@email.com",
        phone: "0900 111 222",
        address: "101 \u0110\u01B0\u1EDDng Tr\u1EA7n H\u01B0ng \u0110\u1EA1o, Qu\u1EADn 5, TP.HCM"
      },
      date: "14/01/2026",
      amount: 67e5,
      paymentStatus: "unpaid",
      orderStatus: "processing",
      items: [
        {
          id: "1",
          name: "B\u1ED9 S\u01B0u T\u1EADp Ngh\u1EC7 Thu\u1EADt",
          image: "\u{1F5BC}\uFE0F",
          quantity: 1,
          price: 67e5
        }
      ],
      subtotal: 67e5,
      shippingFee: 0,
      discount: 0,
      paymentMethod: "Credit Card"
    },
    {
      id: "ORD-2025-005",
      customer: {
        name: "Ph\u1EA1m Qu\u1ED1c D\u0169ng",
        avatar: "PQD",
        email: "dung.pham@email.com",
        phone: "0900 333 444",
        address: "202 \u0110\u01B0\u1EDDng L\xEA Du\u1EA9n, Qu\u1EADn 1, TP.HCM"
      },
      date: "14/01/2026",
      amount: 32e5,
      paymentStatus: "paid",
      orderStatus: "pending",
      items: [
        {
          id: "1",
          name: "H\u1ED9p Qu\xE0 Ph\xFA Qu\xFD",
          image: "\u{1F381}",
          quantity: 2,
          price: 15e5
        },
        {
          id: "2",
          name: "Vang \u0110\u1ECF Chile Premium",
          image: "\u{1F377}",
          quantity: 1,
          price: 15e5
        }
      ],
      subtotal: 45e5,
      shippingFee: 5e4,
      discount: 0,
      paymentMethod: "MoMo"
    },
    {
      id: "ORD-2025-006",
      customer: {
        name: "Ho\xE0ng Th\u1ECB Mai",
        avatar: "HTM",
        email: "mai.hoang@email.com",
        phone: "0900 555 666",
        address: "303 \u0110\u01B0\u1EDDng L\xEA Du\u1EA9n, Qu\u1EADn 1, TP.HCM"
      },
      date: "13/01/2026",
      amount: 125e5,
      paymentStatus: "paid",
      orderStatus: "shipping",
      items: [
        {
          id: "1",
          name: "Hamper T\u1EBFt Sang Tr\u1ECDng",
          image: "\u{1F381}",
          quantity: 3,
          price: 28e5
        },
        {
          id: "2",
          name: "Tr\xE0 Cao C\u1EA5p Premium",
          image: "\u{1F375}",
          quantity: 1,
          price: 5e5
        }
      ],
      subtotal: 88e5,
      shippingFee: 1e5,
      discount: 0,
      paymentMethod: "VNPay"
    },
    {
      id: "ORD-2025-007",
      customer: {
        name: "\u0110\u1ED7 V\u0103n H\xF9ng",
        avatar: "DVH",
        email: "hung.do@email.com",
        phone: "0900 777 888",
        address: "404 \u0110\u01B0\u1EDDng L\xEA Du\u1EA9n, Qu\u1EADn 1, TP.HCM"
      },
      date: "13/01/2026",
      amount: 54e5,
      paymentStatus: "unpaid",
      orderStatus: "cancelled",
      items: [
        {
          id: "1",
          name: "B\u1ED9 S\u01B0u T\u1EADp Ngh\u1EC7 Thu\u1EADt",
          image: "\u{1F5BC}\uFE0F",
          quantity: 1,
          price: 67e5
        }
      ],
      subtotal: 67e5,
      shippingFee: 0,
      discount: 0,
      paymentMethod: "Credit Card"
    },
    {
      id: "ORD-2025-008",
      customer: {
        name: "V\u0169 Th\u1ECB Lan",
        avatar: "VTL",
        email: "lan.vu@email.com",
        phone: "0900 999 000",
        address: "505 \u0110\u01B0\u1EDDng L\xEA Du\u1EA9n, Qu\u1EADn 1, TP.HCM"
      },
      date: "12/01/2026",
      amount: 156e5,
      paymentStatus: "paid",
      orderStatus: "completed",
      items: [
        {
          id: "1",
          name: "B\u1ED9 S\u01B0u T\u1EADp Ngh\u1EC7 Thu\u1EADt",
          image: "\u{1F5BC}\uFE0F",
          quantity: 1,
          price: 25e6
        }
      ],
      subtotal: 25e6,
      shippingFee: 0,
      discount: 0,
      paymentMethod: "Bank Transfer"
    }
  ]);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Ch\u1EDD x\u1EED l\xFD"
      },
      processing: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "\u0110ang x\u1EED l\xFD"
      },
      shipping: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "\u0110ang giao"
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Ho\xE0n th\xE0nh"
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "\u0110\xE3 h\u1EE7y"
      }
    };
    const config = statusConfig[status];
    return <button
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
      </button>;
  };
  const getPaymentBadge = (status) => {
    const config = {
      paid: {
        bg: "bg-green-50",
        text: "text-green-700",
        label: "\u0110\xE3 thanh to\xE1n"
      },
      unpaid: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Ch\u01B0a thanh to\xE1n"
      }
    };
    const badge = config[status];
    return <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
    >
        {badge.label}
      </span>;
  };
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };
  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };
  const handleUpdateStatus = (newStatus2) => {
    if (!selectedOrder) return;
    setOrders(
      orders.map(
        (order) => order.id === selectedOrder.id ? { ...order, orderStatus: newStatus2 } : order
      )
    );
    setShowStatusModal(false);
    setSelectedOrder(null);
  };
  const handleQuickStatusChange = (order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });
  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "pending").length,
    processing: orders.filter((o) => o.orderStatus === "processing").length,
    shipping: orders.filter((o) => o.orderStatus === "shipping").length,
    completed: orders.filter((o) => o.orderStatus === "completed").length
  };
  return <div className="p-8">
      {
    /* Header */
  }
      <div className="mb-8">
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

      {
    /* Stats Overview */
  }
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

      {
    /* Filters and Actions */
  }
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {
    /* Search */
  }
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

          {
    /* Filters and Actions */
  }
          <div className="flex flex-wrap gap-3">
            {
    /* Status Filter */
  }
            <select
    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipping">Đang giao</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            {
    /* Payment Filter */
  }
            <select
    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
    value={paymentFilter}
    onChange={(e) => setPaymentFilter(e.target.value)}
  >
              <option value="all">Tất cả thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
            </select>

            {
    /* Export Button */
  }
            <Button className="bg-[#D4AF37] hover:bg-[#C19A6B] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>

        {
    /* Selected Orders Actions */
  }
        {selectedOrders.length > 0 && <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Đã chọn <span className="font-bold">{selectedOrders.length}</span> đơn hàng
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
          </div>}
      </div>

      {
    /* Orders Table */
  }
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
              {filteredOrders.map((order) => <tr
    key={order.id}
    className="hover:bg-gray-50 transition-colors"
  >
                  <td className="px-6 py-4">
                    <input
    type="checkbox"
    className="w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#D4AF37]"
    checked={selectedOrders.includes(order.id)}
    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
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
                    <span className="text-sm text-gray-600">{order.date}</span>
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
                </tr>)}
            </tbody>
          </table>
        </div>

        {
    /* Empty State */
  }
        {filteredOrders.length === 0 && <div className="py-16 text-center">
            <p className="text-gray-500 text-lg">Không tìm thấy đơn hàng nào</p>
          </div>}

        {
    /* Pagination */
  }
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị <span className="font-semibold">{filteredOrders.length}</span> / <span className="font-semibold">{orders.length}</span> đơn hàng
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Trước
            </Button>
            <Button variant="outline" size="sm" className="bg-[#B71C1C] text-white border-[#B71C1C]">
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

      {
    /* Quick Status Update Modal */
  }
      {showStatusModal && selectedOrder && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {
    /* Modal Header */
  }
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

            {
    /* Modal Body */
  }
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
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${selectedOrder.orderStatus === "pending" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-yellow-300"}`}
  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        Chờ xử lý
                      </span>
                    </div>
                    {selectedOrder.orderStatus === "pending" && <Check className="h-5 w-5 text-yellow-600" />}
                  </button>

                  <button
    onClick={() => handleUpdateStatus("processing")}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${selectedOrder.orderStatus === "processing" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        Đang xử lý
                      </span>
                    </div>
                    {selectedOrder.orderStatus === "processing" && <Check className="h-5 w-5 text-blue-600" />}
                  </button>

                  <button
    onClick={() => handleUpdateStatus("shipping")}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${selectedOrder.orderStatus === "shipping" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"}`}
  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <PackageCheck className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        Đang giao hàng
                      </span>
                    </div>
                    {selectedOrder.orderStatus === "shipping" && <Check className="h-5 w-5 text-purple-600" />}
                  </button>

                  <button
    onClick={() => handleUpdateStatus("completed")}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${selectedOrder.orderStatus === "completed" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"}`}
  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        Hoàn thành
                      </span>
                    </div>
                    {selectedOrder.orderStatus === "completed" && <Check className="h-5 w-5 text-green-600" />}
                  </button>

                  <button
    onClick={() => handleUpdateStatus("cancelled")}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${selectedOrder.orderStatus === "cancelled" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"}`}
  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <X className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        Đã hủy
                      </span>
                    </div>
                    {selectedOrder.orderStatus === "cancelled" && <Check className="h-5 w-5 text-red-600" />}
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
        </div>}

      {
    /* Order Detail Modal */
  }
      {showDetailModal && selectedOrder && <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {
    /* Modal Header */
  }
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
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
    className={`px-4 py-2 rounded-full text-xs font-semibold ${selectedOrder.orderStatus === "pending" ? "bg-yellow-100 text-yellow-800" : selectedOrder.orderStatus === "processing" ? "bg-blue-100 text-blue-800" : selectedOrder.orderStatus === "shipping" ? "bg-purple-100 text-purple-800" : selectedOrder.orderStatus === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
  >
                  {selectedOrder.orderStatus === "pending" ? "Ch\u1EDD x\u1EED l\xFD" : selectedOrder.orderStatus === "processing" ? "\u0110ang x\u1EED l\xFD" : selectedOrder.orderStatus === "shipping" ? "\u0110ang giao" : selectedOrder.orderStatus === "completed" ? "Ho\xE0n th\xE0nh" : "\u0110\xE3 h\u1EE7y"}
                </span>
                <button
    onClick={() => setShowDetailModal(false)}
    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
  >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            {
    /* Modal Body - Two Column Layout */
  }
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {
    /* Column 1: Customer & Shipping Info */
  }
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                      Thông Tin Khách Hàng
                    </h4>
                    
                    <div className="space-y-4">
                      {
    /* Customer Name & Avatar */
  }
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold text-lg">
                          {selectedOrder.customer.avatar}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            {selectedOrder.customer.name}
                          </p>
                          <p className="text-sm text-gray-500">Khách hàng</p>
                        </div>
                      </div>

                      {
    /* Contact Info */
  }
                      <div className="space-y-3 pl-2">
                        <div className="flex items-start gap-3">
                          <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Số điện thoại</p>
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
                            <p className="text-xs text-gray-500">Địa chỉ giao hàng</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedOrder.customer.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {
    /* Customer Note */
  }
                  {selectedOrder.note && <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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
                    </div>}
                </div>

                {
    /* Column 2: Order Items & Payment */
  }
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                      Danh Sách Sản Phẩm
                    </h4>

                    {
    /* Product List */
  }
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => <div
    key={item.id}
    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
  >
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#FFFDF5] to-[#F5F5F5] flex items-center justify-center text-3xl border border-gray-200 flex-shrink-0">
                            {item.image}
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
                        </div>)}
                    </div>
                  </div>

                  {
    /* Payment Summary */
  }
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
                        <p className="text-sm text-gray-600">Phí vận chuyển</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(selectedOrder.shippingFee)}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Giảm giá (Voucher)</p>
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
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                          {formatCurrency(selectedOrder.amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {
    /* Payment Method */
  }
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <p className="text-sm font-semibold text-gray-700">
                          Phương thức thanh toán
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedOrder.paymentMethod === "MoMo" && <div className="w-8 h-8 rounded bg-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            M
                          </div>}
                        {selectedOrder.paymentMethod === "VNPay" && <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            VN
                          </div>}
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.paymentMethod}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Trạng thái thanh toán</p>
                      <span
    className={`text-sm font-bold ${selectedOrder.paymentStatus === "paid" ? "text-green-600" : "text-gray-600"}`}
  >
                        {selectedOrder.paymentStatus === "paid" ? "\u0110\xE3 thanh to\xE1n" : "Ch\u01B0a thanh to\xE1n"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {
    /* Modal Footer - Admin Actions */
  }
            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <Button
    variant="outline"
    className="border-gray-300 text-gray-700 hover:bg-white font-semibold px-6"
  >
                <Printer className="h-4 w-4 mr-2" />
                In Hóa Đơn
              </Button>

              <div className="flex items-center gap-3">
                <select
    value={newStatus}
    onChange={(e) => setNewStatus(e.target.value)}
    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
  >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao hàng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>

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
        </div>}
    </div>;
}
export {
  OrderManagement
};
