import { useState } from "react";
import {
  User,
  Edit3,
  Package,
  MapPin,
  Lock,
  LogOut,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
function ChangePassword({ onNavigate, onLogout }) {
  const [activeSection, setActiveSection] = useState("password");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Vui l\xF2ng \u0111i\u1EC1n \u0111\u1EA7y \u0111\u1EE7 th\xF4ng tin!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("M\u1EADt kh\u1EA9u m\u1EDBi v\xE0 x\xE1c nh\u1EADn m\u1EADt kh\u1EA9u kh\xF4ng kh\u1EDBp!");
      return;
    }
    if (newPassword.length < 8) {
      alert("M\u1EADt kh\u1EA9u ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 8 k\xFD t\u1EF1!");
      return;
    }
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasUppercase || !hasNumber) {
      alert("M\u1EADt kh\u1EA9u ph\u1EA3i bao g\u1ED3m ch\u1EEF hoa v\xE0 s\u1ED1!");
      return;
    }
    alert("M\u1EADt kh\u1EA9u \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt th\xE0nh c\xF4ng!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  const handleLogout = () => {
    onLogout?.();
    onNavigate?.("home");
  };
  return <div className="min-h-screen bg-[#F9F9F9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {
    /* Left Sidebar - Navigation (Same as Profile) */
  }
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {
    /* User Summary Card */
  }
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col items-center text-center">
                  {
    /* Avatar */
  }
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#B71C1C] to-[#8B1538] flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-white" />
                  </div>

                  {
    /* Welcome Text */
  }
                  <h3
    className="text-lg font-bold text-gray-900 mb-1"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                    Xin chào,
                  </h3>
                  <p className="text-base font-semibold text-gray-800 mb-2">
                    Nguyễn Văn An
                  </p>

                  {
    /* Edit Link */
  }
                  <button className="flex items-center gap-1 text-sm text-[#B71C1C] hover:text-[#8B1538] transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="font-medium">Sửa hồ sơ</span>
                  </button>
                </div>
              </div>

              {
    /* Navigation Menu */
  }
              <nav className="p-2">
                <button
    onClick={() => {
      setActiveSection("account");
      onNavigate?.("profile");
    }}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === "account" ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
  >
                  <User className="w-5 h-5" />
                  <span>Thông tin tài khoản</span>
                </button>

                <button
    onClick={() => {
      setActiveSection("orders");
      onNavigate?.("order-history");
    }}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === "orders" ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
  >
                  <Package className="w-5 h-5" />
                  <span>Quản lý đơn hàng</span>
                </button>

                <button
    onClick={() => setActiveSection("addresses")}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === "addresses" ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
  >
                  <MapPin className="w-5 h-5" />
                  <span>Sổ địa chỉ</span>
                </button>

                <button
    onClick={() => setActiveSection("password")}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === "password" ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
  >
                  <Lock className="w-5 h-5" />
                  <span>Đổi mật khẩu</span>
                </button>

                <div className="border-t border-gray-100 my-2" />

                <button
    onClick={handleLogout}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-[#B71C1C] transition-all"
  >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>
          </div>

          {
    /* Right Column - Change Password Form */
  }
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {
    /* Header with Security Icon */
  }
              <div className="mb-8">
                <div className="flex items-start gap-4 mb-4">
                  {
    /* Security Lock Icon */
  }
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-[#B71C1C]" />
                  </div>

                  <div className="flex-1">
                    <h1
    className="text-3xl font-bold text-gray-900 mb-2"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                      Đổi mật khẩu
                    </h1>
                    <p className="text-gray-600">
                      Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.
                    </p>
                  </div>
                </div>
                <div className="border-b border-gray-200" />
              </div>

              {
    /* Password Form */
  }
              <div className="max-w-2xl">
                <div className="space-y-6">
                  {
    /* Current Password */
  }
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <Input
    type={showCurrentPassword ? "text" : "password"}
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    placeholder="Nhập mật khẩu hiện tại của bạn"
    className="pr-10 border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
  />
                      <button
    type="button"
    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
  >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {
    /* New Password */
  }
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <Input
    type={showNewPassword ? "text" : "password"}
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    placeholder="Nhập mật khẩu mới"
    className="pr-10 border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
  />
                      <button
    type="button"
    onClick={() => setShowNewPassword(!showNewPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
  >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa và số.
                    </p>
                  </div>

                  {
    /* Confirm New Password */
  }
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <Input
    type={showConfirmPassword ? "text" : "password"}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Nhập lại mật khẩu mới"
    className="pr-10 border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
  />
                      <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
  >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {
    /* Forgot Password Link */
  }
                  <div className="text-right">
                    <button className="text-sm text-[#B71C1C] hover:text-[#8B1538] font-medium transition-colors">
                      Bạn quên mật khẩu?
                    </button>
                  </div>
                </div>

                {
    /* Action Buttons */
  }
                <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
                  <Button
    onClick={handleUpdatePassword}
    className="bg-[#D4AF37] hover:bg-[#B8962E] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all text-lg"
  >
                    Cập nhật mật khẩu
                  </Button>
                  <Button
    onClick={handleCancel}
    variant="outline"
    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all"
  >
                    Hủy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
export {
  ChangePassword
};

