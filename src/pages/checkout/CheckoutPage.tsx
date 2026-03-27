import { useState, useEffect } from "react";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  Package,
  RefreshCw,
  CheckCircle,
  Banknote,
  Building2,
  Wallet,
  ArrowLeft,
  Loader2,
  Search,
  Tag,
  Plus,
  X,
} from "lucide-react";
import { APP_PAGES } from "@/constants/pages";
import { Header } from "@/components/common/Header";
import { MiniCartSidebar } from "@/components/common/MiniCartSidebar";
import { OrderSuccess } from "@/components/common/OrderSuccess";
import type { OrderData } from "@/components/common/OrderSuccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STORAGE_KEYS } from "@/constants/storage";
import { useAppNavigation } from "@/context/AppNavigationContext";
import useAddress from "@/hooks/useAddress";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import useOrders from "@/hooks/useOrders";
import voucherService, { VoucherResponse } from "@/services/voucherService";
import { redirectToLogin } from "@/utils/authRedirect";
import { getErrorMessage } from "@/utils/errorMessage";
import { toast } from "sonner";

interface VNProvince { code: number; name: string; }
interface VNDistrict { code: number; name: string; }
interface VNWard    { code: number; name: string; }
type FormField = "fullName" | "phone" | "email" | "address";

interface CheckoutPageProps {
  onNavigate?: (page: string) => void;
}

const getStoredCheckoutItemIds = (): string[] => {
  const storedItemIds = sessionStorage.getItem(
    STORAGE_KEYS.CHECKOUT_SELECTED_ITEM_IDS,
  );

  if (!storedItemIds) {
    return [];
  }

  try {
    const parsedItemIds = JSON.parse(storedItemIds);
    return Array.isArray(parsedItemIds)
      ? parsedItemIds.filter(
          (itemId): itemId is string => typeof itemId === "string",
        )
      : [];
  } catch {
    return [];
  }
};

