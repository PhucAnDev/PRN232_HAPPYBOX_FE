import { useState } from "react";
import {
  Upload,
  Save,
  X,
  Globe,
  Phone,
  Mail,
  Shield,
  CreditCard,
  Truck,
  Eye,
  EyeOff,
  Key,
  AlertCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    websiteName: "Tetdenroi.vn",
    hotline: "1900 8888",
    email: "admin@tetdenroi.vn",
    language: "vi",
    maintenanceMode: false,
    momoApiKey: "",
    momoSecretKey: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [hasChanges, setHasChanges] = useState(false);
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };
  const handleSave = () => {
    console.log("Saving settings:", formData);
    setHasChanges(false);
    alert("\u0110\xE3 l\u01B0u thay \u0111\u1ED5i th\xE0nh c\xF4ng!");
  };
  const handleCancel = () => {
    setFormData({
      websiteName: "Tetdenroi.vn",
      hotline: "1900 8888",
      email: "admin@tetdenroi.vn",
      language: "vi",
      maintenanceMode: false,
      momoApiKey: "",
      momoSecretKey: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setHasChanges(false);
  };
  const tabs = [
    { id: "general", label: "Chung", icon: Globe },
    { id: "payment", label: "Thanh to\xE1n", icon: CreditCard },
    { id: "shipping", label: "V\u1EADn chuy\u1EC3n", icon: Truck },
    { id: "security", label: "B\u1EA3o m\u1EADt", icon: Shield }
  ];
  return <div className="p-8">
      {
    /* Header */
  }
      <div className="mb-8">
        <h1
    className="text-3xl font-bold text-gray-900 mb-2"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
          Cài Đặt Hệ Thống
        </h1>
        <p className="text-gray-600">
          Quản lý cấu hình và thiết lập cho website
        </p>
      </div>

      {
    /* Tabs Navigation */
  }
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
    const Icon = tab.icon;
    return <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-all ${activeTab === tab.id ? "text-[#B71C1C] border-b-2 border-[#B71C1C] bg-red-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
    >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>;
  })}
        </div>
      </div>

      {
    /* General Settings Tab */
  }
      {activeTab === "general" && <div className="space-y-6">
          {
    /* Website Information Section */
  }
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Thông Tin Website
              </h3>
              <p className="text-sm text-gray-600">
                Cấu hình thông tin cơ bản của website
              </p>
            </div>

            <div className="space-y-6">
              {
    /* Website Name */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Website <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
    type="text"
    value={formData.websiteName}
    onChange={(e) => handleInputChange("websiteName", e.target.value)}
    className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg"
    placeholder="Nhập tên website"
  />
                </div>
              </div>

              {
    /* Hotline */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hotline Liên Hệ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
    type="tel"
    value={formData.hotline}
    onChange={(e) => handleInputChange("hotline", e.target.value)}
    className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg"
    placeholder="1900 xxxx"
  />
                </div>
              </div>

              {
    /* Email */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Nhận Thông Báo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
    type="email"
    value={formData.email}
    onChange={(e) => handleInputChange("email", e.target.value)}
    className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg"
    placeholder="admin@example.com"
  />
                </div>
              </div>

              {
    /* Logo Upload */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo Website
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer bg-gray-50">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center border border-gray-200">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Kéo thả logo vào đây
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        hoặc click để chọn file
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      PNG, SVG, JPG (khuyến nghị: 200x60px)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {
    /* Operation Settings Section */
  }
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Cài Đặt Vận Hành
              </h3>
              <p className="text-sm text-gray-600">
                Điều chỉnh các tính năng hoạt động của hệ thống
              </p>
            </div>

            <div className="space-y-6">
              {
    /* Maintenance Mode Toggle */
  }
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Bật Chế Độ Bảo Trì
                  </p>
                  <p className="text-xs text-gray-600">
                    Khi bật, website sẽ hiển thị trang bảo trì cho khách hàng
                  </p>
                </div>
                <button
    onClick={() => handleInputChange(
      "maintenanceMode",
      !formData.maintenanceMode
    )}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${formData.maintenanceMode ? "bg-green-500" : "bg-gray-300"}`}
  >
                  <span
    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.maintenanceMode ? "translate-x-6" : "translate-x-1"}`}
  />
                </button>
              </div>

              {
    /* Language Dropdown */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngôn Ngữ Mặc Định
                </label>
                <select
    value={formData.language}
    onChange={(e) => handleInputChange("language", e.target.value)}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm"
  >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                  <option value="zh">中文 (Chinese)</option>
                </select>
              </div>
            </div>
          </div>
        </div>}

      {
    /* Payment Settings Tab */
  }
      {activeTab === "payment" && <div className="space-y-6">
          {
    /* MoMo Configuration */
  }
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Cấu Hình MoMo API
                  </h3>
                  <p className="text-sm text-gray-600">
                    Thiết lập kết nối với cổng thanh toán MoMo
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {
    /* API Key */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Partner Code / API Key <span className="text-red-500">*</span>
                </label>
                <Input
    type="text"
    value={formData.momoApiKey}
    onChange={(e) => handleInputChange("momoApiKey", e.target.value)}
    className="w-full border-gray-300 rounded-lg py-3"
    placeholder="Nhập Partner Code từ MoMo"
  />
              </div>

              {
    /* Secret Key */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Secret Key <span className="text-red-500">*</span>
                </label>
                <Input
    type="password"
    value={formData.momoSecretKey}
    onChange={(e) => handleInputChange("momoSecretKey", e.target.value)}
    className="w-full border-gray-300 rounded-lg py-3 font-mono"
    placeholder="••••••••••••••••"
  />
              </div>

              {
    /* Info Alert */
  }
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Hướng dẫn lấy API Key
                    </p>
                    <p className="text-xs text-blue-800">
                      Truy cập{" "}
                      <a
    href="https://business.momo.vn"
    className="underline font-semibold"
  >
                        MoMo Business
                      </a>{" "}
                      → Đăng nhập → Cài đặt → API Integration để lấy Partner
                      Code và Secret Key
                    </p>
                  </div>
                </div>
              </div>

              {
    /* Test Connection Button */
  }
              <Button
    variant="outline"
    className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
  >
                <CreditCard className="h-4 w-4 mr-2" />
                Kiểm Tra Kết Nối
              </Button>
            </div>
          </div>

          {
    /* VNPay Configuration */
  }
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">VN</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Cấu Hình VNPay
                  </h3>
                  <p className="text-sm text-gray-600">
                    Thiết lập kết nối với cổng thanh toán VNPay
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  TMN Code
                </label>
                <Input
    type="text"
    className="w-full border-gray-300 rounded-lg py-3"
    placeholder="Nhập TMN Code từ VNPay"
  />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hash Secret
                </label>
                <Input
    type="password"
    className="w-full border-gray-300 rounded-lg py-3 font-mono"
    placeholder="••••••••••••••••"
  />
              </div>
            </div>
          </div>
        </div>}

      {
    /* Shipping Settings Tab */
  }
      {activeTab === "shipping" && <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Cài Đặt Vận Chuyển
              </h3>
              <p className="text-sm text-gray-600">
                Quản lý các tùy chọn giao hàng
              </p>
            </div>

            <div className="space-y-6">
              {
    /* Free Shipping Threshold */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngưỡng Miễn Phí Vận Chuyển
                </label>
                <div className="relative">
                  <Input
    type="number"
    className="pl-4 pr-12 py-3 w-full border-gray-300 rounded-lg"
    placeholder="500000"
  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">
                    VND
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Đơn hàng trên giá trị này sẽ được miễn phí vận chuyển
                </p>
              </div>

              {
    /* Shipping Fee */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phí Vận Chuyển Mặc Định
                </label>
                <div className="relative">
                  <Input
    type="number"
    className="pl-4 pr-12 py-3 w-full border-gray-300 rounded-lg"
    placeholder="50000"
  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">
                    VND
                  </span>
                </div>
              </div>

              {
    /* Delivery Days */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thời Gian Giao Hàng Dự Kiến
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
    type="number"
    className="w-full border-gray-300 rounded-lg py-3"
    placeholder="2"
  />
                    <p className="text-xs text-gray-500 mt-2">Tối thiểu (ngày)</p>
                  </div>
                  <div>
                    <Input
    type="number"
    className="w-full border-gray-300 rounded-lg py-3"
    placeholder="5"
  />
                    <p className="text-xs text-gray-500 mt-2">Tối đa (ngày)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}

      {
    /* Security Settings Tab */
  }
      {activeTab === "security" && <div className="space-y-6">
          {
    /* Change Password */
  }
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Đổi Mật Khẩu Admin
              </h3>
              <p className="text-sm text-gray-600">
                Cập nhật mật khẩu đăng nhập quản trị viên
              </p>
            </div>

            <div className="space-y-6">
              {
    /* Current Password */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật Khẩu Hiện Tại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
    type={showCurrentPassword ? "text" : "password"}
    value={formData.currentPassword}
    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
    className="pl-10 pr-12 py-3 w-full border-gray-300 rounded-lg"
    placeholder="Nhập mật khẩu hiện tại"
  />
                  <button
    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {
    /* New Password */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật Khẩu Mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
    type={showNewPassword ? "text" : "password"}
    value={formData.newPassword}
    onChange={(e) => handleInputChange("newPassword", e.target.value)}
    className="pl-10 pr-12 py-3 w-full border-gray-300 rounded-lg"
    placeholder="Nhập mật khẩu mới"
  />
                  <button
    onClick={() => setShowNewPassword(!showNewPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số
                </p>
              </div>

              {
    /* Confirm Password */
  }
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Xác Nhận Mật Khẩu Mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
    type="password"
    value={formData.confirmPassword}
    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
    className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg"
    placeholder="Nhập lại mật khẩu mới"
  />
                </div>
              </div>

              {
    /* Password Strength Indicator */
  }
              {formData.newPassword && <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Độ mạnh mật khẩu:
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 h-2 bg-red-200 rounded-full overflow-hidden">
                      <div
    className="h-full bg-red-500 transition-all"
    style={{ width: "33%" }}
  />
                    </div>
                    <div className="flex-1 h-2 bg-yellow-200 rounded-full" />
                    <div className="flex-1 h-2 bg-green-200 rounded-full" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Yếu</p>
                </div>}
            </div>
          </div>

          {
    /* Two-Factor Authentication */
  }
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Xác Thực Hai Yếu Tố (2FA)
              </h3>
              <p className="text-sm text-gray-600">
                Bảo vệ tài khoản với lớp bảo mật bổ sung
              </p>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Bật Xác Thực 2FA
                </p>
                <p className="text-xs text-gray-600">
                  Yêu cầu mã OTP từ ứng dụng xác thực khi đăng nhập
                </p>
              </div>
              <button
    className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors bg-gray-300"
  >
                <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
          </div>
        </div>}

      {
    /* Sticky Action Footer */
  }
      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasChanges && <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>Bạn có thay đổi chưa lưu</span>
            </div>}
        </div>

        <div className="flex gap-3">
          <Button
    variant="outline"
    onClick={handleCancel}
    className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-3"
  >
            <X className="h-4 w-4 mr-2" />
            Hủy Bỏ
          </Button>
          <Button
    onClick={handleSave}
    className="bg-[#D4AF37] hover:bg-[#C19A6B] text-white font-semibold px-8 py-3"
  >
            <Save className="h-4 w-4 mr-2" />
            Lưu Thay Đổi
          </Button>
        </div>
      </div>
    </div>;
}
export {
  AdminSettings
};

