import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CheckCircle, XCircle, Loader2, Home, ClipboardList } from "lucide-react";
import { OrderSuccess } from "@/components/common/OrderSuccess";
import type { OrderData } from "@/components/common/OrderSuccess";
import { Button } from "@/components/ui/button";
import { STORAGE_KEYS } from "@/constants/storage";
import useOrders from "@/hooks/useOrders";
import { emptyCart } from "@/store/slices/cartSlice";
import type { AppDispatch } from "@/store/store";

interface PaymentReturnPageProps {
  onNavigate?: (page: string) => void;
}

type Status = "loading" | "success" | "failed";

interface PaymentStatusData {
  orderId: string;
  resultCode: number;
  amount: number;
  localPaymentStatus: string;
  message: string;
}

interface MomoExtraDataPayload {
  orderId?: string;
  orderNumber?: string;
}

const GUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isGuid(value: string | null | undefined): value is string {
  return !!value && GUID_REGEX.test(value);
}

function decodeExtraData(extraData: string | null): MomoExtraDataPayload | null {
  if (!extraData) return null;

  try {
    const decoded = window.atob(extraData);
    return JSON.parse(decoded) as MomoExtraDataPayload;
  } catch {
    return null;
  }
}

function resolveOrderIdFromReturnUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const decodedExtraData = decodeExtraData(params.get("extraData"));

  if (isGuid(decodedExtraData?.orderId)) {
    return decodedExtraData.orderId;
  }

  const orderIdFromQuery = params.get("orderId");
  if (isGuid(orderIdFromQuery)) {
    return orderIdFromQuery;
  }

  const storedOrderId = sessionStorage.getItem(STORAGE_KEYS.MOMO_ORDER_ID);
  if (isGuid(storedOrderId)) {
    return storedOrderId;
  }

  return null;
}

function cleanupReturnUrl() {
  const cleanHash = window.location.hash || "#/payment-return";
  const cleanUrl = `${window.location.pathname}${cleanHash}`;
  window.history.replaceState({}, document.title, cleanUrl);
}

export function PaymentReturnPage({ onNavigate }: PaymentReturnPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchMomoPaymentStatus, fetchOrderDetail } = useOrders();
  const [status, setStatus] = useState<Status>("loading");
  const [paymentData, setPaymentData] = useState<PaymentStatusData | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const api = {
    get: async <T,>(url: string) => {
      const paymentMatch = url.match(/^\/Payment\/momo\/orders\/(.+)\/status$/);
      if (paymentMatch) {
        const data = await fetchMomoPaymentStatus(paymentMatch[1]);
        return {
          data: {
            success: true,
            data,
          },
        } as T;
      }

      const orderMatch = url.match(/^\/Order\/(.+)$/);
      if (orderMatch) {
        const data = await fetchOrderDetail(orderMatch[1]);
        return {
          data: {
            success: true,
            data,
          },
        } as T;
      }

      throw new Error(`Unsupported api url: ${url}`);
    },
  };

  useEffect(() => {
    const verify = async () => {
      const orderId = resolveOrderIdFromReturnUrl();
      cleanupReturnUrl();

      if (!orderId) {
        setStatus("failed");
        return;
      }

      try {
        const response = await api.get<{
          success: boolean;
          data: PaymentStatusData;
        }>(`/Payment/momo/orders/${orderId}/status`);

        if (response.data.success && response.data.data) {
          setPaymentData(response.data.data);

          if (response.data.data.resultCode === 0) {
            setStatus("success");
            sessionStorage.removeItem(STORAGE_KEYS.MOMO_ORDER_ID);

            // Fetch order details so we can render the full success screen.
            try {
              const orderRes = await api.get<{ success: boolean; data: OrderData }>(
                `/Order/${orderId}`
              );

              if (orderRes.data.success && orderRes.data.data) {
                setOrderData(orderRes.data.data);
              }
            } catch {
              // If order fetch fails, we still keep the payment success state.
              console.warn("Failed to fetch order details");
            }

            // Keep cart badge in sync after coming back from MoMo.
            try {
              await dispatch(emptyCart());
            } catch {
              // Ignore cart cleanup errors on the return screen.
            }
          } else {
            sessionStorage.removeItem(STORAGE_KEYS.MOMO_ORDER_ID);
            setStatus("failed");
          }
        } else {
          sessionStorage.removeItem(STORAGE_KEYS.MOMO_ORDER_ID);
          setStatus("failed");
        }
      } catch {
        sessionStorage.removeItem(STORAGE_KEYS.MOMO_ORDER_ID);
        setStatus("failed");
      }
    };

    verify();
  }, [dispatch]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin text-[#B71C1C] mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">Dang xac nhan thanh toan...</h2>
          <p className="text-gray-500">Vui long cho trong giay lat</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    if (orderData) {
      return <OrderSuccess orderData={orderData} onNavigate={onNavigate} />;
    }

    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center border border-gray-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-14 w-14 text-green-500" />
          </div>
          <h2
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Thanh toan thanh cong!
          </h2>
          <p className="text-gray-500 mb-6">
            Don hang cua ban da duoc xac nhan va dang duoc xu ly.
          </p>
          {paymentData?.amount != null && (
            <div className="bg-green-50 rounded-xl p-4 mb-8">
              <p className="text-sm text-gray-500 mb-1">So tien da thanh toan</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(paymentData.amount)}
              </p>
            </div>
          )}
          <div className="space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white font-bold py-4"
              onClick={() => onNavigate?.("order-history")}
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              Xem don hang cua toi
            </Button>
            <Button
              variant="outline"
              className="w-full border-2 border-gray-300 font-bold py-4"
              onClick={() => onNavigate?.("home")}
            >
              <Home className="h-5 w-5 mr-2" />
              Ve trang chu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center border border-gray-100">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-14 w-14 text-[#B71C1C]" />
        </div>
        <h2
          className="text-3xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Thanh toan that bai
        </h2>
        <p className="text-gray-500 mb-8">
          {paymentData?.message || "Giao dich khong thanh cong hoac da bi huy. Vui long thu lai."}
        </p>
        <div className="space-y-3">
          <Button
            className="w-full bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white font-bold py-4"
            onClick={() => onNavigate?.("checkout")}
          >
            Thu lai
          </Button>
          <Button
            variant="outline"
            className="w-full border-2 border-gray-300 font-bold py-4"
            onClick={() => onNavigate?.("home")}
          >
            <Home className="h-5 w-5 mr-2" />
            Ve trang chu
          </Button>
        </div>
      </div>
    </div>
  );
}
