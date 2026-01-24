import { Search, User, ShoppingCart, Menu, Gift, Wine, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import logoImage from "figma:asset/a3fa2786d2f68b7a9dfd274d63677f4d0b0ab4f1.png";
function Header({ cartCount, onNavigate, onCartClick, isLoggedIn = false }) {
  const [showQuaTetDropdown, setShowQuaTetDropdown] = useState(false);
  return <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {
    /* Logo */
  }
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate?.("home")}>
            <img
    src={logoImage}
    alt="Tetdenroi.vn"
    className="h-24 w-auto"
  />
          </div>

          {
    /* Navigation - Desktop */
  }
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate?.("home")} className="text-gray-700 hover:text-[#B71C1C] font-medium transition-colors">
              Trang chủ
            </button>
            
            {
    /* Quà Tết with Dropdown */
  }
            <div
    className="relative"
    onMouseEnter={() => setShowQuaTetDropdown(true)}
    onMouseLeave={() => setShowQuaTetDropdown(false)}
  >
              <button
    onClick={() => onNavigate?.("listing")}
    className={`text-gray-700 hover:text-[#B71C1C] font-medium transition-colors relative ${showQuaTetDropdown ? "text-[#B71C1C]" : ""}`}
  >
                Quà Tết
                {showQuaTetDropdown && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B71C1C]" />}
              </button>
              
              {
    /* Dropdown Menu */
  }
              {showQuaTetDropdown && <div className="absolute top-full left-0 pt-3 -ml-4">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-3 min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
    onClick={() => onNavigate?.("listing")}
    className="w-full flex items-center px-5 py-3 hover:bg-gray-50 transition-colors group"
  >
                      <Gift className="h-5 w-5 text-[#B71C1C] mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 group-hover:text-[#B71C1C] transition-colors">Giỏ quà</div>
                        <div className="text-xs text-gray-500 mt-0.5">Gift Sets</div>
                      </div>
                    </button>
                    
                    <button
    onClick={() => onNavigate?.("individual-products")}
    className="w-full flex items-center px-5 py-3 hover:bg-gray-50 transition-colors group"
  >
                      <Wine className="h-5 w-5 text-[#B71C1C] mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 group-hover:text-[#B71C1C] transition-colors">Sản phẩm lẻ</div>
                        <div className="text-xs text-gray-500 mt-0.5">Individual Products</div>
                      </div>
                    </button>
                    
                    <button
    onClick={() => onNavigate?.("custom-builder")}
    className="w-full flex items-center px-5 py-3 hover:bg-gray-50 transition-colors group"
  >
                      <Pencil className="h-5 w-5 text-[#D4AF37] mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 group-hover:text-[#D4AF37] transition-colors">Thiết kế giỏ quà</div>
                        <div className="text-xs text-gray-500 mt-0.5">Custom Design</div>
                      </div>
                    </button>
                  </div>
                </div>}
            </div>
            
            <button onClick={() => onNavigate?.("b2b")} className="text-gray-700 hover:text-[#B71C1C] font-medium transition-colors">
              Dịch vụ Doanh nghiệp
            </button>
            <button onClick={() => onNavigate?.("tracking")} className="text-gray-700 hover:text-[#B71C1C] font-medium transition-colors">
              Tra cứu Đơn hàng
            </button>
          </nav>

          {
    /* Right Icons */
  }
          <div className="flex items-center space-x-4">
            {
    /* Search */
  }
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <Input
    type="search"
    placeholder="Tìm kiếm quà..."
    className="bg-transparent border-0 text-sm focus:ring-0 w-40"
  />
            </div>

            {
    /* User Account or Login Button */
  }
            {isLoggedIn ? <Button
    variant="ghost"
    size="icon"
    className="hidden sm:flex"
    onClick={() => onNavigate?.("profile")}
  >
                <User className="h-5 w-5 text-gray-700" />
              </Button> : <Button
    onClick={() => onNavigate?.("login")}
    className="hidden sm:flex bg-white hover:bg-gray-50 text-[#B71C1C] border-2 border-[#B71C1C] font-semibold px-6 py-2 rounded-lg transition-colors"
  >
                Đăng nhập
              </Button>}

            {
    /* Cart */
  }
            <Button
    variant="ghost"
    size="icon"
    className="relative"
    onClick={onCartClick}
  >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>}
            </Button>

            {
    /* Mobile Menu */
  }
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </div>
        </div>
      </div>
    </header>;
}
export {
  Header
};
