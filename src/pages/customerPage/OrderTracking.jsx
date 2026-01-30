import { Search, Package, ClipboardList, Truck, CheckCircle, Phone, MapPin, Calendar, User, Mail, CreditCard } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useState } from "react";
function OrderTracking({ onNavigate }) {
  const [orderId, setOrderId] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [showResult, setShowResult] = useState(true);
  const handleSearch = (e) => {
    e.preventDefault();
    setShowResult(true);
  };
  const orderData = {
    orderId: "DH-2026-X89",
    orderDate: "15/01/2026",
    currentStatus: 2,
    // 0: Pending, 1: Processing, 2: Shipping, 3: Completed
    customer: {
      name: "Nguy\u1EC5n V\u0103n Minh",
      phone: "0909 123 456",
      email: "nguyenvanminh@email.com",
      address: "123 Nguy\u1EC5n Hu\u1EC7, Ph\u01B0\u1EDDng B\u1EBFn Ngh\xE9, Qu\u1EADn 1, TP. H\u1ED3 Ch\xED Minh"
    },
    shipping: {
      carrier: "GiaoHangNhanh",
      trackingCode: "GHN-789456123",
      estimatedDelivery: "20/01/2026",
      currentLocation: "B\u01B0u c\u1EE5c Q.1 - TP.HCM"
    },
    items: [
      {
        id: 1,
        name: "H\u1ED9p Qu\xE0 T\u1EBFt Ph\xFAc L\u1ED9c Th\u1ECD Deluxe",
        image: "https://images.unsplash.com/photo-1759563876829-47c081a2afd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjgyMjc5ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        quantity: 2,
        price: 189e4
      },
      {
        id: 2,
        name: "H\u1ED9p Qu\xE0 T\u1EBFt T\xE0i L\u1ED9c V\xE0ng Premium",
        image: "https://images.unsplash.com/photo-1728381031272-ba3f537feadd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwaGFtcGVyJTIwcmVkJTIwZ29sZHxlbnwxfHx8fDE3NjgwNjIxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        quantity: 1,
        price: 249e4
      }
    ],
    payment: {
      subtotal: 627e4,
      shippingFee: 0,
      total: 627e4
    }
  };
  const trackingSteps = [
    {
      id: 0,
      title: "Ch\u1EDD duy\u1EC7t",
      icon: ClipboardList,
      description: "\u0110\u01A1n h\xE0ng \u0111\xE3 \u0111\u01B0\u1EE3c ti\u1EBFp nh\u1EADn"
    },
    {
      id: 1,
      title: "\u0110ang x\u1EED l\xFD",
      icon: Package,
      description: "\u0110ang chu\u1EA9n b\u1ECB s\u1EA3n ph\u1EA9m"
    },
    {
      id: 2,
      title: "\u0110ang giao",
      icon: Truck,
      description: "\u0110\u01A1n h\xE0ng \u0111ang tr\xEAn \u0111\u01B0\u1EDDng giao"
    },
    {
      id: 3,
      title: "\u0110\xE3 ho\xE0n th\xE0nh",
      icon: CheckCircle,
      description: "Giao h\xE0ng th\xE0nh c\xF4ng"
    }
  ];
  return <div className="bg-[#FFFDF5] min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {
    /* Top Section - Tracking Input */
  }
      <section className="relative py-20 bg-gradient-to-br from-[#FFFDF5] via-white to-[#FFFDF5]">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
    backgroundImage: `repeating-linear-gradient(45deg, #B71C1C 0, #B71C1C 1px, transparent 0, transparent 50%)`,
    backgroundSize: "20px 20px"
  }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#B71C1C]/10 text-[#B71C1C] px-6 py-2 rounded-full text-sm font-semibold mb-6">
              <Package className="h-4 w-4 mr-2" />
              THEO DÕI ĐỞN HÀNG
            </div>
            
            <h1
    className="text-4xl md:text-5xl font-bold text-[#B71C1C] mb-4"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
              Theo Dõi Đơn Hàng Của Bạn
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nhập mã đơn hàng và số điện thoại để kiểm tra hành trình quà tặng
            </p>
          </div>

          {
    /* Search Form */
  }
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#D4AF37]/20">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {
    /* Order ID Input */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mã đơn hàng <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
    type="text"
    value={orderId}
    onChange={(e) => setOrderId(e.target.value)}
    placeholder="DH-2026-X89"
    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
  />
                  </div>
                </div>

                {
    /* Contact Info Input */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Số điện thoại / Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
    type="text"
    value={contactInfo}
    onChange={(e) => setContactInfo(e.target.value)}
    placeholder="Nhập thông tin đặt hàng"
    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
  />
                  </div>
                </div>
              </div>

              {
    /* Search Button */
  }
              <Button
    type="submit"
    className="w-full text-lg py-6 rounded-lg font-semibold hover:scale-[1.02] transition-transform shadow-lg"
    style={{ backgroundColor: "#D4AF37", color: "white" }}
  >
                <Search className="h-5 w-5 mr-2" />
                Tra cứu ngay
              </Button>
            </form>
          </div>
        </div>
      </section>

      {
    /* Bottom Section - Order Status Result */
  }
      {showResult && <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {
    /* Order Header */
  }
            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B0000] text-white rounded-t-2xl px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Đơn hàng #{orderData.orderId}
                  </h2>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Ngày đặt: {orderData.orderDate}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="inline-flex items-center bg-[#D4AF37] px-6 py-2 rounded-full font-semibold">
                    <Truck className="h-5 w-5 mr-2" />
                    Đang giao hàng
                  </div>
                </div>
              </div>
            </div>

            {
    /* Order Content Card */
  }
            <div className="bg-white rounded-b-2xl shadow-xl border-x border-b border-gray-200">
              {
    /* Progress Tracker */
  }
              <div className="px-8 py-12 border-b border-gray-200">
                <div className="relative">
                  {
    /* Progress Line */
  }
                  <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
                    <div
    className="h-full bg-gradient-to-r from-green-500 to-[#D4AF37] transition-all duration-500"
    style={{ width: `${orderData.currentStatus / (trackingSteps.length - 1) * 100}%` }}
  />
                  </div>

                  {
    /* Steps */
  }
                  <div className="relative grid grid-cols-4 gap-4">
                    {trackingSteps.map((step, index) => {
    const isCompleted = index < orderData.currentStatus;
    const isActive = index === orderData.currentStatus;
    const StepIcon = step.icon;
    return <div key={step.id} className="flex flex-col items-center">
                          {
      /* Icon */
    }
                          <div className={`
                            w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all
                            ${isCompleted ? "bg-green-500 text-white" : ""}
                            ${isActive ? "bg-[#D4AF37] text-white animate-pulse" : ""}
                            ${!isCompleted && !isActive ? "bg-gray-200 text-gray-400" : ""}
                          `}>
                            <StepIcon className="h-8 w-8" />
                          </div>

                          {
      /* Title */
    }
                          <h4 className={`
                            font-bold text-sm text-center mb-1
                            ${isCompleted || isActive ? "text-gray-900" : "text-gray-400"}
                          `}>
                            {step.title}
                          </h4>

                          {
      /* Description */
    }
                          <p className="text-xs text-gray-500 text-center hidden sm:block">
                            {step.description}
                          </p>

                          {
      /* Timestamp (only for active/completed) */
    }
                          {(isCompleted || isActive) && <p className="text-xs text-green-600 font-semibold mt-1">
                              {isActive ? "\u0110ang x\u1EED l\xFD" : "\u2713 Ho\xE0n th\xE0nh"}
                            </p>}
                        </div>;
  })}
                  </div>
                </div>

                {
    /* Current Location Info */
  }
                {orderData.currentStatus === 2 && <div className="mt-8 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Vị trí hiện tại</p>
                        <p className="text-gray-700">{orderData.shipping.currentLocation}</p>
                      </div>
                    </div>
                  </div>}
              </div>

              {
    /* Shipping Info Section */
  }
              <div className="px-8 py-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-[#B71C1C] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Thông Tin Giao Hàng
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {
    /* Column 1 - Receiver Info */
  }
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-[#D4AF37]" />
                      Người nhận
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Tên người nhận</p>
                          <p className="font-semibold text-gray-900">{orderData.customer.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Số điện thoại</p>
                          <p className="font-semibold text-gray-900">{orderData.customer.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">{orderData.customer.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                          <p className="font-semibold text-gray-900">{orderData.customer.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {
    /* Column 2 - Shipping Details */
  }
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-[#D4AF37]" />
                      Chi tiết vận chuyển
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Đơn vị vận chuyển</p>
                          <p className="font-semibold text-gray-900">{orderData.shipping.carrier}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Mã vận đơn</p>
                          <p className="font-semibold text-[#B71C1C]">{orderData.shipping.trackingCode}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Dự kiến giao hàng</p>
                          <p className="font-semibold text-gray-900">{orderData.shipping.estimatedDelivery}</p>
                        </div>
                      </div>
                    </div>

                    {
    /* Support Button */
  }
                    <div className="pt-4">
                      <Button
    variant="outline"
    className="w-full border-2 border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white font-semibold"
  >
                        <Phone className="h-4 w-4 mr-2" />
                        Liên hệ hỗ trợ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {
    /* Product Summary */
  }
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-[#B71C1C] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Sản Phẩm Trong Đơn Hàng
                </h3>

                <div className="space-y-4">
                  {orderData.items.map((item) => <div key={item.id} className="flex items-center gap-4 p-4 bg-[#FFFDF5] rounded-lg border border-gray-200">
                      <ImageWithFallback
    src={item.image}
    alt={item.name}
    className="w-20 h-20 object-cover rounded-lg"
  />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#B71C1C]">
                          {item.price.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>)}
                </div>

                {
    /* Total Summary */
  }
                <div className="mt-8 space-y-3 border-t border-gray-200 pt-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">{orderData.payment.subtotal.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold text-green-600">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold pt-3 border-t border-gray-300">
                    <span className="text-gray-900">Tổng cộng:</span>
                    <span className="text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {orderData.payment.total.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>}

      {
    /* Help Section */
  }
      <section className="py-16 bg-[#FFFDF5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-[#B71C1C] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Cần Hỗ Trợ?
          </h3>
          <p className="text-gray-600 mb-8">
            Nếu bạn có bất kỳ thắc mắc nào về đơn hàng, đừng ngần ngại liên hệ với chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
    className="rounded-full px-8 py-6 font-semibold"
    style={{ backgroundColor: "#D4AF37", color: "white" }}
  >
              <Phone className="h-5 w-5 mr-2" />
              Gọi: 1900 8888
            </Button>
            <Button
    variant="outline"
    className="rounded-full px-8 py-6 font-semibold border-2 border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
  >
              <Mail className="h-5 w-5 mr-2" />
              Email: support@tetdenroi.vn
            </Button>
          </div>
        </div>
      </section>
    </div>;
}
export {
  OrderTracking
};

