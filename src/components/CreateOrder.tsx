import { useState, useEffect } from "react";
import voucherService, { VoucherResponse } from "../services/voucherService";
import productService, { ProductResponse } from "../services/productService";
import giftBoxService, { GiftBoxResponse } from "../services/giftBoxService";
import imageService from "../services/imageService";
import orderService from "../services/orderService";
import useAuth from "../hooks/useAuth";
import {
  ArrowLeft,
  Plus,
  X,
  Search,
  Package,
  Gift,
  Trash2,
  ShoppingCart,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Tag,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface OrderDetail {
  productId: string | null;
  giftBoxId: string | null;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

interface CreateOrderProps {
  onBack: () => void;
}

export function CreateOrder({ onBack }: CreateOrderProps) {
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online">("COD");
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingEmail, setShippingEmail] = useState("");
  // Vietnam address API state
  const [provinces, setProvinces] = useState<{ code: number; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ code: number; name: string }[]>([]);
  const [wards, setWards] = useState<{ code: number; name: string }[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<{ code: number; name: string } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{ code: number; name: string } | null>(null);
  const [selectedWard, setSelectedWard] = useState<{ code: number; name: string } | null>(null);
  const province = selectedProvince?.name ?? "";
  const district = selectedDistrict?.name ?? "";
  const ward = selectedWard?.name ?? "";
  const [street, setStreet] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [note, setNote] = useState("");
  const [voucherId, setVoucherId] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherResponse | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [apiVouchers, setApiVouchers] = useState<VoucherResponse[]>([]);
  const [vouchersLoading, setVouchersLoading] = useState(false);
  const [voucherModalSearch, setVoucherModalSearch] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [quantityInputs, setQuantityInputs] = useState<Record<number, string>>({});
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"product" | "giftbox">("product");
  const [apiProducts, setApiProducts] = useState<ProductResponse[]>([]);
  const [apiGiftBoxes, setApiGiftBoxes] = useState<GiftBoxResponse[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [productImageMap, setProductImageMap] = useState<Record<string, string>>({});
  const [productPage, setProductPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const ITEMS_PER_PAGE = 4;

  // Load tất cả tỉnh/thành phố khi mount
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((r) => r.json())
      .then((data) => setProvinces(data))
      .catch(() => setProvinces([]));
  }, []);

  // Load vouchers từ API
  useEffect(() => {
    setVouchersLoading(true);
    voucherService.getAllVouchers()
      .then(setApiVouchers)
      .catch(() => setApiVouchers([]))
      .finally(() => setVouchersLoading(false));
  }, []);

  // Khi chọn tỉnh → load quận/huyện
  const handleProvinceChange = async (code: string) => {
    const prov = provinces.find((p) => String(p.code) === code) || null;
    setSelectedProvince(prov);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    if (!prov) return;
    setAddressLoading(true);
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${prov.code}?depth=2`);
      const data = await res.json();
      setDistricts(data.districts || []);
    } catch { setDistricts([]); }
    finally { setAddressLoading(false); }
  };

  // Khi chọn quận/huyện → load phường/xã
  const handleDistrictChange = async (code: string) => {
    const dist = districts.find((d) => String(d.code) === code) || null;
    setSelectedDistrict(dist);
    setSelectedWard(null);
    setWards([]);
    if (!dist) return;
    setAddressLoading(true);
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${dist.code}?depth=2`);
      const data = await res.json();
      setWards(data.wards || []);
    } catch { setWards([]); }
    finally { setAddressLoading(false); }
  };



  // Fetch products + giftboxes khi mở modal
  useEffect(() => {
    if (!showProductSearch) return;
    setItemsLoading(true);
    Promise.all([
      productService.getAll().then(r => r.data.data).catch(() => [] as ProductResponse[]),
      giftBoxService.getAll().then(r => r.data.data).catch(() => [] as GiftBoxResponse[]),
    ]).then(async ([products, giftBoxes]) => {
      const activeProducts = products.filter(p => p.isActive);
      setApiProducts(activeProducts);
      setApiGiftBoxes(giftBoxes.filter(g => g.isActive));
      // Fetch images for all products in parallel
      const imageEntries = await Promise.all(
        activeProducts.map(p =>
          imageService.getByProduct(p.id)
            .then(r => {
              const imgs = r.data.success ? r.data.data : [];
              const main = imgs.find(i => i.isMain) ?? imgs[0];
              return [p.id, main?.url ?? ""] as [string, string];
            })
            .catch(() => [p.id, ""] as [string, string])
        )
      );
      setProductImageMap(Object.fromEntries(imageEntries));
    }).finally(() => setItemsLoading(false));
  }, [showProductSearch]);

  const filteredItems = searchType === "product"
    ? apiProducts
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(p => ({ id: p.id, name: p.name, price: p.price, type: "product" as const, image: productImageMap[p.id] ?? "" }))
    : apiGiftBoxes
        .filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(g => ({ id: g.id, name: g.name, price: g.basePrice, type: "giftbox" as const, image: g.images?.find(i => i.isMain)?.url ?? g.images?.[0]?.url ?? "" }));

  const totalProductPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const pagedItems = filteredItems.slice((productPage - 1) * ITEMS_PER_PAGE, productPage * ITEMS_PER_PAGE);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const addOrderDetail = (item: { id: string; name: string; price: number; type: "product" | "giftbox"; image?: string }) => {
    const newDetail: OrderDetail = {
      productId: item.type === "product" ? item.id : null,
      giftBoxId: item.type === "giftbox" ? item.id : null,
      quantity: 1,
      price: item.price,
      name: item.name,
      image: item.image,
    };
    setOrderDetails([...orderDetails, newDetail]);
    setShowProductSearch(false);
    setSearchQuery("");
  };

  const updateQuantity = (index: number, quantity: number) => {
    const updated = [...orderDetails];
    updated[index].quantity = Math.max(1, quantity);
    setOrderDetails(updated);
  };

  const removeOrderDetail = (index: number) => {
    setOrderDetails(orderDetails.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!appliedVoucher) return 0;

    const total = calculateTotal();
    if (total < appliedVoucher.minOrderValue) return 0;

    if (!appliedVoucher.isPercentage) {
      return appliedVoucher.value;
    } else {
      const percentageDiscount = (total * appliedVoucher.value) / 100;
      return appliedVoucher.maxDiscountAmount !== null
        ? Math.min(percentageDiscount, appliedVoucher.maxDiscountAmount)
        : percentageDiscount;
    }
  };

  const calculateFinalTotal = () => {
    return calculateTotal() - calculateDiscount();
  };

  const applyVoucher = (voucher: VoucherResponse) => {
    if (calculateTotal() >= voucher.minOrderValue) {
      setAppliedVoucher(voucher);
      setVoucherId(voucher.code);
      setShowVoucherModal(false);
      setVoucherModalSearch("");
      toast.success("Voucher đã được áp dụng thành công!", {
        description: `Bạn tiết kiệm ${formatCurrency(
          !voucher.isPercentage
            ? voucher.value
            : Math.min(
                (calculateTotal() * voucher.value) / 100,
                voucher.maxDiscountAmount ?? Infinity
              )
        )} cho đơn hàng này.`,
      });
    } else {
      toast.error("Không đủ điều kiện sử dụng voucher", {
        description: `Đơn hàng cần đạt tối thiểu ${formatCurrency(voucher.minOrderValue)} để sử dụng voucher này.`,
      });
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!shippingName.trim()) {
      toast.error("Thiếu thông tin bắt buộc", {
        description: "Vui lòng nhập họ tên người nhận.",
      });
      return;
    }
    if (!shippingPhone.trim()) {
      toast.error("Thiếu thông tin bắt buộc", {
        description: "Vui lòng nhập số điện thoại người nhận.",
      });
      return;
    }
    if (!province.trim()) {
      toast.error("Thiếu thông tin bắt buộc", {
        description: "Vui lòng chọn Tỉnh/Thành phố.",
      });
      return;
    }
    if (!district.trim()) {
      toast.error("Thiếu thông tin bắt buộc", {
        description: "Vui lòng chọn Quận/Huyện.",
      });
      return;
    }
    if (!ward.trim()) {
      toast.error("Thiếu thông tin bắt buộc", {
        description: "Vui lòng chọn Phường/Xã.",
      });
      return;
    }
    if (!shippingAddress.trim()) {
      toast.error("Thiếu thông tin bắt buộc", {
        description: "Vui lòng nhập địa chỉ giao hàng chi tiết.",
      });
      return;
    }
    if (orderDetails.length === 0) {
      toast.error("Chưa có sản phẩm trong đơn hàng", {
        description: "Vui lòng thêm ít nhất một sản phẩm hoặc giỏ quà vào đơn hàng.",
      });
      return;
    }
    if (!user?.id) {
      toast.error("Lỗi xác thực", {
        description: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
      });
      return;
    }

    const fullAddress = `${shippingAddress}, ${ward}, ${district}, ${province}`;

    const orderData = {
      userId: user.id,
      paymentMethod,
      shippingPhone,
      shippingAddress: fullAddress,
      note: note.trim() || undefined,
      voucherId: appliedVoucher?.id || undefined,
      orderDetails: orderDetails.map(({ name, image, ...detail }) => detail),
    };

    try {
      setSubmitting(true);
      const res = await orderService.create(orderData);
      if (res.data.success) {
        toast.success("Đơn hàng đã được tạo thành công!", {
          description: `Đơn hàng trị giá ${formatCurrency(calculateFinalTotal())} đã được ghi nhận.`,
        });
        setTimeout(() => onBack(), 1500);
      } else {
        toast.error("Tạo đơn hàng thất bại", {
          description: res.data.message || "Vui lòng thử lại.",
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Đã xảy ra lỗi khi tạo đơn hàng.";
      toast.error("Tạo đơn hàng thất bại", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#B71C1C] transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">Quay lại</span>
        </button>
        <h1
          className="text-3xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Tạo Đơn Hàng Mới
        </h1>
        <p className="text-gray-600">
          Nhập thông tin để tạo đơn hàng cho khách hàng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#B71C1C]" />
              Thông Tin Giao Hàng
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ Tên <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số Điện Thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="0901234567"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Định dạng: 10 số, bắt đầu bằng 0
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email (Tùy chọn)
                </label>
                <Input
                  type="email"
                  placeholder="nguyenvana@example.com"
                  value={shippingEmail}
                  onChange={(e) => setShippingEmail(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tỉnh / Thành Phố <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProvince ? String(selectedProvince.code) : ""}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                >
                  <option value="">{provinces.length === 0 ? "Đang tải..." : "Chọn tỉnh/thành phố"}</option>
                  {provinces.map((prov) => (
                    <option key={prov.code} value={String(prov.code)}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quận / Huyện <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDistrict ? String(selectedDistrict.code) : ""}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={!selectedProvince || addressLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent disabled:opacity-50"
                >
                  <option value="">{addressLoading ? "Đang tải..." : !selectedProvince ? "Chọn tỉnh/thành phố trước" : "Chọn quận/huyện"}</option>
                  {districts.map((dist) => (
                    <option key={dist.code} value={String(dist.code)}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phường / Xã <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedWard ? String(selectedWard.code) : ""}
                  onChange={(e) => {
                    const w = wards.find((w) => String(w.code) === e.target.value) || null;
                    setSelectedWard(w);
                  }}
                  disabled={!selectedDistrict || addressLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent disabled:opacity-50"
                >
                  <option value="">{addressLoading ? "Đang tải..." : !selectedDistrict ? "Chọn quận/huyện trước" : "Chọn phường/xã"}</option>
                  {wards.map((w) => (
                    <option key={w.code} value={String(w.code)}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa Chỉ Giao Hàng <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#B71C1C]" />
              Thanh Toán & Voucher
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phương Thức Thanh Toán <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "COD"
                        ? "border-[#B71C1C] bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Package className="h-5 w-5" />
                      <span className="font-semibold">COD</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Thanh toán khi nhận hàng
                    </p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("Online")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "Online"
                        ? "border-[#B71C1C] bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <span className="font-semibold">Online</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Chuyển khoản / Ví điện tử
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã Voucher (Tùy chọn)
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="abc123..."
                    value={voucherId}
                    onChange={(e) => setVoucherId(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Để trống nếu không sử dụng voucher
                </p>
                <button
                  onClick={() => setShowVoucherModal(true)}
                  className="text-sm  text-[#B71C1C] hover:underline"
                >
                  Xem các voucher có sẵn
                </button>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#B71C1C]" />
              Ghi Chú (Tùy chọn)
            </h3>
            <textarea
              placeholder="Giao giờ hành chính, gói quà cẩn thận..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
            />
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#B71C1C]" />
                Chi Tiết Đơn Hàng <span className="text-red-500">*</span>
              </h3>
              <Button
                onClick={() => setShowProductSearch(true)}
                className="bg-[#D4AF37] hover:bg-[#C19A6B] text-white font-semibold flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Thêm Sản Phẩm
              </Button>
            </div>

            {orderDetails.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có sản phẩm nào</p>
                <p className="text-sm text-gray-400 mt-1">
                  Click "Thêm Sản Phẩm" để bắt đầu
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0">
                      {detail.image ? (
                        <img
                          src={detail.image}
                          alt={detail.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      ) : detail.giftBoxId ? (
                        <div className="w-12 h-12 bg-gradient-to-br from-[#B71C1C] to-[#8B1538] rounded-lg flex items-center justify-center">
                          <Gift className="h-6 w-6 text-white" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C19A6B] rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {detail.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {detail.giftBoxId ? "Giỏ Quà" : "Sản Phẩm"} •{" "}
                        {formatCurrency(detail.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(index, detail.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={quantityInputs[index] ?? detail.quantity.toString()}
                          onFocus={(e) => { const t = e.target; setTimeout(() => t.select(), 0); }}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            setQuantityInputs(prev => ({ ...prev, [index]: raw }));
                            if (raw !== '') {
                              const value = Math.max(1, parseInt(raw));
                              updateQuantity(index, value);
                            }
                          }}
                          onBlur={() => {
                            const raw = quantityInputs[index];
                            if (raw === '' || raw === undefined || parseInt(raw) < 1) {
                              updateQuantity(index, 1);
                            }
                            setQuantityInputs(prev => { const n = { ...prev }; delete n[index]; return n; });
                          }}
                          className="w-12 font-semibold border border-gray-300 rounded py-1 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          style={{ textAlign: 'center' }}
                        />
                        <button
                          onClick={() => updateQuantity(index, detail.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="font-bold text-[#B71C1C]">
                          {formatCurrency(detail.price * detail.quantity)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeOrderDetail(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Tóm Tắt Đơn Hàng
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Số lượng sản phẩm:</span>
                <span className="font-semibold text-gray-900">
                  {orderDetails.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>

              {appliedVoucher && (
                <div className="flex justify-between text-sm items-start">
                  <div>
                    <span className="text-green-600">Voucher ({appliedVoucher.code}):</span>
                    <button
                      onClick={() => setAppliedVoucher(null)}
                      className="ml-2 text-xs text-red-600 hover:underline"
                    >
                      ✕ Xóa
                    </button>
                  </div>
                  <span className="font-semibold text-green-600">
                    -{formatCurrency(calculateDiscount())}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-gray-900">
                    Tổng cộng:
                  </span>
                  <span
                    className="text-2xl font-bold text-[#D4AF37]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {formatCurrency(calculateFinalTotal())}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white font-bold py-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Đang tạo đơn hàng..." : "Tạo Đơn Hàng"}
              </Button>

              <Button
                onClick={onBack}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </Button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                📝 Lưu ý:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Các trường có dấu (*) là bắt buộc</li>
                <li>• Giá sản phẩm sẽ được lấy từ database</li>
                <li>• Voucher sẽ được kiểm tra tính hợp lệ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Product Search Modal */}
      {showProductSearch && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-4 flex items-center justify-between">
              <h3
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Thêm Sản Phẩm / Giỏ Quà
              </h3>
              <button
                onClick={() => {
                  setShowProductSearch(false);
                  setSearchQuery("");
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setProductPage(1); }}
                    className="w-full pl-10"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => { setSearchType("product"); setProductPage(1); }}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                    searchType === "product"
                      ? "bg-[#D4AF37] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Package className="h-4 w-4 inline-block mr-2" />
                  Sản Phẩm
                </button>
                <button
                  onClick={() => { setSearchType("giftbox"); setProductPage(1); }}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                    searchType === "giftbox"
                      ? "bg-[#D4AF37] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Gift className="h-4 w-4 inline-block mr-2" />
                  Giỏ Quà
                </button>
              </div>

              {/* Product List */}
              <div
                style={{ minHeight: '352px', height: '352px', flexShrink: 0 }}
                className="flex flex-col justify-start space-y-2 overflow-hidden"
              >
                {itemsLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                  </div>
                ) : pagedItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addOrderDetail(item)}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-left"
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ${
                      item.image ? "" :
                      item.type === "giftbox"
                        ? "bg-gradient-to-br from-[#B71C1C] to-[#8B1538]"
                        : "bg-gradient-to-br from-[#D4AF37] to-[#C19A6B]"
                    }`}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : item.type === "giftbox" ? (
                        <Gift className="h-6 w-6 text-white" />
                      ) : (
                        <Package className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.type === "giftbox" ? "Giỏ Quà" : "Sản Phẩm"} •{" "}
                        <span className="font-semibold text-[#B71C1C]">
                          {formatCurrency(item.price)}
                        </span>
                      </p>
                    </div>
                    <Plus className="h-5 w-5 text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Pagination — always rendered to keep modal height fixed */}
              <div
                style={{ minHeight: '52px', height: '52px', flexShrink: 0 }}
                className={`flex items-center justify-between mt-4 pt-3 border-t border-gray-200 ${
                  !itemsLoading && filteredItems.length > ITEMS_PER_PAGE ? "visible" : "invisible pointer-events-none"
                }`}
              >
                  <p className="text-sm text-gray-500">
                    Trang {productPage}/{totalProductPages} &bull; {filteredItems.length} sản phẩm
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setProductPage(p => Math.max(1, p - 1))}
                      disabled={productPage === 1}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalProductPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setProductPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                          page === productPage
                            ? "bg-[#D4AF37] text-white"
                            : "border border-gray-200 hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setProductPage(p => Math.min(totalProductPages, p + 1))}
                      disabled={productPage === totalProductPages}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-4 flex items-center justify-between">
              <h3
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Chọn Voucher
              </h3>
              <button
                onClick={() => {
                  setShowVoucherModal(false);
                  setVoucherModalSearch("");
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm voucher..."
                    value={voucherModalSearch}
                    onChange={(e) => setVoucherModalSearch(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
              </div>

              {/* Voucher List */}
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {vouchersLoading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Đang tải voucher...</p>
                  </div>
                ) : (() => {
                  const filtered = apiVouchers.filter(
                    (v) =>
                      v.isActive &&
                      (v.code.toLowerCase().includes(voucherModalSearch.toLowerCase()) ||
                        v.description.toLowerCase().includes(voucherModalSearch.toLowerCase()))
                  );
                  return filtered.length > 0 ? (
                    filtered.map((voucher) => (
                      <button
                        key={voucher.id}
                        onClick={() => applyVoucher(voucher)}
                        className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-left"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-[#B71C1C] to-[#8B1538] rounded-lg flex items-center justify-center">
                          <Tag className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{voucher.description}</p>
                          <p className="text-sm text-gray-600">
                            {voucher.isPercentage
                              ? `Giảm ${voucher.value}%`
                              : `Giảm ${formatCurrency(voucher.value)}`} •
                            Đơn tối thiểu {formatCurrency(voucher.minOrderValue)}
                          </p>
                          <p className="text-xs text-gray-400">Mã: {voucher.code}</p>
                        </div>
                        <Plus className="h-5 w-5 text-gray-400" />
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Không tìm thấy voucher nào</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}