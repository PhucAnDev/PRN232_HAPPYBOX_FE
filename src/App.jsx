import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ValueProposition } from "./components/ValueProposition";
import { CorporateSection } from "./components/CorporateSection";
import { CategoryGrid } from "./components/CategoryGrid";
import { BestSellers } from "./components/BestSellers";
import { Footer } from "./components/Footer";
import { ProductDetail } from "./pages/customerPage/ProductDetail";
import { ProductListing } from "./pages/customerPage/ProductListing";
import { IndividualProducts } from "./pages/customerPage/IndividualProducts";
import { CustomGiftBuilder } from "./pages/customerPage/CustomGiftBuilder";
import { LoginRegister } from "./pages/customerPage/LoginRegister";
import { B2BLanding } from "./pages/customerPage/B2BLanding";
import { OrderTracking } from "./pages/customerPage/OrderTracking";
import { AdminDashboard } from "./pages/adminPage/AdminDashboard";
import { CheckoutPage } from "./pages/customerPage/CheckoutPage";
import { MiniCartSidebar } from "./components/MiniCartSidebar";
import { UserProfile } from "./pages/customerPage/UserProfile";
import { OrderHistory } from "./pages/customerPage/OrderHistory";
import { ChangePassword } from "./pages/customerPage/ChangePassword";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
const routeMap = {
  home: "/",
  listing: "/listing",
  product: "/product",
  "individual-products": "/individual-products",
  "custom-builder": "/custom-builder",
  b2b: "/b2b",
  tracking: "/tracking",
  admin: "/admin",
  checkout: "/checkout",
  profile: "/profile",
  "order-history": "/order-history",
  "change-password": "/change-password",
  login: "/login"
};

function CustomerPageShell({
  children,
  cartCount,
  onNavigate,
  onCartClick,
  isLoggedIn,
  isCartOpen,
  onMiniCartClose
}) {
  return <div
    className="min-h-screen bg-white"
    style={{ fontFamily: "'Montserrat', sans-serif" }}
  >
      <Header
    cartCount={cartCount}
    onNavigate={onNavigate}
    onCartClick={onCartClick}
    isLoggedIn={isLoggedIn}
  />
      {children}
      <Footer />
      <MiniCartSidebar
    isOpen={isCartOpen}
    onClose={onMiniCartClose}
    onNavigate={onNavigate}
  />
    </div>;
}

function AppRoutes() {
  const [cartCount, setCartCount] = useState(4);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };
  const handleNavigate = (page) => {
    const normalized = routeMap[page] ?? "/";
    navigate(normalized);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const layoutProps = {
    cartCount,
    onNavigate: handleNavigate,
    onCartClick: openCart,
    isLoggedIn,
    isCartOpen,
    onMiniCartClose: closeCart
  };

  return <Routes>
      <Route path="/" element={<CustomerPageShell {...layoutProps}>
            <HeroSection />
            <ValueProposition />
            <CorporateSection onNavigate={handleNavigate} />
            <CategoryGrid />
            <BestSellers onAddToCart={handleAddToCart} />
          </CustomerPageShell>} />
      <Route path="/listing" element={<CustomerPageShell {...layoutProps}>
            <ProductListing onNavigate={handleNavigate} />
          </CustomerPageShell>} />
      <Route path="/product" element={<CustomerPageShell {...layoutProps}>
            <ProductDetail onNavigate={handleNavigate} />
          </CustomerPageShell>} />
      <Route path="/individual-products" element={<CustomerPageShell {...layoutProps}>
            <IndividualProducts onNavigate={handleNavigate} />
          </CustomerPageShell>} />
      <Route path="/custom-builder" element={<CustomerPageShell {...layoutProps}>
            <CustomGiftBuilder onNavigate={handleNavigate} />
          </CustomerPageShell>} />
      <Route path="/b2b" element={<CustomerPageShell {...layoutProps}>
            <B2BLanding onNavigate={handleNavigate} />
          </CustomerPageShell>} />
      <Route path="/tracking" element={<CustomerPageShell {...layoutProps}>
            <OrderTracking onNavigate={handleNavigate} />
          </CustomerPageShell>} />
      <Route path="/profile" element={<CustomerPageShell {...layoutProps}>
            <UserProfile
          onNavigate={handleNavigate}
          onLogout={() => setIsLoggedIn(false)}
        />
          </CustomerPageShell>} />
      <Route path="/order-history" element={<CustomerPageShell {...layoutProps}>
            <OrderHistory
          onNavigate={handleNavigate}
          onLogout={() => setIsLoggedIn(false)}
        />
          </CustomerPageShell>} />
      <Route path="/change-password" element={<CustomerPageShell {...layoutProps}>
            <ChangePassword
          onNavigate={handleNavigate}
          onLogout={() => setIsLoggedIn(false)}
        />
          </CustomerPageShell>} />
      <Route path="/login" element={<div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
          <LoginRegister
        onNavigate={handleNavigate}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
        </div>} />
      <Route path="/checkout" element={<div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
          <CheckoutPage onNavigate={handleNavigate} cartCount={cartCount} />
        </div>} />
      <Route path="/admin" element={<div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
          <AdminDashboard onNavigate={handleNavigate} />
        </div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>;
}

function App() {
  return <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>;
}

export {
  App as default
};
