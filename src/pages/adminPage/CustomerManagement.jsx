import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  Calendar,
  Building2,
  User,
  Crown
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "individual",
    address: "",
    companyName: ""
  });
  const [customers, setCustomers] = useState([
    {
      id: "1",
      userId: "CST-2026-001",
      name: "Nguy\u1EC5n V\u0103n An",
      email: "nguyenvanan@gmail.com",
      phone: "0901234567",
      type: "individual",
      isVip: true,
      totalOrders: 15,
      totalSpent: 45e6,
      registrationDate: "Jan 12, 2026",
      status: "active",
      avatar: "NVA"
    },
    {
      id: "2",
      userId: "CST-2026-002",
      name: "C\xF4ng ty TNHH ABC",
      email: "contact@abc.com.vn",
      phone: "0281234567",
      type: "enterprise",
      isVip: true,
      totalOrders: 45,
      totalSpent: 25e7,
      registrationDate: "Jan 10, 2026",
      status: "active",
      avatar: "ABC"
    },
    {
      id: "3",
      userId: "CST-2026-003",
      name: "Tr\u1EA7n Th\u1ECB B\xECnh",
      email: "tranthibinh@yahoo.com",
      phone: "0912345678",
      type: "individual",
      isVip: false,
      totalOrders: 3,
      totalSpent: 89e5,
      registrationDate: "Jan 15, 2026",
      status: "active",
      avatar: "TTB"
    },
    {
      id: "4",
      userId: "CST-2026-004",
      name: "L\xEA Minh Ch\xE2u",
      email: "leminhchau@gmail.com",
      phone: "0923456789",
      type: "individual",
      isVip: false,
      totalOrders: 2,
      totalSpent: 67e5,
      registrationDate: "Jan 14, 2026",
      status: "active",
      avatar: "LMC"
    },
    {
      id: "5",
      userId: "CST-2026-005",
      name: "T\u1EADp \u0111o\xE0n XYZ",
      email: "info@xyz.com.vn",
      phone: "0281239876",
      type: "enterprise",
      isVip: true,
      totalOrders: 28,
      totalSpent: 18e7,
      registrationDate: "Dec 28, 2025",
      status: "active",
      avatar: "XYZ"
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
      registrationDate: "Jan 14, 2026",
      status: "active",
      avatar: "PQD"
    },
    {
      id: "7",
      userId: "CST-2026-007",
      name: "Ho\xE0ng Th\u1ECB Mai",
      email: "hoangthimai@gmail.com",
      phone: "0945678901",
      type: "individual",
      isVip: true,
      totalOrders: 12,
      totalSpent: 355e5,
      registrationDate: "Dec 20, 2025",
      status: "active",
      avatar: "HTM"
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
      registrationDate: "Jan 13, 2026",
      status: "blocked",
      avatar: "DVH"
    },
    {
      id: "9",
      userId: "CST-2026-009",
      name: "C\xF4ng ty TNHH Tech Solutions",
      email: "sales@techsolutions.vn",
      phone: "0281234999",
      type: "enterprise",
      isVip: false,
      totalOrders: 5,
      totalSpent: 45e6,
      registrationDate: "Jan 08, 2026",
      status: "active",
      avatar: "TCS"
    },
    {
      id: "10",
      userId: "CST-2026-010",
      name: "V\u0169 Th\u1ECB Lan",
      email: "vuthilan@gmail.com",
      phone: "0967890123",
      type: "individual",
      isVip: false,
      totalOrders: 4,
      totalSpent: 156e5,
      registrationDate: "Jan 12, 2026",
      status: "active",
      avatar: "VTL"
    }
  ]);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "\u0111";
  };
  const getTypeBadge = (type, isVip) => {
    if (isVip) {
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white">
          <Crown className="h-3 w-3" />
          VIP
        </span>;
    }
    const config = {
      individual: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "C\xE1 nh\xE2n",
        icon: User
      },
      enterprise: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Doanh nghi\u1EC7p",
        icon: Building2
      }
    };
    const badge = config[type];
    const Icon = badge.icon;
    return <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
    >
        <Icon className="h-3 w-3" />
        {badge.label}
      </span>;
  };
  const handleDeleteCustomer = (customerId) => {
    if (confirm("B\u1EA1n c\xF3 ch\u1EAFc mu\u1ED1n x\xF3a kh\xE1ch h\xE0ng n\xE0y?")) {
      setCustomers(customers.filter((customer) => customer.id !== customerId));
    }
  };
  const handleToggleStatus = (customerId) => {
    setCustomers(
      customers.map(
        (customer) => customer.id === customerId ? {
          ...customer,
          status: customer.status === "active" ? "blocked" : "active"
        } : customer
      )
    );
  };
  const handleAddNewCustomer = () => {
    setSelectedCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      type: "individual",
      address: "",
      companyName: ""
    });
    setShowAddModal(true);
  };
  const handleSaveCustomer = () => {
    const newCustomer = {
      id: (customers.length + 1).toString(),
      userId: `CST-2026-${String(customers.length + 1).padStart(3, "0")}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      isVip: false,
      totalOrders: 0,
      totalSpent: 0,
      registrationDate: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      status: "active",
      avatar: formData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 3)
    };
    setCustomers([...customers, newCustomer]);
    setShowAddModal(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      type: "individual",
      address: "",
      companyName: ""
    });
  };
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.email.toLowerCase().includes(searchQuery.toLowerCase()) || customer.phone.includes(searchQuery) || customer.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || typeFilter === "vip" && customer.isVip || typeFilter === "individual" && customer.type === "individual" && !customer.isVip || typeFilter === "enterprise" && customer.type === "enterprise";
    return matchesSearch && matchesType;
  });
  const customerStats = {
    total: customers.length,
    individual: customers.filter((c) => c.type === "individual").length,
    enterprise: customers.filter((c) => c.type === "enterprise").length,
    vip: customers.filter((c) => c.isVip).length
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
          Danh Sách Khách Hàng
        </h1>
        <p className="text-gray-600">
          Quản lý thông tin và theo dõi hoạt động của khách hàng
        </p>
      </div>

      {
    /* Stats Overview */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng khách hàng</p>
              <p
    className="text-2xl font-bold text-gray-900"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                {customerStats.total}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 mb-1">Khách lẻ</p>
              <p
    className="text-2xl font-bold text-gray-900"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                {customerStats.individual}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 mb-1">Doanh nghiệp</p>
              <p
    className="text-2xl font-bold text-blue-900"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                {customerStats.enterprise}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-200 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-lg shadow-sm p-4 border border-[#D4AF37]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/90 mb-1">Khách VIP</p>
              <p
    className="text-2xl font-bold text-white"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                {customerStats.vip}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {
    /* Search and Filters */
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
    placeholder="Tìm kiếm theo tên, SĐT, email..."
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
    /* Filter Buttons */
  }
            <button
    onClick={() => setTypeFilter("all")}
    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${typeFilter === "all" ? "bg-[#B71C1C] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
  >
              Tất cả
            </button>
            <button
    onClick={() => setTypeFilter("individual")}
    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${typeFilter === "individual" ? "bg-[#B71C1C] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
  >
              Khách lẻ
            </button>
            <button
    onClick={() => setTypeFilter("enterprise")}
    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${typeFilter === "enterprise" ? "bg-[#B71C1C] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
  >
              Doanh nghiệp
            </button>
            <button
    onClick={() => setTypeFilter("vip")}
    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${typeFilter === "vip" ? "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
  >
              VIP
            </button>

            {
    /* Add Customer Button */
  }
            <Button
    onClick={handleAddNewCustomer}
    className="bg-[#B71C1C] hover:bg-[#8B1538] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
  >
              <Plus className="h-5 w-5" />
              Thêm Khách Hàng Mới
            </Button>
          </div>
        </div>
      </div>

      {
    /* Customers Table */
  }
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[35%]">
                  Thông Tin Khách Hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                  Liên Hệ
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  Đơn Hàng & Chi Tiêu
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  Ngày & Trạng Thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => <tr
    key={customer.id}
    className="hover:bg-gray-50 transition-colors"
  >
                  {
    /* Customer Info - Combined */
  }
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
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
                        <p className="text-xs text-gray-500 font-mono mb-1.5">
                          {customer.userId}
                        </p>
                        {getTypeBadge(customer.type, customer.isVip)}
                      </div>
                    </div>
                  </td>

                  {
    /* Contact - Stacked */
  }
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </td>

                  {
    /* Orders & Spending - Combined */
  }
                  <td className="px-6 py-4">
                    <div className="text-center space-y-1">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-900">
                          {customer.totalOrders}
                        </span>{" "}
                        đơn
                      </p>
                      <p
    className={`text-sm font-bold ${customer.isVip || customer.totalSpent >= 3e7 ? "text-[#D4AF37]" : "text-gray-900"}`}
  >
                        {formatCurrency(customer.totalSpent)}
                      </p>
                    </div>
                  </td>

                  {
    /* Date & Status - Combined */
  }
                  <td className="px-6 py-4">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="whitespace-nowrap">{customer.registrationDate}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <button
    onClick={() => handleToggleStatus(customer.id)}
    className={`w-2.5 h-2.5 rounded-full ${customer.status === "active" ? "bg-green-500" : "bg-red-500"}`}
    title={customer.status === "active" ? "Active" : "Blocked"}
  />
                        <span
    className={`text-xs font-semibold ${customer.status === "active" ? "text-green-700" : "text-red-700"}`}
  >
                          {customer.status === "active" ? "Active" : "Blocked"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {
    /* Actions */
  }
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
    className="p-2 text-gray-600 hover:text-[#D4AF37] hover:bg-gray-100 rounded-lg transition-colors"
    title="Chỉnh sửa"
  >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
    className="p-2 text-gray-600 hover:text-[#B71C1C] hover:bg-gray-100 rounded-lg transition-colors"
    title="Xem lịch sử"
  >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
    onClick={() => handleDeleteCustomer(customer.id)}
    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    title="Xóa"
  >
                        <Trash2 className="h-4 w-4" />
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
        {filteredCustomers.length === 0 && <div className="py-16 text-center">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Không tìm thấy khách hàng nào
            </p>
          </div>}

        {
    /* Pagination */
  }
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị{" "}
            <span className="font-semibold">
              1-{Math.min(10, filteredCustomers.length)}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-semibold">{filteredCustomers.length}</span>{" "}
            khách hàng
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              &lt;
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
              ...
            </Button>
            <Button variant="outline" size="sm">
              &gt;
            </Button>
          </div>
        </div>
      </div>

      {
    /* Add Customer Modal */
  }
      {showAddModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {
    /* Modal Header */
  }
            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-5 flex items-center justify-between sticky top-0 z-10">
              <h3
    className="text-2xl font-bold text-white"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                Thêm Khách Hàng Mới
              </h3>
              <button
    onClick={() => setShowAddModal(false)}
    className="text-white/80 hover:text-white transition-colors"
  >
                <X className="h-6 w-6" />
              </button>
            </div>

            {
    /* Modal Body */
  }
            <div className="p-8">
              <div className="space-y-6">
                {
    /* Customer Type */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Loại Khách Hàng <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <button
    onClick={() => setFormData({ ...formData, type: "individual" })}
    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${formData.type === "individual" ? "border-[#B71C1C] bg-red-50" : "border-gray-300 hover:border-gray-400"}`}
  >
                      <User className="h-5 w-5 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm font-semibold text-gray-900">
                        Cá nhân
                      </p>
                    </button>
                    <button
    onClick={() => setFormData({ ...formData, type: "enterprise" })}
    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${formData.type === "enterprise" ? "border-[#B71C1C] bg-red-50" : "border-gray-300 hover:border-gray-400"}`}
  >
                      <Building2 className="h-5 w-5 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm font-semibold text-gray-900">
                        Doanh nghiệp
                      </p>
                    </button>
                  </div>
                </div>

                {
    /* Name / Company Name */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formData.type === "enterprise" ? "T\xEAn C\xF4ng Ty" : "H\u1ECD v\xE0 T\xEAn"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
    type="text"
    placeholder={formData.type === "enterprise" ? "C\xF4ng ty TNHH ABC" : "Nguy\u1EC5n V\u0103n An"}
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full border-gray-300 rounded-lg"
  />
                </div>

                {
    /* Email */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
    type="email"
    placeholder="example@email.com"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    className="w-full border-gray-300 rounded-lg"
  />
                </div>

                {
    /* Phone */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số Điện Thoại <span className="text-red-500">*</span>
                  </label>
                  <Input
    type="tel"
    placeholder="0901234567"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    className="w-full border-gray-300 rounded-lg"
  />
                </div>

                {
    /* Address */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa Chỉ
                  </label>
                  <textarea
    placeholder="Nhập địa chỉ chi tiết..."
    value={formData.address}
    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
    rows={3}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
  />
                </div>
              </div>

              {
    /* Action Buttons */
  }
              <div className="flex gap-3 mt-8">
                <Button
    onClick={() => setShowAddModal(false)}
    variant="outline"
    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
  >
                  Hủy
                </Button>
                <Button
    onClick={handleSaveCustomer}
    className="flex-1 bg-[#B71C1C] hover:bg-[#8B1538] text-white font-semibold py-3"
    disabled={!formData.name || !formData.email || !formData.phone}
  >
                  Thêm Khách Hàng
                </Button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
}
export {
  CustomerManagement
};