const normalizeVoucherCode = (value: string) => value.trim().toUpperCase();

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { currentPage, navigate, isCartOpen, openCart, closeCart } =
    useAppNavigation();
  const { fetchProvinces, fetchDistricts, fetchWards } = useAddress();
  const { createMomoOrder } = useOrders();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherResponse | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<VoucherResponse[]>([]);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherModalSearch, setVoucherModalSearch] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isPlacingMomo, setIsPlacingMomo] = useState(false);

  // Vietnam address data
  const [provinces, setProvinces] = useState<VNProvince[]>([]);
  const [districts, setDistricts] = useState<VNDistrict[]>([]);
  const [wards, setWards]         = useState<VNWard[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);

  // Form state — lưu code (dùng để fetch API) và name (dùng để gửi BE)
  const [selectedProvince, setSelectedProvince] = useState<VNProvince | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<VNDistrict | null>(null);
  const [selectedWard,     setSelectedWard]     = useState<VNWard | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [selectedCheckoutItemIds, setSelectedCheckoutItemIds] = useState<
    string[]
  >(() => getStoredCheckoutItemIds());

  const {
    items: cartItems,
    totalItems,
    isLoading: cartLoading,
    fetchCart,
    checkout,
  } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigateApp = onNavigate ?? navigate;
  const fetch = async (url: string) => {
    if (url === "https://provinces.open-api.vn/api/p/") {
      const data = await fetchProvinces();
      return {
        ok: true,
        json: async () => data,
      };
    }

    const provinceMatch = url.match(/\/api\/p\/(\d+)\?depth=2$/);
    if (provinceMatch) {
      const data = await fetchDistricts(Number(provinceMatch[1]));
      return {
        ok: true,
        json: async () => ({ districts: data.districts }),
      };
    }

    const districtMatch = url.match(/\/api\/d\/(\d+)\?depth=2$/);
    if (districtMatch) {
      const data = await fetchWards(Number(districtMatch[1]));
      return {
        ok: true,
        json: async () => ({ wards: data.wards }),
      };
    }

    throw new Error(`Unsupported fetch url: ${url}`);
  };

  // Load tất cả tỉnh/thành phố
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((r) => r.json())
      .then((data: VNProvince[]) => setProvinces(data))
      .catch(() => setProvinces([]));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadVouchers = async () => {
      setVoucherLoading(true);
      setVoucherError(null);

      try {
        const vouchers = await voucherService.getAllVouchers();
        if (isMounted) {
          setAvailableVouchers(vouchers);
        }
      } catch (error) {
        if (isMounted) {
          setVoucherError(
            getErrorMessage(error, "Khong the tai danh sach voucher"),
          );
        }
      } finally {
        if (isMounted) {
          setVoucherLoading(false);
        }
      }
    };

    loadVouchers();

    return () => {
      isMounted = false;
    };
  }, []);

  // Khi chọn tỉnh → load quận/huyện
  const handleProvinceChange = async (code: string) => {
    const prov = provinces.find((p) => String(p.code) === code) || null;
    setSelectedProvince(prov);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    clearOrUpdateFieldError(
      "province",
      prov ? null : VALIDATION_MESSAGES.provinceRequired,
    );
    clearOrUpdateFieldError("district", null);
    clearOrUpdateFieldError("ward", null);
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
    clearOrUpdateFieldError(
      "district",
      dist ? null : VALIDATION_MESSAGES.districtRequired,
    );
    clearOrUpdateFieldError("ward", null);
    if (!dist) return;
    setAddressLoading(true);
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${dist.code}?depth=2`);
      const data = await res.json();
      setWards(data.wards || []);
    } catch { setWards([]); }
    finally { setAddressLoading(false); }
  };

  // Load cart khi vào trang checkout
  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    return () => {
      const hasPendingMomoOrder = sessionStorage.getItem(
        STORAGE_KEYS.MOMO_ORDER_ID,
      );

      if (!hasPendingMomoOrder) {
        sessionStorage.removeItem(STORAGE_KEYS.CHECKOUT_SELECTED_ITEM_IDS);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedCheckoutItemIds.length === 0) {
      return;
    }

    const availableItemIds = new Set(cartItems.map((item) => item.id));
    const nextSelectedItemIds = selectedCheckoutItemIds.filter((itemId) =>
      availableItemIds.has(itemId),
    );

    if (nextSelectedItemIds.length === selectedCheckoutItemIds.length) {
      return;
    }

    setSelectedCheckoutItemIds(nextSelectedItemIds);
    if (nextSelectedItemIds.length === 0) {
      sessionStorage.removeItem(STORAGE_KEYS.CHECKOUT_SELECTED_ITEM_IDS);
      return;
    }

    sessionStorage.setItem(
      STORAGE_KEYS.CHECKOUT_SELECTED_ITEM_IDS,
      JSON.stringify(nextSelectedItemIds),
    );
  }, [cartItems, selectedCheckoutItemIds]);

  const checkoutItems =
    selectedCheckoutItemIds.length > 0
      ? cartItems.filter((item) => selectedCheckoutItemIds.includes(item.id))
      : cartItems;
  const checkoutSubTotal = checkoutItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );
  const shippingFee = checkoutSubTotal >= 500000 ? 0 : 30000;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const shippingFeeLabel = shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee);
  const shippingFeeHint =
    shippingFee === 0
      ? "Đơn hàng của bạn được miễn phí vận chuyển."
      : "Phí vận chuyển sẽ được áp dụng cho đơn hàng dưới 500.000đ.";

  const getVoucherValidationMessage = (
    voucher: VoucherResponse,
    subtotalAmount: number,
  ): string | null => {
    const voucherExpiry = new Date(voucher.endDate).getTime();

    if (!voucher.isActive || Number.isNaN(voucherExpiry) || voucherExpiry < Date.now()) {
      return "Mã giảm giá đã hết hạn hoặc đang bị vô hiệu hóa.";
    }

    if (voucher.usageLimit <= 0) {
      return "Mã giảm giá này đã hết lượt sử dụng.";
    }

    if (subtotalAmount < voucher.minOrderValue) {
      return `Đơn hàng cần đạt tối thiểu ${formatCurrency(voucher.minOrderValue)} để sử dụng voucher này.`;
    }

    return null;
  };

  const calculateVoucherDiscount = (
    voucher: VoucherResponse,
    subtotalAmount: number,
  ) => {
    if (voucher.isPercentage) {
      const calculatedDiscount = (subtotalAmount * voucher.value) / 100;
      return voucher.maxDiscountAmount !== null
        ? Math.min(calculatedDiscount, voucher.maxDiscountAmount)
        : calculatedDiscount;
    }

    return voucher.value;
  };

  const appliedVoucherMessage = appliedVoucher
    ? getVoucherValidationMessage(appliedVoucher, checkoutSubTotal)
    : null;
  const discount =
    appliedVoucher && !appliedVoucherMessage
      ? calculateVoucherDiscount(appliedVoucher, checkoutSubTotal)
      : 0;
  const total = checkoutSubTotal + shippingFee - discount;
  const eligibleVoucherCount = availableVouchers.filter(
    (voucher) => getVoucherValidationMessage(voucher, checkoutSubTotal) === null,
  ).length;
  const voucherSearchKeyword = voucherModalSearch.trim().toLowerCase();
  const modalVouchers = availableVouchers
    .filter((voucher) => {
      const voucherExpiry = new Date(voucher.endDate).getTime();
      return (
        voucher.isActive &&
        voucher.usageLimit > 0 &&
        !Number.isNaN(voucherExpiry) &&
        voucherExpiry >= Date.now()
      );
    })
    .filter((voucher) => {
      if (!voucherSearchKeyword) {
        return true;
      }

      const searchSource = `${voucher.code} ${voucher.description}`.toLowerCase();
      return searchSource.includes(voucherSearchKeyword);
    })
    .sort((left, right) => {
      const leftPriority =
        getVoucherValidationMessage(left, checkoutSubTotal) === null ? 0 : 1;
      const rightPriority =
        getVoucherValidationMessage(right, checkoutSubTotal) === null ? 0 : 1;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      return left.code.localeCompare(right.code);
    });
  const voucherPickerLabel = appliedVoucher
    ? "Đổi voucher khác"
    : eligibleVoucherCount > 0
      ? `Chọn từ ${eligibleVoucherCount} voucher phù hợp`
      : "Xem các voucher hiện có";

  const VALIDATION_MESSAGES = {
    fullNameRequired:
      "Vui l\u00f2ng nh\u1eadp h\u1ecd v\u00e0 t\u00ean",
    phoneRequired:
      "Vui l\u00f2ng nh\u1eadp s\u1ed1 \u0111i\u1ec7n tho\u1ea1i",
    phoneInvalid:
      "S\u1ed1 \u0111i\u1ec7n tho\u1ea1i kh\u00f4ng h\u1ee3p l\u1ec7",
    emailRequired: "Vui l\u00f2ng nh\u1eadp email",
    emailInvalid: "Email kh\u00f4ng h\u1ee3p l\u1ec7",
    provinceRequired:
      "Vui l\u00f2ng ch\u1ecdn t\u1ec9nh/th\u00e0nh ph\u1ed1",
    districtRequired:
      "Vui l\u00f2ng ch\u1ecdn qu\u1eadn/huy\u1ec7n",
    wardRequired:
      "Vui l\u00f2ng ch\u1ecdn ph\u01b0\u1eddng/x\u00e3",
    addressRequired:
      "Vui l\u00f2ng nh\u1eadp s\u1ed1 nh\u00e0, t\u00ean \u0111\u01b0\u1eddng",
  } as const;

  const getCheckoutFieldError = (
    field: FormField,
    value: string,
  ): string | null => {
    const trimmedValue = value.trim();

    switch (field) {
      case "fullName":
        return trimmedValue ? null : VALIDATION_MESSAGES.fullNameRequired;
      case "phone":
        if (!trimmedValue) return VALIDATION_MESSAGES.phoneRequired;
        return /^(0|\+84)[0-9]{8,10}$/.test(trimmedValue)
          ? null
          : VALIDATION_MESSAGES.phoneInvalid;
      case "email":
        if (!trimmedValue) return VALIDATION_MESSAGES.emailRequired;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
          ? null
          : VALIDATION_MESSAGES.emailInvalid;
      case "address":
        return trimmedValue ? null : VALIDATION_MESSAGES.addressRequired;
      default:
        return null;
    }
  };

  const getFieldError = (field: FormField, value: string): string | null => {
    const trimmedValue = value.trim();

    switch (field) {
      case "fullName":
        return trimmedValue ? null : "Vui lÃ²ng nháº­p há» vÃ  tÃªn";
      case "phone":
        if (!trimmedValue) return "Vui lÃ²ng nháº­p sá»‘ Ä‘iá»‡n thoáº¡i";
        return /^(0|\+84)[0-9]{8,10}$/.test(trimmedValue)
          ? null
          : "Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng há»£p lá»‡";
      case "email":
        if (!trimmedValue) return "Vui lÃ²ng nháº­p email";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
          ? null
          : "Email khÃ´ng há»£p lá»‡";
      case "address":
        return trimmedValue ? null : "Vui lÃ²ng nháº­p sá»‘ nhÃ , tÃªn Ä‘Æ°á»ng";
      default:
        return null;
    }
  };

  const clearOrUpdateFieldError = (
    field: string,
    error: string | null,
  ) => {
    setFormErrors((previousErrors) => {
      if (!(field in previousErrors)) {
        return previousErrors;
      }

      const nextErrors = { ...previousErrors };
      if (error) {
        nextErrors[field] = error;
      } else {
        delete nextErrors[field];
      }

      return nextErrors;
    });
  };

  const handleFieldChange = (field: FormField, value: string) => {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
    clearOrUpdateFieldError(field, getCheckoutFieldError(field, value));
  };

  const closeVoucherModal = () => {
    setShowVoucherModal(false);
    setVoucherModalSearch("");
  };

  const applyVoucherSelection = (
    voucher: VoucherResponse,
    options?: { closeModal?: boolean },
  ) => {
    const validationMessage = getVoucherValidationMessage(
      voucher,
      checkoutSubTotal,
    );

    if (validationMessage) {
      toast.error("Không thể áp dụng voucher", {
        description: validationMessage,
      });
      return;
    }

    const savedAmount = calculateVoucherDiscount(voucher, checkoutSubTotal);

    setAppliedVoucher(voucher);
    setDiscountCode(voucher.code);

    if (options?.closeModal) {
      closeVoucherModal();
    }

    toast.success("Voucher đã được áp dụng", {
      description: `Bạn tiết kiệm ${formatCurrency(savedAmount)} cho đơn hàng này.`,
    });
  };

  const handleApplyVoucher = () => {
    setOrderError(null);

    if (voucherLoading) {
      return;
    }

    if (voucherError) {
      toast.error("Chưa thể kiểm tra voucher", {
        description: voucherError,
      });
      return;
    }

    const normalizedCode = normalizeVoucherCode(discountCode);
    if (!normalizedCode) {
      toast.error("Vui lòng nhập mã giảm giá.");
      return;
    }

    const matchedVoucher = availableVouchers.find(
      (voucher) => normalizeVoucherCode(voucher.code) === normalizedCode,
    );

    if (!matchedVoucher) {
      setAppliedVoucher(null);
      toast.error("Không tìm thấy mã giảm giá.");
      return;
    }

    applyVoucherSelection(matchedVoucher);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountCode("");
    setOrderError(null);
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      redirectToLogin(
        navigateApp,
        currentPage ?? APP_PAGES.CHECKOUT,
        "Vui lòng đăng nhập để xem giỏ hàng.",
      );
      return;
    }

    openCart();
  };

  // Map payment method FE value -> BE value
  const PAYMENT_METHOD_MAP: Record<string, string> = {
    cod: "COD",
    momo: "MoMo",
    bank: "BankTransfer",
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const fullNameError = getCheckoutFieldError("fullName", formData.fullName);
    if (fullNameError) errors.fullName = fullNameError;

    const phoneError = getCheckoutFieldError("phone", formData.phone);
    if (phoneError) errors.phone = phoneError;

    const emailError = getCheckoutFieldError("email", formData.email);
    if (emailError) errors.email = emailError;

    if (!selectedProvince) errors.province = VALIDATION_MESSAGES.provinceRequired;
    if (!selectedDistrict) errors.district = VALIDATION_MESSAGES.districtRequired;
    if (!selectedWard) errors.ward = VALIDATION_MESSAGES.wardRequired;

    const addressError = getCheckoutFieldError("address", formData.address);
    if (addressError) errors.address = addressError;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handlePlaceOrder = async () => {
    setOrderError(null);
    if (!validateForm()) return;

    if (discountCode.trim() && !appliedVoucher) {
      setOrderError("Mã giảm giá chưa được áp dụng. Vui lòng bấm 'Áp dụng' trước khi đặt hàng.");
      return;
    }

    if (appliedVoucherMessage) {
      setOrderError(appliedVoucherMessage);
      return;
    }

    const shippingAddress = [
      formData.address.trim(),
      selectedWard?.name,
      selectedDistrict?.name,
      selectedProvince?.name,
    ]
      .filter(Boolean)
      .join(", ");

    // ── MoMo flow ──────────────────────────────────────────────
    if (paymentMethod === "momo") {
      setIsPlacingMomo(true);
      try {
        const orderDetails = checkoutItems.map((item) => ({
          productId: item.productId ?? null,
          giftBoxId: item.giftBoxId ?? null,
          quantity: item.quantity,
          price: item.unitPrice,
        }));

        const momoOrder = await createMomoOrder({
          userId: user?.id,
          note: null,
          paymentMethod: "MOMO",
          voucherId: appliedVoucher?.id ?? null,
          shippingPhone: formData.phone.trim(),
          shippingAddress,
          orderDetails,
        });

        if (momoOrder?.payUrl) {
          sessionStorage.setItem(
            STORAGE_KEYS.MOMO_ORDER_ID,
            momoOrder.orderId,
          );
          window.location.href = momoOrder.payUrl;
        } else {
          setOrderError("Tạo thanh toán MoMo thất bại.");
        }
      } catch (err: unknown) {
        // ✅ FIX: Clear sessionStorage on error
        sessionStorage.removeItem(STORAGE_KEYS.MOMO_ORDER_ID);
        setOrderError(
          getErrorMessage(err, "Tạo thanh toán MoMo thất bại. Vui lòng thử lại."),
        );
      } finally {
        setIsPlacingMomo(false);
      }
      return;
    }

    // ── COD / BankTransfer flow ─────────────────────────────────
    try {
      const createdOrder = await checkout({
        shippingAddress,
        shippingPhone: formData.phone.trim(),
        paymentMethod: PAYMENT_METHOD_MAP[paymentMethod] ?? "COD",
        voucherCode: appliedVoucher?.code ?? null,
        note: null,
        selectedItemIds:
          selectedCheckoutItemIds.length > 0 ? selectedCheckoutItemIds : null,
      });

      sessionStorage.removeItem(STORAGE_KEYS.CHECKOUT_SELECTED_ITEM_IDS);
      setOrderData(createdOrder as OrderData);
      setOrderSuccess(true);
    } catch (err: unknown) {
      setOrderError(
        getErrorMessage(err, "Đặt hàng thất bại. Vui lòng thử lại."),
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Use Header from Homepage */}
      <Header
        cartCount={totalItems}
        onNavigate={navigateApp}
        onCartClick={handleCartClick}
        isLoggedIn={isLoggedIn}
      />

      {/* Order Success Screen */}
      {orderSuccess && (
        <OrderSuccess orderData={orderData} onNavigate={onNavigate!} />
      )}

      {!orderSuccess && (
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate && onNavigate("home")}
          className="flex items-center space-x-2 text-gray-600 hover:text-[#B71C1C] transition-colors mb-6 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Trở lại</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Customer Info & Payment (60%) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Section 1: Shipping Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2
                className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <Truck className="h-6 w-6 mr-3 text-[#D4AF37]" />
                Thông tin giao hàng
              </h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleFieldChange("fullName", e.target.value)
                    }
                    className={`w-full border-gray-300 rounded-lg py-3 ${formErrors.fullName ? "border-red-500" : ""}`}
                  />
                  {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      placeholder="0901234567"
                      value={formData.phone}
                      onChange={(e) =>
                        handleFieldChange("phone", e.target.value)
                      }
                      className={`w-full border-gray-300 rounded-lg py-3 ${formErrors.phone ? "border-red-500" : ""}`}
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleFieldChange("email", e.target.value)
                      }
                      className={`w-full border-gray-300 rounded-lg py-3 ${formErrors.email ? "border-red-500" : ""}`}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                </div>

                {/* Address Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tỉnh/Thành phố */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedProvince ? String(selectedProvince.code) : ""}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      disabled={provinces.length === 0}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 ${formErrors.province ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">
                        {provinces.length === 0 ? "Đang tải..." : "Chọn Tỉnh/TP"}
                      </option>
                      {provinces.map((p) => (
                        <option key={p.code} value={String(p.code)}>{p.name}</option>
                      ))}
                    </select>
                    {formErrors.province && <p className="text-red-500 text-xs mt-1">{formErrors.province}</p>}
                  </div>

                  {/* Quận/Huyện */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedDistrict ? String(selectedDistrict.code) : ""}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      disabled={!selectedProvince || addressLoading}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 ${formErrors.district ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">
                        {addressLoading ? "Đang tải..." : !selectedProvince ? "Chọn Tỉnh/TP trước" : "Chọn Quận/Huyện"}
                      </option>
                      {districts.map((d) => (
                        <option key={d.code} value={String(d.code)}>{d.name}</option>
                      ))}
                    </select>
                    {formErrors.district && <p className="text-red-500 text-xs mt-1">{formErrors.district}</p>}
                  </div>

                  {/* Phường/Xã */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phường/Xã <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedWard ? String(selectedWard.code) : ""}
                      onChange={(e) => {
                        const ward = wards.find((w) => String(w.code) === e.target.value) || null;
                        setSelectedWard(ward);
                        clearOrUpdateFieldError(
                          "ward",
                          ward ? null : VALIDATION_MESSAGES.wardRequired,
                        );
                      }}
                      disabled={!selectedDistrict || addressLoading}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 ${formErrors.ward ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">
                        {addressLoading ? "Đang tải..." : !selectedDistrict ? "Chọn Quận/Huyện trước" : "Chọn Phường/Xã"}
                      </option>
                      {wards.map((w) => (
                        <option key={w.code} value={String(w.code)}>{w.name}</option>
                      ))}
                    </select>
                    {formErrors.ward && <p className="text-red-500 text-xs mt-1">{formErrors.ward}</p>}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số nhà, tên đường <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="123 Đường Lê Lợi"
                    value={formData.address}
                    onChange={(e) =>
                      handleFieldChange("address", e.target.value)
                    }
                    className={`w-full border-gray-300 rounded-lg py-3 ${formErrors.address ? "border-red-500" : ""}`}
                  />
                  {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Shipping Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2
                className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <Package className="h-6 w-6 mr-3 text-[#D4AF37]" />
                Phương thức vận chuyển
              </h2>

              <div className="rounded-2xl border-2 border-[#B71C1C] bg-red-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Giao hàng tiêu chuẩn
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Phí vận chuyển sẽ được tính dựa trên giá trị đơn hàng.
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#B71C1C]">
                      {shippingFeeHint}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {shippingFeeLabel}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Đơn từ 500.000đ sẽ được miễn phí vận chuyển. Đơn dưới mức này áp dụng phí giao hàng 30.000đ.
              </p>
            </div>

            {/* Section 3: Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2
                className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <CreditCard className="h-6 w-6 mr-3 text-[#D4AF37]" />
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {/* COD */}
                <label
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#B71C1C] bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-[#B71C1C] focus:ring-[#D4AF37]"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Banknote className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Thanh toán khi nhận hàng (COD)
                        </p>
                        <p className="text-sm text-gray-600">
                          Thanh toán bằng tiền mặt khi nhận hàng
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* MoMo */}
                <label
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "momo"
                      ? "border-[#B71C1C] bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={paymentMethod === "momo"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-[#B71C1C] focus:ring-[#D4AF37]"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Ví điện tử MoMo
                        </p>
                        <p className="text-sm text-gray-600">
                          Thanh toán nhanh chóng qua ví MoMo
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "bank"
                      ? "border-[#B71C1C] bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-[#B71C1C] focus:ring-[#D4AF37]"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Chuyển khoản ngân hàng
                        </p>
                        <p className="text-sm text-gray-600">
                          Chuyển khoản qua tài khoản ngân hàng
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary (40%) */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2
                  className="text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Đơn hàng của bạn
                </h2>

                {/* Product List */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative">
                        {item.displayImageUrl ? (
                          <img
                            src={item.displayImageUrl}
                            alt={item.displayName ?? ""}
                            className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#FFFDF5] to-[#F5F5F5] flex items-center justify-center text-4xl border border-gray-200">
                            🎁
                          </div>
                        )}
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#B71C1C] text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {item.displayName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mã giảm giá
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      value={discountCode}
                      onChange={(e) => {
                        const nextCode = e.target.value;
                        setDiscountCode(nextCode);

                        if (
                          appliedVoucher &&
                          normalizeVoucherCode(nextCode) !==
                            normalizeVoucherCode(appliedVoucher.code)
                        ) {
                          setAppliedVoucher(null);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyVoucher();
                        }
                      }}
                      className="flex-1 border-gray-300 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={voucherLoading}
                      onClick={handleApplyVoucher}
                      className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
                    >
                      {voucherLoading ? "Đang tải..." : "Áp dụng"}
                    </Button>
                  </div>

                  {appliedVoucher && !appliedVoucherMessage && (
                    <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-green-800">
                            Đã áp dụng voucher {appliedVoucher.code}
                          </p>
                          <p className="text-sm text-green-700">
                            Bạn tiết kiệm {formatCurrency(discount)} cho đơn hàng này.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveVoucher}
                          className="text-sm font-semibold text-green-700 hover:text-green-900"
                        >
                          Bỏ
                        </button>
                      </div>
                    </div>
                  )}

                  {appliedVoucher && appliedVoucherMessage && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-red-700">
                            Voucher {appliedVoucher.code} hiện chưa thể áp dụng
                          </p>
                          <p className="text-sm text-red-600">
                            {appliedVoucherMessage}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveVoucher}
                          className="text-sm font-semibold text-red-700 hover:text-red-900"
                        >
                          Bỏ
                        </button>
                      </div>
                    </div>
                  )}

                  {!appliedVoucher && voucherError && (
                    <p className="mt-2 text-sm text-red-600">{voucherError}</p>
                  )}

                  {!voucherError && !voucherLoading && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-500">
                        {eligibleVoucherCount > 0
                          ? `Có ${eligibleVoucherCount} voucher đang phù hợp với đơn hàng này.`
                          : "Chưa có voucher nào phù hợp với giá trị đơn hàng hiện tại."}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowVoucherModal(true)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#B71C1C] transition-colors hover:text-[#8B1538]"
                      >
                        <Tag className="h-4 w-4" />
                        {voucherPickerLabel}
                      </button>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính</span>
                    <span className="font-semibold">
                      {formatCurrency(checkoutSubTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold">
                      {shippingFeeLabel}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-semibold">
                        -{formatCurrency(discount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Tổng cộng
                  </span>
                  <span
                    className="text-3xl font-bold text-[#D4AF37]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {formatCurrency(total)}
                  </span>
                </div>

                {/* Order Error */}
                {orderError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-semibold">{orderError}</p>
                  </div>
                )}

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={
                    cartLoading || checkoutItems.length === 0 || isPlacingMomo
                  }
                  className="w-full bg-[#B71C1C] hover:bg-[#8B1538] text-white font-bold py-4 rounded-lg text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlacingMomo ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Đang tạo thanh toán MoMo...
                    </span>
                  ) : cartLoading ? (
                    "Đang xử lý..."
                  ) : (
                    "ĐẶT HÀNG NGAY"
                  )}
                </Button>

                {/* Trust Signals */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Đổi trả trong 7 ngày
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Hàng chính hãng
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Thanh toán an toàn
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Miễn phí giao hàng
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {showVoucherModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
          onClick={closeVoucherModal}
        >
          <div
            className="max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-8 py-5 flex items-center justify-between">
              <h3
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Chọn Voucher
              </h3>
              <button
                type="button"
                onClick={closeVoucherModal}
                className="text-white/80 transition-colors hover:text-white"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm voucher..."
                    value={voucherModalSearch}
                    onChange={(event) => setVoucherModalSearch(event.target.value)}
                    className="h-12 rounded-2xl border-gray-200 pl-12"
                  />
                </div>
              </div>

              <div className="max-h-[440px] space-y-3 overflow-y-auto pr-1">
                {voucherLoading ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-gray-500">
                    Đang tải danh sách voucher...
                  </div>
                ) : voucherError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-6 text-sm text-red-600">
                    {voucherError}
                  </div>
                ) : modalVouchers.length > 0 ? (
                  modalVouchers.map((voucher) => {
                    const voucherMessage = getVoucherValidationMessage(
                      voucher,
                      checkoutSubTotal,
                    );
                    const isSelectable = voucherMessage === null;
                    const isSelected = appliedVoucher?.id === voucher.id;

                    return (
                      <button
                        key={voucher.id}
                        type="button"
                        onClick={() =>
                          applyVoucherSelection(voucher, { closeModal: true })
                        }
                        className={`w-full rounded-2xl border p-5 text-left transition-all ${
                          isSelected
                            ? "border-[#B71C1C] bg-red-50 shadow-sm"
                            : isSelectable
                              ? "border-gray-200 bg-white hover:border-[#D4AF37] hover:bg-[#FFFDF5]"
                              : "border-gray-200 bg-gray-50/80 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B71C1C] to-[#8B1538]">
                            <Tag className="h-7 w-7 text-white" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xl font-semibold text-gray-900">
                                  {voucher.description}
                                </p>
                                <p className="mt-1 text-base text-gray-600">
                                  {voucher.isPercentage
                                    ? `Giảm ${voucher.value}%`
                                    : `Giảm ${formatCurrency(voucher.value)}`}{" "}
                                  • Đơn tối thiểu{" "}
                                  {formatCurrency(voucher.minOrderValue)}
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                  Mã: {voucher.code}
                                </p>
                                {voucherMessage && (
                                  <p className="mt-2 text-sm font-medium text-amber-600">
                                    {voucherMessage}
                                  </p>
                                )}
                              </div>

                              <div className="shrink-0">
                                {isSelected ? (
                                  <span className="inline-flex rounded-full bg-[#B71C1C] px-3 py-1 text-sm font-semibold text-white">
                                    Đã chọn
                                  </span>
                                ) : (
                                  <Plus
                                    className={`h-6 w-6 ${
                                      isSelectable ? "text-[#B71C1C]" : "text-gray-400"
                                    }`}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-gray-500">
                    Không tìm thấy voucher phù hợp với từ khóa của bạn.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <MiniCartSidebar
        isOpen={isCartOpen}
        onClose={closeCart}
        onNavigate={navigateApp}
      />
    </div>
  );
}

