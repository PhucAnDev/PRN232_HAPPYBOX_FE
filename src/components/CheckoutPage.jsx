import { useState } from "react";
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
  ArrowLeft
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Header } from "./Header";
function CheckoutPage({ onNavigate, cartCount = 1 }) {
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [discountCode, setDiscountCode] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    address: ""
  });
  const cartItems = [
    {
      id: "1",
      name: "H\u1ED9p Qu\xE0 Ph\xFA Qu\xFD",
      price: 15e5,
      quantity: 1,
      image: "\u{1F381}"
    }
  ];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = shippingMethod === "standard" ? 3e4 : 5e4;
  const discount = 0;
  const total = subtotal + shippingFee - discount;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };
  const handlePlaceOrder = () => {
    console.log("Order placed:", {
      formData,
      shippingMethod,
      paymentMethod,
      total
    });
    alert("\u0110\u01A1n h\xE0ng c\u1EE7a b\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u1EB7t th\xE0nh c\xF4ng!");
  };
  return <div className="min-h-screen bg-[#FFFDF5]">
      {
    /* Use Header from Homepage */
  }
      <Header cartCount={cartCount} onNavigate={onNavigate} />

      {
    /* Main Content */
  }
      <div className="max-w-7xl mx-auto px-6 py-8">
        {
    /* Back Button */
  }
        <button
    onClick={() => onNavigate && onNavigate("home")}
    className="flex items-center space-x-2 text-gray-600 hover:text-[#B71C1C] transition-colors mb-6 group"
  >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Trở lại</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {
    /* Left Column - Customer Info & Payment (60%) */
  }
          <div className="lg:col-span-3 space-y-6">
            {
    /* Section 1: Shipping Information */
  }
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2
    className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                <Truck className="h-6 w-6 mr-3 text-[#D4AF37]" />
                Thông tin giao hàng
              </h2>

              <div className="space-y-4">
                {
    /* Full Name */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <Input
    type="text"
    placeholder="Nguyễn Văn A"
    value={formData.fullName}
    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
    className="w-full border-gray-300 rounded-lg py-3"
  />
                </div>

                {
    /* Phone & Email */
  }
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <Input
    type="tel"
    placeholder="0901234567"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    className="w-full border-gray-300 rounded-lg py-3"
  />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
    type="email"
    placeholder="email@example.com"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    className="w-full border-gray-300 rounded-lg py-3"
  />
                  </div>
                </div>

                {
    /* Address Fields */
  }
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
    value={formData.province}
    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
  >
                      <option value="">Chọn Tỉnh/TP</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="hn">Hà Nội</option>
                      <option value="dn">Đà Nẵng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <select
    value={formData.district}
    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
  >
                      <option value="">Chọn Quận/Huyện</option>
                      <option value="q1">Quận 1</option>
                      <option value="q3">Quận 3</option>
                      <option value="pn">Phú Nhuận</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phường/Xã <span className="text-red-500">*</span>
                    </label>
                    <select
    value={formData.ward}
    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
  >
                      <option value="">Chọn Phường/Xã</option>
                      <option value="p1">Phường Bến Nghé</option>
                      <option value="p2">Phường Bến Thành</option>
                      <option value="p3">Phường Nguyễn Thái Bình</option>
                    </select>
                  </div>
                </div>

                {
    /* Street Address */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số nhà, tên đường <span className="text-red-500">*</span>
                  </label>
                  <Input
    type="text"
    placeholder="123 Đường Lê Lợi"
    value={formData.address}
    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
    className="w-full border-gray-300 rounded-lg py-3"
  />
                </div>
              </div>
            </div>

            {
    /* Section 2: Shipping Method */
  }
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2
    className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                <Package className="h-6 w-6 mr-3 text-[#D4AF37]" />
                Phương thức vận chuyển
              </h2>

              <div className="space-y-3">
                {
    /* Standard Shipping */
  }
                <label
    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${shippingMethod === "standard" ? "border-[#B71C1C] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
  >
                  <div className="flex items-center space-x-3">
                    <input
    type="radio"
    name="shipping"
    value="standard"
    checked={shippingMethod === "standard"}
    onChange={(e) => setShippingMethod(e.target.value)}
    className="w-5 h-5 text-[#B71C1C] focus:ring-[#D4AF37]"
  />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Giao hàng tiêu chuẩn
                      </p>
                      <p className="text-sm text-gray-600">
                        Giao trong 3-5 ngày làm việc
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">30.000đ</span>
                </label>

                {
    /* Express Shipping */
  }
                <label
    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${shippingMethod === "express" ? "border-[#B71C1C] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
  >
                  <div className="flex items-center space-x-3">
                    <input
    type="radio"
    name="shipping"
    value="express"
    checked={shippingMethod === "express"}
    onChange={(e) => setShippingMethod(e.target.value)}
    className="w-5 h-5 text-[#B71C1C] focus:ring-[#D4AF37]"
  />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Giao hỏa tốc
                      </p>
                      <p className="text-sm text-gray-600">
                        Giao trong 1-2 ngày làm việc
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">50.000đ</span>
                </label>
              </div>
            </div>

            {
    /* Section 3: Payment Method */
  }
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2
    className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                <CreditCard className="h-6 w-6 mr-3 text-[#D4AF37]" />
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {
    /* COD */
  }
                <label
    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-[#B71C1C] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
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

                {
    /* MoMo */
  }
                <label
    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "momo" ? "border-[#B71C1C] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
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

                {
    /* Bank Transfer */
  }
                <label
    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "bank" ? "border-[#B71C1C] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
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

          {
    /* Right Column - Order Summary (40%) */
  }
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2
    className="text-2xl font-bold text-gray-900 mb-6"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                  Đơn hàng của bạn
                </h2>

                {
    /* Product List */
  }
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  {cartItems.map((item) => <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#FFFDF5] to-[#F5F5F5] flex items-center justify-center text-4xl border border-gray-200">
                          {item.image}
                        </div>
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#B71C1C] text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>)}
                </div>

                {
    /* Discount Code */
  }
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mã giảm giá
                  </label>
                  <div className="flex gap-2">
                    <Input
    type="text"
    placeholder="Nhập mã giảm giá"
    value={discountCode}
    onChange={(e) => setDiscountCode(e.target.value)}
    className="flex-1 border-gray-300 rounded-lg"
  />
                    <Button
    variant="outline"
    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
  >
                      Áp dụng
                    </Button>
                  </div>
                </div>

                {
    /* Cost Breakdown */
  }
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính</span>
                    <span className="font-semibold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold">
                      {formatCurrency(shippingFee)}
                    </span>
                  </div>
                  {discount > 0 && <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-semibold">
                        -{formatCurrency(discount)}
                      </span>
                    </div>}
                </div>

                {
    /* Total */
  }
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

                {
    /* Place Order Button */
  }
                <Button
    onClick={handlePlaceOrder}
    className="w-full bg-[#B71C1C] hover:bg-[#8B1538] text-white font-bold py-4 rounded-lg text-lg transition-all transform hover:scale-[1.02]"
  >
                  ĐẶT HÀNG NGAY
                </Button>

                {
    /* Trust Signals */
  }
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
    </div>;
}
export {
  CheckoutPage
};
