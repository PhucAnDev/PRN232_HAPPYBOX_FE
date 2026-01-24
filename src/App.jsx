import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ValueProposition } from "./components/ValueProposition";
import { CorporateSection } from "./components/CorporateSection";
import { CategoryGrid } from "./components/CategoryGrid";
import { BestSellers } from "./components/BestSellers";
import { Footer } from "./components/Footer";
import { ProductDetail } from "./components/ProductDetail";
import { ProductListing } from "./components/ProductListing";
import { IndividualProducts } from "./components/IndividualProducts";
import { CustomGiftBuilder } from "./components/CustomGiftBuilder";
import { LoginRegister } from "./components/LoginRegister";
import { B2BLanding } from "./components/B2BLanding";
import { OrderTracking } from "./components/OrderTracking";
import { AdminDashboard } from "./components/AdminDashboard";
import { CheckoutPage } from "./components/CheckoutPage";
import { MiniCartSidebar } from "./components/MiniCartSidebar";
import { UserProfile } from "./components/UserProfile";
import { OrderHistory } from "./components/OrderHistory";
import { ChangePassword } from "./components/ChangePassword";
function App() {
  const [cartCount, setCartCount] = useState(4);
  const [currentPage, setCurrentPage] = useState("home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (currentPage === "login") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <LoginRegister
      onNavigate={handleNavigate}
      onLoginSuccess={() => setIsLoggedIn(true)}
    />
      </div>;
  }
  if (currentPage === "product") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <Header
      cartCount={cartCount}
      onNavigate={handleNavigate}
      onCartClick={() => setIsCartOpen(true)}
      isLoggedIn={isLoggedIn}
    />
        <ProductDetail onNavigate={handleNavigate} />
        <Footer />
        <MiniCartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      onNavigate={handleNavigate}
    />
      </div>;
  }
  if (currentPage === "listing") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <Header
      cartCount={cartCount}
      onNavigate={handleNavigate}
      onCartClick={() => setIsCartOpen(true)}
      isLoggedIn={isLoggedIn}
    />
        <ProductListing onNavigate={handleNavigate} />
        <Footer />
        <MiniCartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      onNavigate={handleNavigate}
    />
      </div>;
  }
  if (currentPage === "individual-products") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <Header
      cartCount={cartCount}
      onNavigate={handleNavigate}
      onCartClick={() => setIsCartOpen(true)}
      isLoggedIn={isLoggedIn}
    />
        <IndividualProducts onNavigate={handleNavigate} />
        <Footer />
        <MiniCartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      onNavigate={handleNavigate}
    />
      </div>;
  }
  if (currentPage === "custom-builder") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <Header
      cartCount={cartCount}
      onNavigate={handleNavigate}
      onCartClick={() => setIsCartOpen(true)}
      isLoggedIn={isLoggedIn}
    />
        <CustomGiftBuilder onNavigate={handleNavigate} />
        <Footer />
        <MiniCartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      onNavigate={handleNavigate}
    />
      </div>;
  }
  if (currentPage === "b2b") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <Header
      cartCount={cartCount}
      onNavigate={handleNavigate}
      onCartClick={() => setIsCartOpen(true)}
      isLoggedIn={isLoggedIn}
    />
        <B2BLanding onNavigate={handleNavigate} />
        <Footer />
        <MiniCartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      onNavigate={handleNavigate}
    />
      </div>;
  }
  if (currentPage === "tracking") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <Header
      cartCount={cartCount}
      onNavigate={handleNavigate}
      onCartClick={() => setIsCartOpen(true)}
      isLoggedIn={isLoggedIn}
    />
        <OrderTracking />
        <Footer />
        <MiniCartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      onNavigate={handleNavigate}
    />
      </div>;
  }
  if (currentPage === "admin") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <AdminDashboard onNavigate={handleNavigate} />
      </div>;
  }
  if (currentPage === "checkout") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <CheckoutPage onNavigate={handleNavigate} cartCount={cartCount} />
      </div>;
  }
  if (currentPage === "profile") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <Header
      cartCount={cartCount}
      onNavigate={handleNavigate}
      onCartClick={() => setIsCartOpen(true)}
      isLoggedIn={isLoggedIn}
    />
        <UserProfile
      onNavigate={handleNavigate}
      onLogout={() => setIsLoggedIn(false)}
    />
        <Footer />
        <MiniCartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      onNavigate={handleNavigate}
    />
      </div>;
  }
  if (currentPage === "order-history") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <Header
      cartCount={cartCount}
      onNavigate={handleNavigate}
      onCartClick={() => setIsCartOpen(true)}
      isLoggedIn={isLoggedIn}
    />
        <OrderHistory
      onNavigate={handleNavigate}
      onLogout={() => setIsLoggedIn(false)}
    />
        <Footer />
        <MiniCartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      onNavigate={handleNavigate}
    />
      </div>;
  }
  if (currentPage === "change-password") {
    return <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
        <Header
      cartCount={cartCount}
      onNavigate={handleNavigate}
      onCartClick={() => setIsCartOpen(true)}
      isLoggedIn={isLoggedIn}
    />
        <ChangePassword
      onNavigate={handleNavigate}
      onLogout={() => setIsLoggedIn(false)}
    />
        <Footer />
        <MiniCartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      onNavigate={handleNavigate}
    />
      </div>;
  }
  return <div
    className="min-h-screen bg-white"
    style={{ fontFamily: "'Montserrat', sans-serif" }}
  >
      <Header
    cartCount={cartCount}
    onNavigate={handleNavigate}
    onCartClick={() => setIsCartOpen(true)}
    isLoggedIn={isLoggedIn}
  />
      <HeroSection />
      <ValueProposition />
      <CorporateSection onNavigate={handleNavigate} />
      <CategoryGrid />
      <BestSellers onAddToCart={handleAddToCart} />
      <Footer />
      <MiniCartSidebar
    isOpen={isCartOpen}
    onClose={() => setIsCartOpen(false)}
    onNavigate={handleNavigate}
  />
    </div>;
}
export {
  App as default
};
