import { useState } from "react";
import {
  Search,
  Edit,
  Eye,
  X,
  Check,
  Mail,
  Phone,
  Calendar,
  Crown,
  MapPin,
  ShoppingBag,
  Clock,
  Filter,
  Ban,
  Printer,
  Package,
  Truck,
  RefreshCw
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
function CustomerManagementSplit() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const customers = [
    {
      id: "1",
      userId: "CST-2026-001",
      name: "Nguy\u1EC5n V\u0103n An",
      email: "nguyenvanan@gmail.com",
      phone: "0901234567",
      type: "individual",
      isVip: true,
      totalOrders: 5,
      totalSpent: 45e6,
      registrationDate: "12 Th1, 2026",
      status: "active",
      avatar: "NVA",
      address: "123 \u0110\u01B0\u1EDDng L\xEA L\u1EE3i, Qu\u1EADn 1, TP.HCM",
      lastLogin: "2 gi\u1EDD tr\u01B0\u1EDBc",
      orders: [
        {
          id: "ORD-2025-001",
          date: "15 Th1, 2026",
          amount: 45e5,
          status: "completed"
        },
        {
          id: "ORD-2025-012",
          date: "10 Th1, 2026",
          amount: 89e5,
          status: "shipping"
        },
        {
          id: "ORD-2025-025",
          date: "5 Th1, 2026",
          amount: 67e5,
          status: "completed"
        },
        {
          id: "ORD-2024-156",
          date: "28 Th12, 2025",
          amount: 125e5,
          status: "completed"
        },
        {
          id: "ORD-2024-143",
          date: "20 Th12, 2025",
          amount: 124e5,
          status: "completed"
        }
      ]
    },
    {
      id: "2",
      userId: "CST-2026-002",
      name: "C\xF4ng ty TNHH ABC",
      email: "contact@abc.com.vn",
      phone: "0281234567",
      type: "enterprise",
      isVip: true,
      totalOrders: 2,
      totalSpent: 43e6,
      registrationDate: "10 Th1, 2026",
      status: "active",
      avatar: "ABC",
      address: "456 Nguy\u1EC5n Hu\u1EC7, Qu\u1EADn 1, TP.HCM",
      lastLogin: "1 ng\xE0y tr\u01B0\u1EDBc",
      orders: [
        {
          id: "ORD-2025-045",
          date: "14 Th1, 2026",
          amount: 25e6,
          status: "completed"
        },
        {
          id: "ORD-2025-038",
          date: "12 Th1, 2026",
          amount: 18e6,
          status: "shipping"
        }
      ]
    },
    {
      id: "3",
      userId: "CST-2026-003",
      name: "Tr\u1EA7n Th\u1ECB B\xECnh",
      email: "tranthibinh@yahoo.com",
      phone: "0912345678",
      type: "individual",
      isVip: false,
      totalOrders: 2,
      totalSpent: 67e5,
      registrationDate: "15 Th1, 2026",
      status: "active",
      avatar: "TTB",
      address: "789 L\xEA V\u0103n S\u1EF9, Qu\u1EADn 3, TP.HCM",
      lastLogin: "5 gi\u1EDD tr\u01B0\u1EDBc",
      orders: [
        {
          id: "ORD-2025-003",
          date: "15 Th1, 2026",
          amount: 45e5,
          status: "pending"
        },
        {
          id: "ORD-2025-015",
          date: "8 Th1, 2026",
          amount: 22e5,
          status: "completed"
        }
      ]
    },
    {
      id: "4",
      userId: "CST-2026-004",
      name: "L\xEA Minh Ch\xE2u",
      email: "leminhchau@gmail.com",
      phone: "0923456789",
      type: "individual",
      isVip: false,
      totalOrders: 1,
      totalSpent: 67e5,
      registrationDate: "14 Th1, 2026",
      status: "active",
      avatar: "LMC",
      address: "321 \u0110i\u1EC7n Bi\xEAn Ph\u1EE7, Qu\u1EADn B\xECnh Th\u1EA1nh, TP.HCM",
      lastLogin: "3 ng\xE0y tr\u01B0\u1EDBc",
      orders: [
        {
          id: "ORD-2025-004",
          date: "14 Th1, 2026",
          amount: 67e5,
          status: "shipping"
        }
      ]
    },
    {
      id: "5",
      userId: "CST-2026-005",
      name: "T\u1EADp \u0111o\xE0n XYZ",
      email: "info@xyz.com.vn",
      phone: "0281239876",
      type: "enterprise",
      isVip: true,
      totalOrders: 1,
      totalSpent: 35e6,
      registrationDate: "28 Th12, 2025",
      status: "active",
      avatar: "XYZ",
      address: "555 V\xF5 V\u0103n T\u1EA7n, Qu\u1EADn 3, TP.HCM",
      lastLogin: "30 ph\xFAt tr\u01B0\u1EDBc",
      orders: [
        {
          id: "ORD-2025-050",
          date: "15 Th1, 2026",
          amount: 35e6,
          status: "completed"
        }
      ]
    },
    {
      id: "6",
      userId: "CST-2026-006",
      name: "Ph\u1EA1m Qu\u1ED1c D\u0169ng",
      email: "phamquocdung@outlook.com",
      phone: "0934567890",
      type: "individual",
      isVip: false,
      totalOrders: 1,
      totalSpent: 32e5,
      registrationDate: "14 Th1, 2026",
      status: "active",
      avatar: "PQD",
      address: "888 Phan X\xEDch Long, Qu\u1EADn Ph\xFA Nhu\u1EADn, TP.HCM",
      lastLogin: "1 tu\u1EA7n tr\u01B0\u1EDBc",
      orders: [
        {
          id: "ORD-2025-005",
          date: "14 Th1, 2026",
          amount: 32e5,
          status: "completed"
        }
      ]
    },
    {
      id: "7",
      userId: "CST-2026-007",
      name: "Ho\xE0ng Th\u1ECB Mai",
      email: "hoangthimai@gmail.com",
      phone: "0945678901",
      type: "individual",
      isVip: true,
      totalOrders: 3,
      totalSpent: 187e5,
      registrationDate: "20 Th12, 2025",
      status: "active",
      avatar: "HTM",
      address: "222 Nguy\u1EC5n Th\u1ECB Minh Khai, Qu\u1EADn 1, TP.HCM",
      lastLogin: "1 gi\u1EDD tr\u01B0\u1EDBc",
      orders: [
        {
          id: "ORD-2025-008",
          date: "12 Th1, 2026",
          amount: 55e5,
          status: "completed"
        },
        {
          id: "ORD-2025-021",
          date: "6 Th1, 2026",
          amount: 72e5,
          status: "completed"
        },
        {
          id: "ORD-2024-178",
          date: "25 Th12, 2025",
          amount: 6e6,
          status: "completed"
        }
      ]
    },
    {
      id: "8",
      userId: "CST-2026-008",
      name: "\u0110\u1ED7 V\u0103n H\xF9ng",
      email: "dovanhung@example.com",
      phone: "0956789012",
      type: "individual",
      isVip: false,
      totalOrders: 1,
      totalSpent: 54e5,
      registrationDate: "13 Th1, 2026",
      status: "blocked",
      avatar: "DVH",
      address: "666 C\xE1ch M\u1EA1ng Th\xE1ng 8, Qu\u1EADn 10, TP.HCM",
      lastLogin: "2 tu\u1EA7n tr\u01B0\u1EDBc",
      orders: [
        {
          id: "ORD-2025-007",
          date: "13 Th1, 2026",
          amount: 54e5,
          status: "cancelled"
        }
      ]
    }
  ];
  const [selectedCustomer, setSelectedCustomer] = useState(
    customers[0]
  );
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "\u0111";
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Ho\xE0n th\xE0nh"
      },
      shipping: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "\u0110ang giao"
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Ch\u1EDD x\u1EED l\xFD"
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "\u0110\xE3 h\u1EE7y"
      }
    };
    const config = statusConfig[status];
    return <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
        {config.label}
      </span>;
  };
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.email.toLowerCase().includes(searchQuery.toLowerCase()) || customer.phone.includes(searchQuery) || customer.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || typeFilter === "vip" && customer.isVip || typeFilter === "individual" && customer.type === "individual" && !customer.isVip || typeFilter === "enterprise" && customer.type === "enterprise";
    return matchesSearch && matchesType;
  });
  return <div className="p-8">
      {
    /* Header */
  }
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

      {
    /* Master-Detail Split Layout */
  }
      <div className="grid grid-cols-12 gap-6">
        {
    /* LEFT PANEL: Customer List (35% - 4 columns) */
  }
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {
    /* Search & Filter */
  }
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

            {
    /* Quick Filters */
  }
            <div className="flex gap-2">
              <button
    onClick={() => setTypeFilter("all")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === "all" ? "bg-[#B71C1C] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
  >
                Tất cả
              </button>
              <button
    onClick={() => setTypeFilter("vip")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === "vip" ? "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
  >
                VIP
              </button>
              <button
    onClick={() => setTypeFilter("enterprise")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === "enterprise" ? "bg-[#B71C1C] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
  >
                DN
              </button>
            </div>
          </div>

          {
    /* Customer List */
  }
          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-2">
            {filteredCustomers.map((customer) => <button
    key={customer.id}
    onClick={() => setSelectedCustomer(customer)}
    className={`w-full bg-white rounded-xl shadow-sm p-4 text-left transition-all hover:shadow-md ${selectedCustomer?.id === customer.id ? "border-2 border-[#D4AF37] bg-yellow-50" : "border border-gray-200"}`}
  >
                <div className="flex items-start gap-3">
                  <div
    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${customer.isVip ? "bg-gradient-to-br from-[#D4AF37] to-[#FFD700]" : customer.type === "enterprise" ? "bg-blue-500" : "bg-gray-500"}`}
  >
                    {customer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {customer.name}
                      </p>
                      {customer.isVip && <Crown className="h-3.5 w-3.5 text-[#D4AF37] flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {customer.phone}
                    </p>
                    <div className="flex items-center gap-2">
                      {customer.isVip ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white">
                          VIP
                        </span> : customer.type === "enterprise" ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          DN
                        </span> : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          Cá nhân
                        </span>}
                      {customer.status === "blocked" && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Blocked
                        </span>}
                    </div>
                  </div>
                </div>
              </button>)}
          </div>
        </div>

        {
    /* RIGHT PANEL: Customer Detail (65% - 8 columns) */
  }
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {
    /* Profile Overview Card */
  }
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                <div
    className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 ${selectedCustomer.isVip ? "bg-gradient-to-br from-[#D4AF37] to-[#FFD700]" : selectedCustomer.type === "enterprise" ? "bg-blue-500" : "bg-gray-500"}`}
  >
                  {selectedCustomer.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2
    className="text-2xl font-bold text-gray-900"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                      {selectedCustomer.name}
                    </h2>
                    {selectedCustomer.isVip && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white">
                        <Crown className="h-3 w-3" />
                        VIP CUSTOMER
                      </span>}
                  </div>
                  <p className="text-sm text-gray-500 mb-4 font-mono">
                    {selectedCustomer.userId}
                  </p>

                  {
    /* Contact Info */
  }
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

              {
    /* Action Buttons */
  }
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
    className={`${selectedCustomer.status === "blocked" ? "border-green-500 text-green-700 hover:bg-green-50" : "border-red-500 text-red-700 hover:bg-red-50"}`}
  >
                  <Ban className="h-4 w-4 mr-2" />
                  {selectedCustomer.status === "blocked" ? "M\u1EDF kh\xF3a" : "Ch\u1EB7n"}
                </Button>
              </div>
            </div>

            {
    /* Key Metrics */
  }
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Tổng chi tiêu</p>
                <p
    className="text-2xl font-bold text-[#D4AF37]"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                  {formatCurrency(selectedCustomer.totalSpent)}
                </p>
              </div>
              <div className="text-center border-l border-r border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Tổng đơn hàng</p>
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

          {
    /* Order History Section */
  }
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
                  {selectedCustomer.orders.map((order) => <tr
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
                    </tr>)}
                </tbody>
              </table>
            </div>

            {selectedCustomer.orders.length === 0 && <div className="py-12 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  Khách hàng chưa có đơn hàng nào
                </p>
              </div>}
          </div>
        </div>
      </div>

      {
    /* Order Detail Modal */
  }
      {showOrderDetailModal && selectedOrderId && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {
    /* Modal Header */
  }
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <h3
    className="text-2xl font-bold text-gray-900"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                  Chi tiết đơn hàng #{selectedOrderId}
                </h3>
                <span
    className={`px-4 py-2 rounded-full text-xs font-semibold ${selectedOrderId === "ORD-2025-001" ? "bg-green-100 text-green-800" : selectedOrderId === "ORD-2025-012" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}
  >
                  {selectedOrderId === "ORD-2025-012" ? "\u0110ang giao" : "Ho\xE0n th\xE0nh"}
                </span>
              </div>
              <button
    onClick={() => setShowOrderDetailModal(false)}
    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
  >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {
    /* Modal Body - Two Column Layout */
  }
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {
    /* Left Column: Delivery Info */
  }
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                      Thông Tin Giao Hàng
                    </h4>

                    <div className="space-y-4 bg-gray-50 rounded-lg p-5">
                      {
    /* Receiver */
  }
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Người nhận</p>
                        <p className="text-sm font-bold text-gray-900">
                          {selectedCustomer.name}
                        </p>
                      </div>

                      {
    /* Phone */
  }
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">
                            {selectedCustomer.phone}
                          </p>
                        </div>
                      </div>

                      {
    /* Address */
  }
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Địa chỉ giao hàng</p>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm font-medium text-gray-900">
                            {selectedCustomer.address}
                          </p>
                        </div>
                      </div>

                      {
    /* Shipping Method */
  }
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Phương thức vận chuyển</p>
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

                {
    /* Right Column: Product & Payment */
  }
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                      Sản Phẩm
                    </h4>

                    {
    /* Product Item */
  }
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
                            {formatCurrency(15e5)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {
    /* Payment Summary */
  }
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                      Thanh Toán
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Tạm tính</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(45e5)}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Phí vận chuyển</p>
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
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                          {formatCurrency(45e5)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {
    /* Payment Method */
  }
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
                        <p className="text-sm font-medium text-gray-900">MoMo</p>
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

            {
    /* Modal Footer */
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
        </div>}
    </div>;
}
export {
  CustomerManagementSplit
};

