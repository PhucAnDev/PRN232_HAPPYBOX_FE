import { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  User,
  Crown,
  ShoppingBag,
  Gift,
  Package,
  Calendar,
  DollarSign,
  Filter,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface GiftBasket {
  id: string;
  name: string;
  createdDate: string;
  total: number;
  image: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  type: "individual" | "enterprise";
  isVip: boolean;
  totalGiftBaskets: number;
  totalValue: number;
  avatar: string;
  giftBaskets: GiftBasket[];
}

export function CustomGiftManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBasket, setSelectedBasket] = useState<GiftBasket | null>(null);

  // Mock data - Danh sách khách hàng với giỏ quà thiết kế
  const customers: Customer[] = [
    {
      id: "1",
      userId: "CST-2026-001",
      name: "Nguyễn Văn An",
      email: "nguyenvanan@gmail.com",
      phone: "0901234567",
      type: "individual",
      isVip: true,
      totalGiftBaskets: 3,
      totalValue: 6600000,
      avatar: "NVA",
      giftBaskets: [
        {
          id: "gb-1",
          name: "Giỏ Quà Tết Sang Trọng",
          createdDate: "10/03/2026",
          total: 2300000,
          image: "https://images.unsplash.com/photo-1644890587862-e309716adbca?w=400&h=400&fit=crop",
          items: [
            { 
              name: "Hộp Gỗ Sơn Mài", 
              price: 450000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=200&h=200&fit=crop"
            },
            { 
              name: "Rượu Vang Đỏ Cabernet", 
              price: 850000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop"
            },
            { 
              name: "Hạt Macca Úc", 
              price: 320000, 
              quantity: 2,
              image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200&h=200&fit=crop"
            },
            { 
              name: "Tr�� Oolong Cao Cấp", 
              price: 360000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop"
            }
          ]
        },
        {
          id: "gb-2",
          name: "Giỏ Quà Sức Khỏe",
          createdDate: "08/03/2026",
          total: 1100000,
          image: "https://images.unsplash.com/photo-1648663938947-405f9a14ede9?w=400&h=400&fit=crop",
          items: [
            { 
              name: "Giỏ Mây Tre Đan", 
              price: 280000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=200&h=200&fit=crop"
            },
            { 
              name: "Mật Ong Rừng Organic", 
              price: 420000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1587049352846-4a222e784587?w=200&h=200&fit=crop"
            },
            { 
              name: "Trà Sen Hồ Tây", 
              price: 250000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop"
            },
            { 
              name: "Hạt Điều Rang", 
              price: 150000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200&h=200&fit=crop"
            }
          ]
        },
        {
          id: "gb-3",
          name: "Giỏ Quà Premium Deluxe",
          createdDate: "05/03/2026",
          total: 3200000,
          image: "https://images.unsplash.com/photo-1740733543221-ce35af9307fc?w=400&h=400&fit=crop",
          items: [
            { 
              name: "Hộp Kim Loại Vàng Đồng", 
              price: 550000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=200&h=200&fit=crop"
            },
            { 
              name: "Rượu Vang Trắng Chardonnay", 
              price: 920000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop"
            },
            { 
              name: "Socola Lindt", 
              price: 380000, 
              quantity: 2,
              image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&h=200&fit=crop"
            },
            { 
              name: "Trà Oolong", 
              price: 340000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop"
            },
            { 
              name: "Hạt Macca", 
              price: 630000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200&h=200&fit=crop"
            }
          ]
        }
      ]
    },
    {
      id: "2",
      userId: "CST-2026-015",
      name: "Công ty TNHH ABC",
      email: "contact@abc.vn",
      phone: "0282345678",
      type: "enterprise",
      isVip: true,
      totalGiftBaskets: 5,
      totalValue: 15000000,
      avatar: "ABC",
      giftBaskets: [
        {
          id: "gb-4",
          name: "Giỏ Quà Doanh Nghiệp Deluxe",
          createdDate: "12/03/2026",
          total: 4500000,
          image: "https://images.unsplash.com/photo-1644890587862-e309716adbca?w=400&h=400&fit=crop",
          items: [
            { 
              name: "Hộp Gỗ Cao Cấp", 
              price: 800000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=200&h=200&fit=crop"
            },
            { 
              name: "Rượu Vang Pháp", 
              price: 1500000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop"
            },
            { 
              name: "Socola Godiva", 
              price: 600000, 
              quantity: 2,
              image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&h=200&fit=crop"
            },
            { 
              name: "Trà Oolong Đài Loan", 
              price: 500000, 
              quantity: 2,
              image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop"
            }
          ]
        },
        {
          id: "gb-5",
          name: "Giỏ Quà Premium 2026",
          createdDate: "11/03/2026",
          total: 3800000,
          image: "https://images.unsplash.com/photo-1648663938947-405f9a14ede9?w=400&h=400&fit=crop",
          items: [
            { 
              name: "Hộp Vàng Đồng", 
              price: 650000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=200&h=200&fit=crop"
            },
            { 
              name: "Rượu Vang Chile", 
              price: 1200000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop"
            },
            { 
              name: "Hạt Điều Cao Cấp", 
              price: 450000, 
              quantity: 2,
              image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200&h=200&fit=crop"
            },
            { 
              name: "Cafe Arabica", 
              price: 550000, 
              quantity: 2,
              image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop"
            }
          ]
        }
      ]
    },
    {
      id: "3",
      userId: "CST-2026-022",
      name: "Trần Thị Mai",
      email: "tranmai@gmail.com",
      phone: "0909876543",
      type: "individual",
      isVip: false,
      totalGiftBaskets: 2,
      totalValue: 3500000,
      avatar: "TTM",
      giftBaskets: [
        {
          id: "gb-6",
          name: "Giỏ Quà Gia Đình",
          createdDate: "09/03/2026",
          total: 1800000,
          image: "https://images.unsplash.com/photo-1740733543221-ce35af9307fc?w=400&h=400&fit=crop",
          items: [
            { 
              name: "Giỏ Tre Đan", 
              price: 280000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=200&h=200&fit=crop"
            },
            { 
              name: "Rượu Vang Đà Lạt", 
              price: 600000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop"
            },
            { 
              name: "Bánh Kẹo Hỗn Hợp", 
              price: 350000, 
              quantity: 2,
              image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&h=200&fit=crop"
            },
            { 
              name: "Trà Lài", 
              price: 220000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop"
            }
          ]
        },
        {
          id: "gb-7",
          name: "Giỏ Quà Tết 2026",
          createdDate: "07/03/2026",
          total: 1700000,
          image: "https://images.unsplash.com/photo-1644890587862-e309716adbca?w=400&h=400&fit=crop",
          items: [
            { 
              name: "Hộp Gỗ Nhỏ", 
              price: 350000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=200&h=200&fit=crop"
            },
            { 
              name: "Mật Ong Rừng", 
              price: 400000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1587049352846-4a222e784587?w=200&h=200&fit=crop"
            },
            { 
              name: "Hạt Sen", 
              price: 280000, 
              quantity: 2,
              image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200&h=200&fit=crop"
            },
            { 
              name: "Trà Ô Long", 
              price: 390000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop"
            }
          ]
        }
      ]
    },
    {
      id: "4",
      userId: "CST-2026-035",
      name: "Lê Hoàng Nam",
      email: "hoangnam@gmail.com",
      phone: "0912345678",
      type: "individual",
      isVip: true,
      totalGiftBaskets: 4,
      totalValue: 8200000,
      avatar: "LHN",
      giftBaskets: [
        {
          id: "gb-8",
          name: "Giỏ Quà VIP",
          createdDate: "13/03/2026",
          total: 2800000,
          image: "https://images.unsplash.com/photo-1648663938947-405f9a14ede9?w=400&h=400&fit=crop",
          items: [
            { 
              name: "Hộp Vàng", 
              price: 600000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=200&h=200&fit=crop"
            },
            { 
              name: "Rượu Vang Ý", 
              price: 1100000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop"
            },
            { 
              name: "Socola Ferrero", 
              price: 420000, 
              quantity: 2,
              image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&h=200&fit=crop"
            },
            { 
              name: "Cafe Kopi Luwak", 
              price: 880000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop"
            }
          ]
        }
      ]
    },
    {
      id: "5",
      userId: "CST-2026-048",
      name: "Công ty CP XYZ",
      email: "info@xyz.com.vn",
      phone: "0287654321",
      type: "enterprise",
      isVip: true,
      totalGiftBaskets: 8,
      totalValue: 28000000,
      avatar: "XYZ",
      giftBaskets: [
        {
          id: "gb-9",
          name: "Giỏ Quà Tết Enterprise",
          createdDate: "14/03/2026",
          total: 5200000,
          image: "https://images.unsplash.com/photo-1740733543221-ce35af9307fc?w=400&h=400&fit=crop",
          items: [
            { 
              name: "Hộp Gỗ Hương", 
              price: 950000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=200&h=200&fit=crop"
            },
            { 
              name: "Rượu Vang Pháp Bordeaux", 
              price: 2100000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop"
            },
            { 
              name: "Socola Belgia", 
              price: 680000, 
              quantity: 2,
              image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&h=200&fit=crop"
            },
            { 
              name: "Trà Pu Erh Cổ Thụ", 
              price: 790000, 
              quantity: 1,
              image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop"
            }
          ]
        }
      ]
    }
  ];

  const formatPrice = (price: number) => {
    if (!price || typeof price !== "number") {
      return "0 VNĐ";
    }
    return price.toLocaleString("vi-VN") + " VNĐ";
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.userId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "individual" && customer.type === "individual") ||
      (typeFilter === "enterprise" && customer.type === "enterprise");

    return matchesSearch && matchesType;
  });

  const handleViewBasket = (basket: GiftBasket) => {
    setSelectedBasket(basket);
    setIsViewDialogOpen(true);
  };

  const handleDeleteBasket = (basketId: string) => {
    if (confirm("Bạn có chắc muốn xóa giỏ quà này?")) {
      // Delete logic here
      alert(`Đã xóa giỏ quà ${basketId}`);
    }
  };

  // Auto-select first customer on load
  if (!selectedCustomer && filteredCustomers.length > 0) {
    setSelectedCustomer(filteredCustomers[0]);
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold text-gray-900 mb-1"
              style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
            >
              Sản Phẩm Thiết Kế
            </h1>
            <p className="text-sm text-gray-500">
              Quản lý các giỏ quà do khách hàng tự thiết kế
            </p>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-3">
            <div className="bg-white border-2 border-[#B71C1C] px-5 py-3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#B71C1C] flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Tổng Giỏ Quà</p>
                  <p className="text-xl font-bold text-[#B71C1C]">
                    {customers.reduce((sum, c) => sum + c.totalGiftBaskets, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#D4AF37] px-5 py-3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Tổng Giá Trị</p>
                  <p className="text-xl font-bold text-[#D4AF37]">
                    {(customers.reduce((sum, c) => sum + c.totalValue, 0) / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Customer List */}
        <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B71C1C]/20 focus:border-[#B71C1C]"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => setTypeFilter("all")}
                variant={typeFilter === "all" ? "default" : "outline"}
                size="sm"
                className={
                  typeFilter === "all"
                    ? "bg-[#B71C1C] hover:bg-[#9A1919] text-white text-xs"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
                }
              >
                Tất cả
              </Button>
              <Button
                onClick={() => setTypeFilter("individual")}
                variant={typeFilter === "individual" ? "default" : "outline"}
                size="sm"
                className={
                  typeFilter === "individual"
                    ? "bg-[#B71C1C] hover:bg-[#9A1919] text-white text-xs"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
                }
              >
                <User className="w-3 h-3 mr-1" />
                Cá nhân
              </Button>
              <Button
                onClick={() => setTypeFilter("enterprise")}
                variant={typeFilter === "enterprise" ? "default" : "outline"}
                size="sm"
                className={
                  typeFilter === "enterprise"
                    ? "bg-[#B71C1C] hover:bg-[#9A1919] text-white text-xs"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
                }
              >
                <ShoppingBag className="w-3 h-3 mr-1" />
                Doanh nghiệp
              </Button>
            </div>
          </div>

          {/* Customer List */}
          <div className="flex-1 overflow-y-auto">
            {filteredCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <User className="w-16 h-16 mb-3" />
                <p className="text-sm">Không tìm thấy khách hàng</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedCustomer?.id === customer.id
                        ? "bg-red-50/50 border-l-4 border-[#B71C1C]"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                          customer.type === "enterprise"
                            ? "bg-[#D4AF37]"
                            : "bg-[#B71C1C]"
                        }`}
                      >
                        {customer.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">
                            {customer.name}
                          </h3>
                          {customer.isVip && (
                            <Crown className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-1.5">{customer.userId}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Gift className="w-3 h-3" />
                            {customer.totalGiftBaskets} giỏ
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {(customer.totalValue / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>

                      {/* Type Badge */}
                      <Badge
                        className={`text-xs h-5 ${
                          customer.type === "enterprise"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {customer.type === "enterprise" ? "DN" : "CN"}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Gift Baskets */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedCustomer ? (
            <>
              {/* Customer Info Header */}
              <div className="bg-[#B71C1C] text-white px-8 py-5 border-b-4 border-[#D4AF37]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                        selectedCustomer.type === "enterprise"
                          ? "bg-[#D4AF37]"
                          : "bg-white/20"
                      }`}
                    >
                      {selectedCustomer.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                        {selectedCustomer.isVip && (
                          <Crown className="w-5 h-5 text-[#D4AF37]" />
                        )}
                      </div>
                      <p className="text-white/90 text-sm">{selectedCustomer.email}</p>
                      <p className="text-white/80 text-xs">{selectedCustomer.phone}</p>
                    </div>
                  </div>

                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-white/70 text-xs mb-1">Tổng Giỏ Quà</p>
                      <p className="text-2xl font-bold">{selectedCustomer.totalGiftBaskets}</p>
                    </div>
                    <div className="w-px bg-white/20"></div>
                    <div className="text-center">
                      <p className="text-white/70 text-xs mb-1">Tổng Giá Trị</p>
                      <p className="text-2xl font-bold text-[#D4AF37]">
                        {formatPrice(selectedCustomer.totalValue)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gift Baskets Grid */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
                {selectedCustomer.giftBaskets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Gift className="w-20 h-20 mb-4" />
                    <p className="text-base font-semibold">Chưa có giỏ quà thiết kế</p>
                    <p className="text-sm">Khách hàng chưa tạo giỏ quà nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {selectedCustomer.giftBaskets.map((basket) => (
                      <div
                        key={basket.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
                      >
                        {/* Image */}
                        <div className="aspect-square overflow-hidden bg-gray-100 relative">
                          <img
                            src={basket.image}
                            alt={basket.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {/* Title */}
                          <h3
                            className="text-base font-bold text-gray-900 mb-1 line-clamp-1"
                            style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
                          >
                            {basket.name}
                          </h3>

                          {/* Date */}
                          <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                            <Calendar className="w-3 h-3" />
                            {basket.createdDate}
                          </p>

                          {/* Items Count */}
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                            <Package className="w-4 h-4" />
                            <span>{basket.items.length} sản phẩm</span>
                          </div>

                          {/* Price */}
                          <div className="mb-3 pb-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                Tổng giá trị:
                              </span>
                              <span className="text-lg font-bold text-[#D4AF37]">
                                {formatPrice(basket.total)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleViewBasket(basket)}
                              variant="outline"
                              size="sm"
                              className="flex-1 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all h-8 text-xs"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Xem
                            </Button>
                            <Button
                              onClick={() => handleDeleteBasket(basket.id)}
                              variant="outline"
                              size="sm"
                              className="border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all h-8"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <User className="w-20 h-20 mb-4" />
              <p className="text-base font-semibold">Chọn khách hàng</p>
              <p className="text-sm">Chọn khách hàng từ danh sách bên trái để xem giỏ quà</p>
            </div>
          )}
        </div>
      </div>

      {/* View Gift Basket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-7xl max-h-[90vh] overflow-y-auto w-full p-0 gap-0">
          {/* Decorative Header */}
          <div className="relative bg-gradient-to-r from-[#B71C1C] via-[#D32F2F] to-[#B71C1C] px-8 py-6">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            
            <DialogHeader className="relative z-10">
              <DialogTitle 
                className="text-3xl font-bold text-[#FFFDF5] text-center mb-2"
                style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
              >
                Chi Tiết Giỏ Quà
              </DialogTitle>
              <DialogDescription className="text-center text-[#FFFDF5]/90 text-base">
                Thông tin chi tiết về giỏ quà thiết kế
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Main Content */}
          {selectedBasket && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-[#FFFDF5]">
              {/* Left Column - Image */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden bg-white rounded-2xl shadow-xl border-4 border-[#D4AF37]/30">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#D4AF37] rounded-tl-2xl z-10"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#D4AF37] rounded-tr-2xl z-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#D4AF37] rounded-bl-2xl z-10"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#D4AF37] rounded-br-2xl z-10"></div>
                  
                  <img
                    src={selectedBasket.image}
                    alt={selectedBasket.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Title and Date */}
                <div className="bg-gradient-to-r from-white to-[#FFF9E6] p-6 rounded-xl border-2 border-[#D4AF37]/30 shadow-md">
                  <h3
                    className="text-3xl font-bold text-[#B71C1C] mb-3"
                    style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
                  >
                    {selectedBasket.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <p className="text-sm font-medium">
                      Ngày tạo: {selectedBasket.createdDate}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-xl border-2 border-[#D4AF37]/30 shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] px-6 py-4">
                    <p className="font-bold text-white text-lg flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      Sản phẩm trong giỏ
                    </p>
                  </div>
                  <div className="p-4 space-y-3 max-h-80 overflow-y-auto bg-gradient-to-b from-white to-[#FFFDF5]">
                    {selectedBasket.items.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 bg-white p-4 rounded-xl border-2 border-gray-100 hover:border-[#D4AF37] hover:shadow-lg transition-all group"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border-2 border-[#D4AF37]/40 flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-t-[#D4AF37] border-l-[20px] border-l-transparent"></div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 mb-1.5 text-base">{item.name}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-0.5 bg-red-50 text-[#B71C1C] font-bold rounded">
                              {formatPrice(item.price)}
                            </span>
                            <span className="text-gray-400">×</span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-bold rounded">
                              {item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-xl text-[#D4AF37] drop-shadow-sm">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Price */}
                <div className="relative bg-gradient-to-br from-[#B71C1C] via-[#D32F2F] to-[#B71C1C] p-8 rounded-2xl shadow-2xl border-4 border-[#D4AF37] overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#D4AF37] rounded-full translate-y-12 -translate-x-12"></div>
                  </div>

                  <div className="relative z-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold text-white/90 tracking-wide">
                        TỔNG GIÁ TRỊ
                      </span>
                      <div className="w-16 h-1 bg-[#D4AF37] rounded"></div>
                    </div>
                    <div 
                      className="text-5xl font-bold text-[#D4AF37] drop-shadow-2xl text-right"
                      style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif", textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                    >
                      {formatPrice(selectedBasket.total)}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Button
                    onClick={() => setIsViewDialogOpen(false)}
                    className="w-full bg-gradient-to-r from-[#B71C1C] via-[#D32F2F] to-[#B71C1C] hover:from-[#8B1538] hover:via-[#B71C1C] hover:to-[#8B1538] text-white font-bold py-6 text-base rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-[#D4AF37]"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}