import { useEffect } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";

interface MiniCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export function MiniCartSidebar({
  isOpen,
  onClose,
  onNavigate,
}: MiniCartSidebarProps) {
  const { items: cartItems, subTotal, isLoading, fetchCart, updateItem, removeItem } = useCart();

  // Fetch cart từ API khi sidebar mở lần đầu / mỗi khi mở
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleUpdateQuantity = (id: string, currentQty: number, delta: number) => {
    const newQty = Math.max(1, currentQty + delta);
    updateItem(id, newQty);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const total = subTotal;

  const handleCheckout = () => {
    onClose();
    onNavigate && onNavigate("checkout");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#D4AF37]">
          <h2
            className="text-2xl font-bold text-[#B71C1C] flex items-center space-x-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <ShoppingBag className="h-6 w-6" />
            <span>
              Giỏ Hàng{" "}
              <span className="text-[#D4AF37]">({cartItems.length})</span>
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Đóng giỏ hàng"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Product List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 h-[calc(100vh-280px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#D4AF37] border-t-transparent" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Giỏ hàng trống</p>
              <p className="text-gray-400 text-sm mt-2">
                Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-[#FFFDF5] rounded-lg border border-gray-200 hover:border-[#D4AF37] transition-colors group"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {item.displayImageUrl ? (
                      <img
                        src={item.displayImageUrl}
                        alt={item.displayName ?? ""}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gradient-to-br from-[#FFFDF5] to-[#F5F5F5] flex items-center justify-center text-3xl">
                        🎁
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">
                      {item.displayName}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {item.productSKU ?? item.giftBoxCode ?? item.itemType}
                    </p>
                    <p
                      className="font-bold text-[#D4AF37] text-base"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {formatCurrency(item.unitPrice)}
                    </p>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors"
                          aria-label="Giảm số lượng"
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="px-4 py-1 text-sm font-semibold min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors"
                          aria-label="Tăng số lượng"
                        >
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group/delete ml-auto"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="h-5 w-5 text-gray-400 group-hover/delete:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Sticky */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-6 py-5">
          {/* Summary */}
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-gray-700">
              <span className="font-semibold">Tạm tính</span>
              <span className="font-semibold">
                {formatCurrency(subTotal)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Tổng cộng
              </span>
              <span
                className="text-2xl font-bold text-[#D4AF37]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full bg-[#B71C1C] hover:bg-[#8B1538] text-white font-bold py-4 text-lg rounded-lg shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              THANH TOÁN
            </Button>
            <button
              onClick={onClose}
              className="w-full text-center text-[#B71C1C] font-semibold hover:text-[#8B1538] transition-colors py-2"
            >
              Xem chi tiết giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
