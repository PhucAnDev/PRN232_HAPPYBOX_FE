import { useState, useEffect } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
function MiniCartSidebar({
  isOpen,
  onClose,
  onNavigate
}) {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "H\u1ED9p Qu\xE0 Ph\xFA Qu\xFD 2025",
      variant: "M\xE0u \u0110\u1ECF - R\u01B0\u1EE3u Vang",
      price: 15e5,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1761479267954-983e006443f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
    },
    {
      id: "2",
      name: "Vang \u0110\u1ECF Chile Nh\u1EADp Kh\u1EA9u",
      variant: "750ml - Premium",
      price: 5e5,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1615212995098-3c2aebfff863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
    },
    {
      id: "3",
      name: "Set Qu\xE0 T\u1EBFt An Khang",
      variant: "B\xE1nh K\u1EB9o Cao C\u1EA5p - H\u1ED9p G\u1ED7",
      price: 12e5,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1580364545822-71c817ec6c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
    },
    {
      id: "4",
      name: "Hamper Sang Tr\u1ECDng Deluxe",
      variant: "Tr\xE1i C\xE2y & R\u01B0\u1EE3u - Gi\u1ECF Tre",
      price: 32e5,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1759563874833-d8f97cef9d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
    }
  ]);
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };
  const updateQuantity = (id, delta) => {
    setCartItems(
      (items) => items.map(
        (item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };
  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;
  const handleCheckout = () => {
    onClose();
    onNavigate && onNavigate("checkout");
  };
  return <>
      {
    /* Overlay */
  }
      <div
    className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isOpen ? "opacity-50" : "opacity-0 pointer-events-none"}`}
    onClick={onClose}
  />

      {
    /* Drawer */
  }
      <div
    className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
  >
        {
    /* Header */
  }
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

        {
    /* Product List - Scrollable */
  }
        <div className="flex-1 overflow-y-auto px-6 py-4 h-[calc(100vh-280px)]">
          {cartItems.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Giỏ hàng trống</p>
              <p className="text-gray-400 text-sm mt-2">
                Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
              </p>
            </div> : <div className="space-y-4">
              {cartItems.map((item) => <div
    key={item.id}
    className="flex gap-4 p-4 bg-[#FFFDF5] rounded-lg border border-gray-200 hover:border-[#D4AF37] transition-colors group"
  >
                  {
    /* Product Image */
  }
                  <div className="flex-shrink-0">
                    <img
    src={item.image}
    alt={item.name}
    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
  />
                  </div>

                  {
    /* Product Info */
  }
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{item.variant}</p>
                    <p
    className="font-bold text-[#D4AF37] text-base"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                      {formatCurrency(item.price)}
                    </p>

                    {
    /* Quantity Control */
  }
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
    onClick={() => updateQuantity(item.id, -1)}
    className="p-1.5 hover:bg-gray-100 transition-colors"
    aria-label="Giảm số lượng"
  >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="px-4 py-1 text-sm font-semibold min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
    onClick={() => updateQuantity(item.id, 1)}
    className="p-1.5 hover:bg-gray-100 transition-colors"
    aria-label="Tăng số lượng"
  >
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>

                      {
    /* Delete Button */
  }
                      <button
    onClick={() => removeItem(item.id)}
    className="p-2 hover:bg-red-50 rounded-lg transition-colors group/delete ml-auto"
    aria-label="Xóa sản phẩm"
  >
                        <Trash2 className="h-5 w-5 text-gray-400 group-hover/delete:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>}
        </div>

        {
    /* Footer - Sticky */
  }
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-6 py-5">
          {
    /* Summary */
  }
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-gray-700">
              <span className="font-semibold">Tạm tính</span>
              <span className="font-semibold">
                {formatCurrency(subtotal)}
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

          {
    /* Action Buttons */
  }
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
    </>;
}
export {
  MiniCartSidebar
};
