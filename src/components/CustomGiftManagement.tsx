import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Crown,
  DollarSign,
  Eye,
  Gift,
  Loader2,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import giftBoxService, {
  type BoxComponentResponse,
  type GiftBoxResponse,
} from "../services/giftBoxService";
import userService, { type UserResponse } from "../services/userService";

type CustomerType = "individual" | "enterprise";

interface BasketItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface GiftBasket {
  id: string;
  name: string;
  createdAt: string;
  createdDate: string;
  total: number;
  image: string;
  itemsCount: number;
  items: BasketItem[];
}

interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  type: CustomerType;
  isVip: boolean;
  totalGiftBaskets: number;
  totalValue: number;
  avatar: string;
  giftBaskets: GiftBasket[];
}

const FALLBACK_BASKET_IMAGE =
  "https://images.unsplash.com/photo-1644890587862-e309716adbca?w=1080";
const FALLBACK_ITEM_IMAGE =
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400";
const VIP_THRESHOLD = 10_000_000;
const API_HOST = (
  import.meta.env.VITE_API_URL || "https://prn232.onrender.com/api"
).replace(/\/api\/?$/, "");

const normalizeText = (value?: string | null) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const extractApiData = <T,>(payload: unknown): T | null => {
  if (payload == null) {
    return null;
  }

  if (typeof payload === "object" && "success" in (payload as object)) {
    const envelope = payload as {
      success?: boolean;
      message?: string;
      data?: T;
    };

    if (envelope.success === false) {
      throw new Error(envelope.message || "Yêu cầu không thành công");
    }

    return envelope.data ?? null;
  }

  return payload as T;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const maybeError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return maybeError?.response?.data?.message || maybeError?.message || fallback;
};

