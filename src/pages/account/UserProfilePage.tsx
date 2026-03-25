import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import useAuth from "@/hooks/useAuth";
import useCatalog from "@/hooks/useCatalog";
import {
  User,
  Edit3,
  Package,
  MapPin,
  Lock,
  LogOut,
  Gift,
  Trash2,
  Eye,
  Edit,
  X,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner@2.0.3";
import type { GiftBoxResponse } from "@/services/giftBoxService";
import useCart from "@/hooks/useCart";
import { resolveImageUrl } from "@/utils/imageUrl";

interface UserProfileProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

interface BasketItemViewModel {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface BasketViewModel {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  total: number;
  image: string;
  items: BasketItemViewModel[];
}

export function UserProfile({ onNavigate, onLogout }: UserProfileProps) {
  const { user, logout, fetchProfile } = useAuth();
  const { fetchUserGiftBoxes: loadUserGiftBoxes } = useCatalog();
  const profile = useSelector((state: RootState) => state.auth.profile);
  const { addItem } = useCart();

  const [activeSection, setActiveSection] = useState(() => {
    const saved = sessionStorage.getItem("profileSection");
    if (saved) {
      sessionStorage.removeItem("profileSection");
      return saved;
    }
    return "account";
  });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBasket, setSelectedBasket] = useState<BasketViewModel | null>(
    null,
  );
  const [giftBoxes, setGiftBoxes] = useState<GiftBoxResponse[]>([]);
  const [isLoadingGiftBoxes, setIsLoadingGiftBoxes] = useState(false);
  const giftBoxService = {
    getUserGiftBox: async () => ({
      data: {
        success: true,
        data: await loadUserGiftBoxes(),
      },
    }),
  };

  useEffect(() => {
    if (!user?.email) {
      setFullName("");
      setEmail("");
      setPhone("");
      return;
    }

    fetchProfile();
  }, [user?.email]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName ?? "");
      setEmail(profile.email ?? "");
      setPhone(profile.phone ?? "");
    } else if (user) {
      setFullName(user.fullName ?? "");
      setEmail(user.email ?? "");
    }
  }, [profile, user]);

  // Fetch user's gift boxes when giftbaskets section is active
  useEffect(() => {
    if (!user?.id) {
      setGiftBoxes([]);
      return;
    }

    if (activeSection === "giftbaskets") {
      fetchUserGiftBoxes();
    }
  }, [activeSection, user?.id]);

  const fetchUserGiftBoxes = async () => {
    try {
      setIsLoadingGiftBoxes(true);
      const response = await giftBoxService.getUserGiftBox();
      if (response.data.success) {
        setGiftBoxes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching gift boxes:", error);
      toast.error("Không thể tải giỏ quà của bạn");
    } finally {
      setIsLoadingGiftBoxes(false);
    }
  };

  // Map API data to UI format
  const mapGiftBoxToBasket = (giftBox: GiftBoxResponse): BasketViewModel => {
    const total = giftBox.boxComponents?.reduce((sum, component) => {
      return sum + (component.productPrice * component.quantity);
    }, 0) || giftBox.basePrice;

    const items = giftBox.boxComponents?.map(component => ({
      name: component.productName || "",
      price: component.productPrice,
      quantity: component.quantity,
      image: ""
    })) || [];

    const fullImageUrl =
      resolveImageUrl(giftBox.images?.[0]?.url) ||
      "https://images.unsplash.com/photo-1644890587862-e309716adbca?w=1080";

    return {
      id: giftBox.id,
      name: giftBox.name,
      description:
        giftBox.description?.trim() || "Chưa có mô tả cho giỏ quà này.",
      createdDate: new Date(giftBox.createdAt).toLocaleDateString('vi-VN'),
      total: total,
      image: fullImageUrl,
      items: items
    };
  };

  const savedGiftBaskets = giftBoxes.map(mapGiftBoxToBasket);

  const formatPrice = (price: number) => {
    if (!price || typeof price !== 'number') {
      return '0 VNĐ';
    }
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const handleSaveChanges = () => {
    // Save changes logic
    toast.success("Thông tin đã được cp nhật thành công!");
  };

  const handleLogout = async () => {
    onNavigate?.("home");
    await logout();
    onLogout?.();
  };

  const handleDeleteGiftBasket = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa giỏ quà này?")) {
      alert(`Đã xóa giỏ quà ${id}`);
    }
  };

  const handleViewGiftBasket = (id: string) => {
    const basket = savedGiftBaskets.find(b => b.id === id);
    if (basket) {
      setSelectedBasket(basket);
      setIsViewDialogOpen(true);
    }
  };

  const handleEditGiftBasket = (id: string) => {
    onNavigate?.("custom-builder");
  };

  const handleAddToCart = async (id: string) => {
    const basket = savedGiftBaskets.find(b => b.id === id);
    if (!basket) return;

    try {
      const result = await addItem({
        giftBoxId: id,
        quantity: 1
      });

      if ((result as any)?.error == null) {
        toast.success(`Đã thêm "${basket.name}" vào giỏ hàng`, {
          duration: 3000,
        });
      } else {
        toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12">
      {/* Toast Container */}
      <Toaster 
        position="top-right"
        richColors
        expand={false}
        closeButton
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation */}
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
                    {user?.fullName || user?.username || "Khách"}
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
                  onClick={() => setActiveSection("account")}
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
                  onClick={() => {
                    setActiveSection("orders");
                    onNavigate?.("order-history");
                  }}
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
                  className="hidden"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Sổ địa chỉ</span>
                </button>

                <button
                  onClick={() => setActiveSection("giftbaskets")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === "giftbaskets"
                      ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Gift className="w-5 h-5" />
                  <span>Giỏ quà của bạn</span>
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

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Account Information Section */}
              {activeSection === "account" && (
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <h1
                      className="text-3xl font-bold text-gray-900 mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Hồ sơ của tôi
                    </h1>
                    <p className="text-gray-600">
                      Quản lý thông tin hồ sơ để bảo mật tài khoản
                    </p>
                    <div className="mt-4 border-b border-gray-200"></div>
                  </div>

                  <div className="space-y-6">
                    {/* Username - Disabled */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tên đăng nhập
                      </label>
                      <Input
                        type="text"
                        value={profile?.username ?? user?.username ?? ""}
                        disabled
                        className="bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                      />
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="border-gray-300 focus:border-[#B71C1C] focus:ring-[#B71C1C]"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-gray-300 focus:border-[#B71C1C] focus:ring-[#B71C1C]"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border-gray-300 focus:border-[#B71C1C] focus:ring-[#B71C1C]"
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleSaveChanges}
                      className="bg-[#D4AF37] hover:bg-[#B8962E] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all text-lg"
                    >
                      Lưu Thay Đổi
                    </Button>
                  </div>
                </>
              )}

              {/* Gift Baskets Section */}
              {activeSection === "giftbaskets" && (
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <h1
                      className="text-3xl font-bold text-gray-900 mb-2"
                      style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
                    >
                      Giỏ Quà Của Bạn
                    </h1>
                    <p className="text-gray-600">
                      Quản lý các giỏ quà mà bạn đã thiết kế
                    </p>
                    <div className="mt-4 border-b border-gray-200"></div>
                  </div>

                  {/* Create New Button */}
                  <div className="mb-6">
                    <Button
                      onClick={() => onNavigate?.("custom-builder")}
                      className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white font-bold py-3 px-6 shadow-lg"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      Thiết kế giỏ quà mới
                    </Button>
                  </div>

                  {/* Gift Baskets Grid */}
                  {isLoadingGiftBoxes ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <Gift className="w-12 h-12 text-gray-400 animate-pulse" />
                      </div>
                      <p className="text-gray-600">Đang tải giỏ quà của bạn...</p>
                    </div>
                  ) : savedGiftBaskets.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <Gift className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Chưa có giỏ quà nào
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Bắt đầu thiết kế giỏ quà độc bản của riêng bạn
                      </p>
                      <Button
                        onClick={() => onNavigate?.("custom-builder")}
                        className="bg-[#D4AF37] hover:bg-[#B8962E] text-white font-bold"
                      >
                        Thiết kế ngay
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedGiftBaskets.map((basket) => (
                        <div
                          key={basket.id}
                          className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300"
                        >
                          {/* Image */}
                          <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                            <img
                              src={basket.image}
                              alt={basket.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            {/* Title and Date */}
                            <div className="mb-3">
                              <h3
                                className="text-xl font-bold text-gray-900 mb-1"
                                style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
                              >
                                {basket.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Ngày tạo: {basket.createdDate}
                              </p>
                            </div>

                            {/* Items */}
                            <div className="mb-4">
                              <p className="text-sm font-semibold text-gray-700 mb-2">
                                Sản phẩm:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {basket.items.map((item, index) => (
                                  <Badge
                                    key={index}
                                    className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-100 border-0"
                                  >
                                    {item.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="mb-4 pb-4 border-b border-gray-200">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">
                                  Tổng giá trị:
                                </span>
                                <span className="text-xl font-bold text-[#D4AF37]">
                                  {formatPrice(basket.total)}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleViewGiftBasket(basket.id)}
                                variant="outline"
                                className="flex-1 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Xem
                              </Button>
                              <Button
                                onClick={() => handleAddToCart(basket.id)}
                                className="flex-1 bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white font-semibold transition-all"
                              >
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Thêm giỏ hàng
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Address Section */}
              {false && activeSection === "addresses" && (
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <h1
                      className="text-3xl font-bold text-gray-900 mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Sổ địa chỉ
                    </h1>
                    <p className="text-gray-600">
                      Quản lý địa chỉ giao hàng của bạn
                    </p>
                    <div className="mt-4 border-b border-gray-200"></div>
                  </div>
                  <div className="text-center py-16 text-gray-500">
                    Chức năng đang được phát triển
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Gift Basket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-7xl max-h-[90vh] overflow-y-auto w-full p-0 gap-0">
          {/* Decorative Header with Tet Theme */}
          <div className="relative bg-gradient-to-r from-[#B71C1C] via-[#D32F2F] to-[#B71C1C] px-8 py-6">
            {/* Gold accent line top */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
              <div className="absolute top-2 left-10 w-16 h-16 rounded-full border-4 border-[#D4AF37]"></div>
              <div className="absolute bottom-2 right-10 w-12 h-12 rounded-full border-4 border-[#D4AF37]"></div>
              <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full border-4 border-[#D4AF37]"></div>
            </div>

            <DialogHeader className="relative z-10">
              <DialogTitle 
                className="text-3xl font-bold text-[#FFFDF5] text-center mb-2"
                style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
              >
                Chi Tiết Giỏ Quà
              </DialogTitle>
              <DialogDescription className="text-center text-[#FFFDF5]/90 text-base">
                Xem thông tin chi tiết về giỏ quà của bạn
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Main Content */}
          {selectedBasket && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-[#FFFDF5]">
              {/* Left Column - Image */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden bg-white rounded-2xl shadow-xl border-4 border-[#D4AF37]/30">
                  {/* Decorative corner accents */}
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
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                    <p className="text-sm font-medium">
                      Ngày tạo: {selectedBasket.createdDate}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-[#D4AF37]/20 pt-4">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#B71C1C]/80">
                      Mô tả
                    </p>
                    <p className="text-base leading-7 text-gray-700">
                      {selectedBasket.description}
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
                          {/* Gold corner accent */}
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

                {/* Total Price - Tet Style */}
                <div className="relative bg-gradient-to-br from-[#B71C1C] via-[#D32F2F] to-[#B71C1C] p-8 rounded-2xl shadow-2xl border-4 border-[#D4AF37] overflow-hidden">
                  {/* Decorative pattern */}
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

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <Button
                    onClick={() => setIsViewDialogOpen(false)}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 py-6 text-base font-bold rounded-xl transition-all"
                  >
                    Đóng
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleAddToCart(selectedBasket.id);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#B71C1C] via-[#D32F2F] to-[#B71C1C] hover:from-[#8B1538] hover:via-[#B71C1C] hover:to-[#8B1538] text-white font-bold py-6 text-base rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-[#D4AF37]"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Thêm vào giỏ hàng
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

