import { useState, useEffect } from "react";
import {
  User,
  Edit3,
  Package,
  MapPin,
  Lock,
  LogOut,
  Upload,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { getProfileThunk } from "../store/slices/authSlice";
import useAuth from "../hooks/useAuth";

interface UserProfileProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function UserProfile({ onNavigate, onLogout }: UserProfileProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, logout } = useAuth();
  const { profile, loading } = useSelector((state: RootState) => state.auth);

  const [activeSection, setActiveSection] = useState("account");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Fetch profile data when component mounts
  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  const handleSaveChanges = () => {
    // TODO: Implement update profile API when BE is ready
    alert(
      "Tính năng cập nhật thông tin đang được phát triển. Vui lòng liên hệ admin để thay đổi thông tin.",
    );
  };

  const handleLogout = () => {
    logout();
    onLogout?.();
    onNavigate?.("home");
  };

  // Show loading state
  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#B71C1C] animate-spin" />
          <p className="text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* User Summary Card */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#B71C1C] to-[#8B1538] flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-white" />
                  </div>

                  {/* Welcome Text */}
                  <h3
                    className="text-lg font-bold text-gray-900 mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Xin chào,
                  </h3>
                  <p className="text-base font-semibold text-gray-800 mb-2">
                    {profile?.fullName || user?.fullName || "Người dùng"}
                  </p>

                  {/* Edit Link */}
                  <button className="flex items-center gap-1 text-sm text-[#B71C1C] hover:text-[#8B1538] transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="font-medium">Sửa hồ sơ</span>
                  </button>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-2">
                <button
                  onClick={() => setActiveSection("account")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === "account"
                      ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Thông tin tài khoản</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection("orders");
                    onNavigate?.("order-history");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === "orders"
                      ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Quản lý đơn hàng</span>
                </button>

                <button
                  onClick={() => setActiveSection("addresses")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === "addresses"
                      ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Sổ địa chỉ</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection("password");
                    onNavigate?.("change-password");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === "password"
                      ? "bg-red-50 text-[#B71C1C] border-l-4 border-[#B71C1C] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span>Đổi mật khẩu</span>
                </button>

                <div className="border-t border-gray-100 my-2"></div>

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

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Header */}
              <div className="mb-8">
                <h1
                  className="text-3xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Hồ sơ của tôi
                </h1>
                <p className="text-gray-600">
                  Quản lý thông tin hồ sơ để bảo mật tài khoản
                </p>
                <div className="mt-4 border-b border-gray-200"></div>
              </div>

              {/* Form Layout - Split into 2 areas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Area 1: Input Fields (Left - 2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Username - Disabled */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên đăng nhập
                    </label>
                    <Input
                      type="text"
                      value={profile?.username || ""}
                      disabled
                      className="bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-gray-300 focus:border-[#B71C1C] focus:ring-[#B71C1C]"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-gray-300 focus:border-[#B71C1C] focus:ring-[#B71C1C]"
                      placeholder="example@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-gray-300 focus:border-[#B71C1C] focus:ring-[#B71C1C]"
                      placeholder="0909 123 456"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <Input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="border-gray-300 focus:border-[#B71C1C] focus:ring-[#B71C1C]"
                      placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                    />
                  </div>
                </div>

                {/* Area 2: Avatar Upload (Right - 1 column) */}
                <div className="lg:col-span-1">
                  <div className="flex flex-col items-center">
                    <label className="block text-sm font-semibold text-gray-700 mb-4 self-start lg:self-center">
                      Ảnh đại diện
                    </label>

                    {/* Avatar Preview */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#B71C1C] to-[#8B1538] flex items-center justify-center mb-4 shadow-lg">
                      <User className="w-16 h-16 text-white" />
                    </div>

                    {/* Upload Button */}
                    <Button
                      variant="outline"
                      className="mb-3 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors font-semibold"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Chọn ảnh
                    </Button>

                    {/* Note */}
                    <p className="text-xs text-gray-500 text-center px-4">
                      Dụng lượng file tối đa 1MB
                      <br />
                      Định dạng: .JPEG, .PNG
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSaveChanges}
                  className="bg-[#D4AF37] hover:bg-[#B8962E] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all text-lg"
                >
                  Lưu Thay Đổi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
