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
import { ForgotPassword } from "./components/ForgotPassword";
import { VerifyOTP } from "./components/VerifyOTP";
import { ResetPassword } from "./components/ResetPassword";
import { ChatBot } from "./components/ChatBot";
import useAuth from "./hooks/useAuth";
import useCart from "./hooks/useCart";

export default function App() {
  const { isLoggedIn, logout, user } = useAuth();
  const { totalItems } = useCart();
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("currentPage");
    // If admin page but not admin user, redirect to home
    if (saved === "admin" && user?.roleName !== "Admin") {
      return "home";
    }
    return saved || "home";
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Protect admin page - redirect if not admin
  useEffect(() => {
    if (currentPage === "admin" && user && user.roleName !== "Admin") {
      handleNavigate("home");
    }
  }, [currentPage, user]);

  const handleAddToCart = () => {};

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render different pages based on state
  if (currentPage === "login") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <LoginRegister onNavigate={handleNavigate} onLoginSuccess={() => {}} />
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "product") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Header
          cartCount={totalItems}
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
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "listing") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Header
          cartCount={totalItems}
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
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "individual-products") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Header
          cartCount={totalItems}
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
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "custom-builder") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Header
          cartCount={totalItems}
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
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "b2b") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Header
          cartCount={totalItems}
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
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "tracking") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Header
          cartCount={totalItems}
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
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "admin") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <AdminDashboard onNavigate={handleNavigate} />
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "checkout") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <CheckoutPage onNavigate={handleNavigate} cartCount={totalItems} />
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "profile") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Header
          cartCount={totalItems}
          onNavigate={handleNavigate}
          onCartClick={() => setIsCartOpen(true)}
          isLoggedIn={isLoggedIn}
        />
        <UserProfile onNavigate={handleNavigate} onLogout={logout} />
        <Footer />
        <MiniCartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onNavigate={handleNavigate}
        />
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "order-history") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Header
          cartCount={totalItems}
          onNavigate={handleNavigate}
          onCartClick={() => setIsCartOpen(true)}
          isLoggedIn={isLoggedIn}
        />
        <OrderHistory onNavigate={handleNavigate} onLogout={logout} />
        <Footer />
        <MiniCartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onNavigate={handleNavigate}
        />
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "change-password") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Header
          cartCount={totalItems}
          onNavigate={handleNavigate}
          onCartClick={() => setIsCartOpen(true)}
          isLoggedIn={isLoggedIn}
        />
        <ChangePassword onNavigate={handleNavigate} onLogout={logout} />
        <Footer />
        <MiniCartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onNavigate={handleNavigate}
        />
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "forgot-password") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <ForgotPassword onNavigate={handleNavigate} />
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "verify-otp") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <VerifyOTP onNavigate={handleNavigate} />
        <ChatBot />
      </div>
    );
  }

  if (currentPage === "reset-password") {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <ResetPassword onNavigate={handleNavigate} />
        <ChatBot />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <Header
        cartCount={totalItems}
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
      <ChatBot />
    </div>
  );
}