const resolveImageUrl = (url?: string | null) => {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${API_HOST}${url}`;
  }

  return `${API_HOST}/${url.replace(/^\/+/, "")}`;
};

const formatPrice = (price: number) => {
  if (!price || typeof price !== "number") {
    return "0 VND";
  }

  return `${price.toLocaleString("vi-VN")} VND`;
};

const formatCompactMillions = (amount: number) => {
  if (!amount) {
    return "0";
  }

  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`;
  }

  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }

  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`;
  }

  return amount.toString();
};

const buildCustomerCode = (userId: string) =>
  `CST-${userId.replace(/-/g, "").substring(0, 8).toUpperCase()}`;

const getAvatarLabel = (name: string, fallbackId: string) => {
  const parts = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return fallbackId.substring(0, 2).toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].substring(0, 3).toUpperCase();
  }

  const initials = `${parts[0][0]}${parts[Math.floor(parts.length / 2)][0]}${parts[parts.length - 1][0]}`;
  return initials.substring(0, 3).toUpperCase();
};

const detectCustomerType = (
  user?: UserResponse | null,
  fallbackName?: string,
): CustomerType => {
  const signals = [user?.companyName, user?.taxCode, user?.roleName, fallbackName]
    .map((value) => normalizeText(value))
    .filter(Boolean);

  const hasEnterpriseSignal = signals.some((value) =>
    [
      "enterprise",
      "doanh nghiep",
      "cong ty",
      "cty",
      "company",
      "corp",
      "corporation",
      "tnhh",
      "jsc",
      "tap doan",
    ].some((keyword) => value.includes(keyword)),
  );

  return hasEnterpriseSignal ? "enterprise" : "individual";
};

const mapItems = (components?: BoxComponentResponse[]): BasketItem[] =>
  (components ?? []).map((component, index) => ({
    id: component.id || `${component.productId}-${index}`,
    productId: component.productId,
    name:
      component.productName ||
      component.productSKU ||
      `Sản phẩm ${index + 1}`,
    price: component.productPrice || 0,
    quantity: component.quantity || 0,
    image: FALLBACK_ITEM_IMAGE,
  }));

const mapGiftBoxToBasket = (giftBox: GiftBoxResponse): GiftBasket => {
  const items = mapItems(giftBox.boxComponents);
  const computedTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const mainImage =
    giftBox.images?.find((image) => image.isMain)?.url ||
    giftBox.images?.[0]?.url;

  return {
    id: giftBox.id,
    name: giftBox.name || giftBox.code || "Giỏ quà thiết kế",
    createdAt: giftBox.createdAt,
    createdDate: new Date(giftBox.createdAt).toLocaleDateString("vi-VN"),
    total: computedTotal > 0 ? computedTotal : giftBox.basePrice || 0,
    image: resolveImageUrl(mainImage) || FALLBACK_BASKET_IMAGE,
    itemsCount: items.length,
    items,
  };
};

const buildCustomersFromData = (
  giftBoxes: GiftBoxResponse[],
  users: UserResponse[],
) => {
  const userMap = new Map(users.map((user) => [user.id, user]));
  const groupedGiftBoxes = new Map<string, GiftBoxResponse[]>();

  giftBoxes
    .filter((giftBox) => giftBox.isCustom && giftBox.userId)
    .forEach((giftBox) => {
      const ownerId = giftBox.userId as string;
      const current = groupedGiftBoxes.get(ownerId) ?? [];
      current.push(giftBox);
      groupedGiftBoxes.set(ownerId, current);
    });

  return Array.from(groupedGiftBoxes.entries())
    .map(([ownerId, ownerGiftBoxes]) => {
      const user = userMap.get(ownerId);
      const giftBaskets = ownerGiftBoxes
        .map(mapGiftBoxToBasket)
        .sort(
          (left, right) =>
            new Date(right.createdAt).getTime() -
            new Date(left.createdAt).getTime(),
        );
      const totalValue = giftBaskets.reduce(
        (sum, basket) => sum + basket.total,
        0,
      );
      const name =
        user?.fullName ||
        user?.username ||
        `Khách hàng ${ownerId.substring(0, 8).toUpperCase()}`;

      return {
        id: ownerId,
        userId: buildCustomerCode(ownerId),
        name,
        email: user?.email || "Chưa có email",
        phone: user?.phone || "Chưa có số điện thoại",
        type: detectCustomerType(user, name),
        isVip: totalValue >= VIP_THRESHOLD,
        totalGiftBaskets: giftBaskets.length,
        totalValue,
        avatar: getAvatarLabel(name, ownerId),
        giftBaskets,
      } satisfies Customer;
    })
    .sort((left, right) => {
      if (right.totalValue !== left.totalValue) {
        return right.totalValue - left.totalValue;
      }

      return right.totalGiftBaskets - left.totalGiftBaskets;
    });
};

export function CustomGiftManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | CustomerType>("all");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userWarning, setUserWarning] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBasket, setSelectedBasket] = useState<GiftBasket | null>(null);
  const [isDeletingBasketId, setIsDeletingBasketId] = useState<string | null>(
    null,
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setUserWarning(null);

      const [giftBoxesResult, usersResult] = await Promise.allSettled([
        giftBoxService.getAll(),
        userService.getAll(),
      ]);

      if (giftBoxesResult.status === "rejected") {
        throw giftBoxesResult.reason;
      }

      const giftBoxes =
        extractApiData<GiftBoxResponse[]>(giftBoxesResult.value.data) ?? [];

      let users: UserResponse[] = [];
      if (usersResult.status === "fulfilled") {
        users = extractApiData<UserResponse[]>(usersResult.value.data) ?? [];
      } else {
        setUserWarning(
          "Không tải được danh sách khách hàng. Trang đang hiển thị theo userId và dữ liệu giỏ quà sẵn có.",
        );
      }

      const nextCustomers = buildCustomersFromData(giftBoxes, users);
      setCustomers(nextCustomers);
      setSelectedCustomerId((currentId) => {
        if (
          currentId &&
          nextCustomers.some((customer) => customer.id === currentId)
        ) {
          return currentId;
        }

        return nextCustomers[0]?.id ?? null;
      });
    } catch (fetchError) {
      console.error("Error fetching custom gift baskets:", fetchError);
      setError(
        getErrorMessage(
          fetchError,
          "Không thể tải danh sách giỏ quà thiết kế.",
        ),
      );
      setCustomers([]);
      setSelectedCustomerId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const normalizedQuery = normalizeText(searchQuery);
      const matchesSearch =
        !normalizedQuery ||
        normalizeText(customer.name).includes(normalizedQuery) ||
        normalizeText(customer.email).includes(normalizedQuery) ||
        normalizeText(customer.userId).includes(normalizedQuery) ||
        normalizeText(customer.phone).includes(normalizedQuery);

      const matchesType =
        typeFilter === "all" || customer.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [customers, searchQuery, typeFilter]);

  useEffect(() => {
    if (filteredCustomers.length === 0) {
      if (selectedCustomerId !== null) {
        setSelectedCustomerId(null);
      }
      return;
    }

    if (!selectedCustomerId) {
      setSelectedCustomerId(filteredCustomers[0].id);
      return;
    }

    const hasSelectedCustomer = filteredCustomers.some(
      (customer) => customer.id === selectedCustomerId,
    );

    if (!hasSelectedCustomer) {
      setSelectedCustomerId(filteredCustomers[0].id);
    }
  }, [filteredCustomers, selectedCustomerId]);

  const selectedCustomer = filteredCustomers.find(
    (customer) => customer.id === selectedCustomerId,
  );

  const summary = useMemo(() => {
    return customers.reduce(
      (accumulator, customer) => {
        accumulator.totalGiftBaskets += customer.totalGiftBaskets;
        accumulator.totalValue += customer.totalValue;
        return accumulator;
      },
      { totalGiftBaskets: 0, totalValue: 0 },
    );
  }, [customers]);

  const handleViewBasket = (basket: GiftBasket) => {
    setSelectedBasket(basket);
    setIsViewDialogOpen(true);
  };

  const handleDeleteBasket = async (basketId: string) => {
    const shouldDelete = window.confirm(
      "Bạn có chắc muốn xóa giỏ quà thiết kế này không?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeletingBasketId(basketId);
      await giftBoxService.delete(basketId);

      setCustomers((previousCustomers) =>
        previousCustomers
          .map((customer) => {
            const nextGiftBaskets = customer.giftBaskets.filter(
              (basket) => basket.id !== basketId,
            );

            if (nextGiftBaskets.length === customer.giftBaskets.length) {
              return customer;
            }

            if (nextGiftBaskets.length === 0) {
              return null;
            }

            const nextTotalValue = nextGiftBaskets.reduce(
              (sum, basket) => sum + basket.total,
              0,
            );

            return {
              ...customer,
              giftBaskets: nextGiftBaskets,
              totalGiftBaskets: nextGiftBaskets.length,
              totalValue: nextTotalValue,
              isVip: nextTotalValue >= VIP_THRESHOLD,
            };
          })
          .filter(Boolean) as Customer[],
      );

      if (selectedBasket?.id === basketId) {
        setSelectedBasket(null);
        setIsViewDialogOpen(false);
      }

      toast.success("Đã xóa giỏ quà thiết kế.");
    } catch (deleteError) {
      console.error("Error deleting gift basket:", deleteError);
      toast.error(
        getErrorMessage(deleteError, "Không thể xóa giỏ quà này."),
      );
    } finally {
      setIsDeletingBasketId(null);
    }
  };

  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div className="border-b border-gray-200 bg-white px-8 py-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1
              className="mb-1 text-2xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
            >
              Sản Phẩm Thiết Kế
            </h1>
            <p className="text-sm text-gray-500">
              Quản lý các giỏ quà do khách hàng tự thiết kế từ dữ liệu hiện có.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-lg border-2 border-[#B71C1C] bg-white px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#B71C1C]">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="mb-0.5 text-xs text-gray-500">Tổng Giỏ Quà</p>
                  <p className="text-xl font-bold text-[#B71C1C]">
                    {summary.totalGiftBaskets}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-2 border-[#D4AF37] bg-white px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="mb-0.5 text-xs text-gray-500">Tổng Giá Trị</p>
                  <p className="text-xl font-bold text-[#D4AF37]">
                    {formatCompactMillions(summary.totalValue)}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={fetchData}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {userWarning && (
        <div className="mx-8 mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{userWarning}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
            <Loader2 className="h-6 w-6 animate-spin text-[#B71C1C]" />
            <span className="text-gray-700">Đang tải giỏ quà thiết kế...</span>
          </div>
        </div>
      ) : error ? (
        <div className="px-8 py-8">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Không tải được dữ liệu
            </h2>
            <p className="mx-auto mb-5 max-w-2xl text-sm text-gray-600">
              {error}
            </p>
            <Button
              onClick={fetchData}
              className="bg-[#B71C1C] text-white hover:bg-[#981717]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[calc(100vh-110px)]">
          <div className="flex w-[380px] flex-shrink-0 flex-col border-r border-gray-200 bg-white">
            <div className="space-y-3 border-b border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm khách hàng..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-lg border-gray-300 py-2 pl-9 pr-4 focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/20"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setTypeFilter("all")}
                  variant={typeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  className={
                    typeFilter === "all"
                      ? "bg-[#B71C1C] text-xs text-white hover:bg-[#9A1919]"
                      : "border-gray-300 text-xs text-gray-600 hover:bg-gray-50"
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
                      ? "bg-[#B71C1C] text-xs text-white hover:bg-[#9A1919]"
                      : "border-gray-300 text-xs text-gray-600 hover:bg-gray-50"
                  }
                >
                  <User className="mr-1 h-3 w-3" />
                  Cá nhân
                </Button>
                <Button
                  onClick={() => setTypeFilter("enterprise")}
                  variant={typeFilter === "enterprise" ? "default" : "outline"}
                  size="sm"
                  className={
                    typeFilter === "enterprise"
                      ? "bg-[#B71C1C] text-xs text-white hover:bg-[#9A1919]"
                      : "border-gray-300 text-xs text-gray-600 hover:bg-gray-50"
                  }
                >
                  <ShoppingBag className="mr-1 h-3 w-3" />
                  Doanh nghiệp
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredCustomers.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center text-gray-400">
                  <User className="mb-3 h-16 w-16" />
                  <p className="text-sm font-medium text-gray-600">
                    Không tìm thấy khách hàng phù hợp
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Hãy thử đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => setSelectedCustomerId(customer.id)}
                      className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                        selectedCustomer?.id === customer.id
                          ? "border-l-4 border-[#B71C1C] bg-red-50/50"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                            customer.type === "enterprise"
                              ? "bg-[#D4AF37]"
                              : "bg-[#B71C1C]"
                          }`}
                        >
                          {customer.avatar}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-gray-900">
                              {customer.name}
                            </h3>
                            {customer.isVip && (
                              <Crown className="h-3.5 w-3.5 flex-shrink-0 text-[#D4AF37]" />
                            )}
                          </div>
                          <p className="mb-1.5 text-xs text-gray-400">
                            {customer.userId}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Gift className="h-3 w-3" />
                              {customer.totalGiftBaskets} giỏ
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatCompactMillions(customer.totalValue)}
                            </span>
                          </div>
                        </div>

                        <Badge
                          className={`h-5 text-xs ${
                            customer.type === "enterprise"
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-green-200 bg-green-50 text-green-700"
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
          <div className="flex flex-1 flex-col overflow-hidden">
            {selectedCustomer ? (
              <>
                <div className="border-b-4 border-[#D4AF37] bg-[#B71C1C] px-8 py-5 text-white">
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white ${
                          selectedCustomer.type === "enterprise"
                            ? "bg-[#D4AF37]"
                            : "bg-white/20"
                        }`}
                      >
                        {selectedCustomer.avatar}
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <h2 className="text-xl font-bold">
                            {selectedCustomer.name}
                          </h2>
                          {selectedCustomer.isVip && (
                            <Crown className="h-5 w-5 text-[#D4AF37]" />
                          )}
                        </div>
                        <p className="text-sm text-white/90">
                          {selectedCustomer.email}
                        </p>
                        <p className="text-xs text-white/80">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-8">
                      <div className="text-center">
                        <p className="mb-1 text-xs text-white/70">Tổng Giỏ Quà</p>
                        <p className="text-2xl font-bold">
                          {selectedCustomer.totalGiftBaskets}
                        </p>
                      </div>
                      <div className="w-px bg-white/20" />
                      <div className="text-center">
                        <p className="mb-1 text-xs text-white/70">Tổng Giá Trị</p>
                        <p className="text-2xl font-bold text-[#D4AF37]">
                          {formatPrice(selectedCustomer.totalValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-6">
                  {selectedCustomer.giftBaskets.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-gray-400">
                      <Gift className="mb-4 h-20 w-20" />
                      <p className="text-base font-semibold">
                        Chưa có giỏ quà thiết kế
                      </p>
                      <p className="text-sm">
                        Khách hàng này chưa có giỏ quà nào khả dụng.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {selectedCustomer.giftBaskets.map((basket) => {
                        const isDeleting = isDeletingBasketId === basket.id;

                        return (
                          <div
                            key={basket.id}
                            className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
                          >
                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                              <img
                                src={basket.image}
                                alt={basket.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>

                            <div className="p-4">
                              <h3
                                className="mb-1 line-clamp-1 text-base font-bold text-gray-900"
                                style={{
                                  fontFamily:
                                    "'Playfair Display', 'Noto Serif', serif",
                                }}
                              >
                                {basket.name}
                              </h3>

                              <p className="mb-3 flex items-center gap-1 text-xs text-gray-400">
                                <Calendar className="h-3 w-3" />
                                {basket.createdDate}
                              </p>

                              <div className="mb-3 flex items-center gap-1.5 text-sm text-gray-600">
                                <Package className="h-4 w-4" />
                                <span>{basket.itemsCount} sản phẩm</span>
                              </div>

                              <div className="mb-3 border-b border-gray-200 pb-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    Tổng giá trị:
                                  </span>
                                  <span className="text-lg font-bold text-[#D4AF37]">
                                    {formatPrice(basket.total)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleViewBasket(basket)}
                                  variant="outline"
                                  size="sm"
                                  className="h-8 flex-1 border-[#D4AF37] text-xs text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-white"
                                >
                                  <Eye className="mr-1 h-3.5 w-3.5" />
                                  Xem
                                </Button>
                                <Button
                                  onClick={() => handleDeleteBasket(basket.id)}
                                  variant="outline"
                                  size="sm"
                                  disabled={isDeleting}
                                  className="h-8 border-gray-300 text-gray-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                                >
                                  {isDeleting ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center text-gray-400">
                <User className="mb-4 h-20 w-20" />
                <p className="text-base font-semibold text-gray-700">
                  Chưa có dữ liệu để hiển thị
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Hiện chưa có giỏ quà thiết kế nào phù hợp với bộ lọc đang chọn.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-[95vw] w-full gap-0 overflow-y-auto p-0 sm:max-w-7xl">
          <div className="relative bg-gradient-to-r from-[#B71C1C] via-[#D32F2F] to-[#B71C1C] px-8 py-6">
            <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

            <DialogHeader className="relative z-10">
              <DialogTitle
                className="mb-2 text-center text-3xl font-bold text-[#FFFDF5]"
                style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
              >
                Chi Tiết Giỏ Quà
              </DialogTitle>
              <DialogDescription className="text-center text-base text-[#FFFDF5]/90">
                Thông tin chi tiết về giỏ quà thiết kế của khách hàng
              </DialogDescription>
            </DialogHeader>
          </div>

          {selectedBasket && (
            <div className="grid grid-cols-1 gap-8 bg-[#FFFDF5] p-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl border-4 border-[#D4AF37]/30 bg-white shadow-xl">
                  <div className="absolute left-0 top-0 z-10 h-16 w-16 rounded-tl-2xl border-l-4 border-t-4 border-[#D4AF37]" />
                  <div className="absolute right-0 top-0 z-10 h-16 w-16 rounded-tr-2xl border-r-4 border-t-4 border-[#D4AF37]" />
                  <div className="absolute bottom-0 left-0 z-10 h-16 w-16 rounded-bl-2xl border-b-4 border-l-4 border-[#D4AF37]" />
                  <div className="absolute bottom-0 right-0 z-10 h-16 w-16 rounded-br-2xl border-b-4 border-r-4 border-[#D4AF37]" />

                  <img
                    src={selectedBasket.image}
                    alt={selectedBasket.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border-2 border-[#D4AF37]/30 bg-gradient-to-r from-white to-[#FFF9E6] p-6 shadow-md">
                  <h3
                    className="mb-3 text-3xl font-bold text-[#B71C1C]"
                    style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
                  >
                    {selectedBasket.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <p className="text-sm font-medium">
                      Ngày tạo: {selectedBasket.createdDate}
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border-2 border-[#D4AF37]/30 bg-white shadow-md">
                  <div className="bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] px-6 py-4">
                    <p className="flex items-center gap-2 text-lg font-bold text-white">
                      <Gift className="h-5 w-5" />
                      Sản phẩm trong giỏ
                    </p>
                  </div>
                  <div className="max-h-80 space-y-3 overflow-y-auto bg-gradient-to-b from-white to-[#FFFDF5] p-4">
                    {selectedBasket.items.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
                        Giỏ quà này chưa có thông tin sản phẩm chi tiết từ API.
                      </div>
                    ) : (
                      selectedBasket.items.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-center gap-4 rounded-xl border-2 border-gray-100 bg-white p-4 transition-all hover:border-[#D4AF37] hover:shadow-lg"
                        >
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-[#D4AF37]/40 bg-white shadow-md transition-transform group-hover:scale-105">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute right-0 top-0 h-0 w-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-[#D4AF37]" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="mb-1.5 text-base font-bold text-gray-900">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="rounded bg-red-50 px-2 py-0.5 font-bold text-[#B71C1C]">
                                {formatPrice(item.price)}
                              </span>
                              <span className="text-gray-400">x</span>
                              <span className="rounded bg-gray-100 px-2 py-0.5 font-bold text-gray-700">
                                {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <p className="text-xl font-bold text-[#D4AF37] drop-shadow-sm">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border-4 border-[#D4AF37] bg-gradient-to-br from-[#B71C1C] via-[#D32F2F] to-[#B71C1C] p-8 shadow-2xl">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-[#D4AF37]" />
                    <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-[#D4AF37]" />
                  </div>

                  <div className="relative z-10 flex flex-col gap-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xl font-bold tracking-wide text-white/90">
                        TỔNG GIÁ TRỊ
                      </span>
                      <div className="h-1 w-16 rounded bg-[#D4AF37]" />
                    </div>
                    <div
                      className="text-right text-5xl font-bold text-[#D4AF37] drop-shadow-2xl"
                      style={{
                        fontFamily: "'Playfair Display', 'Noto Serif', serif",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      {formatPrice(selectedBasket.total)}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => setIsViewDialogOpen(false)}
                    className="w-full rounded-xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#B71C1C] via-[#D32F2F] to-[#B71C1C] py-6 text-base font-bold text-white shadow-xl transition-all hover:from-[#8B1538] hover:via-[#B71C1C] hover:to-[#8B1538] hover:shadow-2xl"
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
