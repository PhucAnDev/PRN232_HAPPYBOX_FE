import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CheckCircle, XCircle, Loader2, Home, ClipboardList } from "lucide-react";
import { Button } from "./ui/button";
import api from "../services/api";
import { emptyCart } from "../store/slices/cartSlice";
import type { AppDispatch } from "../store/store";
import type { OrderData } from "./OrderSuccess";
import { OrderSuccess } from "./OrderSuccess";

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

export function PaymentReturnPage({ onNavigate }: PaymentReturnPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState<Status>("loading");
  const [paymentData, setPaymentData] = useState<PaymentStatusData | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const verify = async () => {
      const storedOrderId = sessionStorage.getItem("momoOrderId");
      if (!storedOrderId) {
        setStatus("failed");
        return;
      }

      try {
        const response = await api.get<{
          success: boolean;
          data: PaymentStatusData;
        }>(`/Payment/momo/orders/${storedOrderId}/status`);

        if (response.data.success && response.data.data) {
          setPaymentData(response.data.data);
          if (response.data.data.resultCode === 0) {
            setStatus("success");
            sessionStorage.removeItem("momoOrderId");

            // ✅ FIX: Fetch order details to display full order info
            try {
              const orderRes = await api.get<{ success: boolean; data: OrderData }>(
                `/Order/${storedOrderId}`
              );
              if (orderRes.data.success && orderRes.data.data) {
                setOrderData(orderRes.data.data);
              }
            } catch {
              // If order fetch fails, still show payment success
              console.warn("Failed to fetch order details");
            }

            // Xóa cart qua Redux để đồng bộ store (badge header cập nhật đúng)
            try { await dispatch(emptyCart()); } catch { /* bỏ qua nếu lỗi */ }
          } else {
            // Xóa orderId khi thất bại để tránh verify lại lần sau
            sessionStorage.removeItem("momoOrderId");
            setStatus("failed");
          }
        } else {
          sessionStorage.removeItem("momoOrderId");
          setStatus("failed");
        }
      } catch {
        sessionStorage.removeItem("momoOrderId");
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
          <h2 className="text-2xl font-bold text-gray-800">Đang xác nhận thanh toán...</h2>
          <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    // If we have full order data, show OrderSuccess component
    if (orderData) {
      return <OrderSuccess orderData={orderData} onNavigate={onNavigate} />;
    }

    // Fallback if order fetch failed - show payment success info
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
            Thanh toán thành công!
          </h2>
          <p className="text-gray-500 mb-6">
            Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </p>
          {paymentData?.amount != null && (
            <div className="bg-green-50 rounded-xl p-4 mb-8">
              <p className="text-sm text-gray-500 mb-1">Số tiền đã thanh toán</p>
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
              Xem đơn hàng của tôi
            </Button>
            <Button
              variant="outline"
              className="w-full border-2 border-gray-300 font-bold py-4"
              onClick={() => onNavigate?.("home")}
            >
              <Home className="h-5 w-5 mr-2" />
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // status === "failed"
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
          Thanh toán thất bại
        </h2>
        <p className="text-gray-500 mb-8">
          Giao dịch không thành công hoặc đã bị hủy. Vui lòng thử lại.
        </p>
        <div className="space-y-3">
          <Button
            className="w-full bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white font-bold py-4"
            onClick={() => onNavigate?.("checkout")}
          >
            Thử lại
          </Button>
          <Button
            variant="outline"
            className="w-full border-2 border-gray-300 font-bold py-4"
            onClick={() => onNavigate?.("home")}
          >
            <Home className="h-5 w-5 mr-2" />
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
