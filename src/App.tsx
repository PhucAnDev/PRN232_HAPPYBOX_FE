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
import { PaymentReturnPage } from "./components/PaymentReturnPage";
import { ChatBot } from "./components/ChatBot";
import useAuth from "./hooks/useAuth";
import useCart from "./hooks/useCart";
import { Toaster } from "sonner";

export default function App() {
  const { isLoggedIn, logout, user } = useAuth();
  const { totalItems } = useCart();
  const [currentPage, setCurrentPage] = useState(() => {
    // Detect MoMo return redirect (MoMo appends resultCode + requestId as query params)
    const params = new URLSearchParams(window.location.search);
    if (params.has("resultCode") && params.has("requestId")) {
      return "payment-return";
    }

    // Try URL hash first — supports reload-persistence and bookmarking
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const path = hash.slice(1); // e.g. "/admin/orders" or "/listing"
      const page = path.startsWith("/") ? path.slice(1).split("/")[0] : path.split("/")[0];
      const validPages = ["home", "login", "product", "listing", "individual-products", "custom-builder", "b2b", "tracking", "admin", "checkout", "profile", "order-history", "change-password", "forgot-password", "verify-otp", "reset-password", "payment-return"];
      if (page && validPages.includes(page)) return page;
    }
    // Fallback to localStorage
    return localStorage.getItem("currentPage") || "home";
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

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
    setPageLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setCurrentPage(page);
      localStorage.setItem("currentPage", page);
      const newHash = page === "home" ? "#/" : `#/${page}`;
      if (window.location.hash !== newHash) {
        window.location.hash = newHash;
      }
      setPageLoading(false);
    }, 400);
  };

  // Set initial hash on first load if URL has no hash yet
  useEffect(() => {
    if (!window.location.hash || window.location.hash === "#") {
      window.location.hash = currentPage === "home" ? "#/" : `#/${currentPage}`;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for browser back/forward button navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let page = "home";
      if (hash && hash.length > 1) {
        const path = hash.slice(1);
        const p = path.startsWith("/") ? path.slice(1).split("/")[0] : path.split("/")[0];
        const validPages = ["home", "login", "product", "listing", "individual-products", "custom-builder", "b2b", "tracking", "admin", "checkout", "profile", "order-history", "change-password", "forgot-password", "verify-otp", "reset-password", "payment-return"];
        if (p && validPages.includes(p)) page = p;
      }
      setCurrentPage((prev) => {
        if (prev !== page) localStorage.setItem("currentPage", page);
        return page;
      });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderContent = () => {
    if (currentPage === "login") {
      return (
        <>
          <LoginRegister onNavigate={handleNavigate} onLoginSuccess={() => {}} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "product") {
      return (
        <>
          <Header cartCount={totalItems} onNavigate={handleNavigate} onCartClick={() => setIsCartOpen(true)} isLoggedIn={isLoggedIn} />
          <ProductDetail onNavigate={handleNavigate} />
          <Footer />
          <MiniCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "listing") {
      return (
        <>
          <Header cartCount={totalItems} onNavigate={handleNavigate} onCartClick={() => setIsCartOpen(true)} isLoggedIn={isLoggedIn} />
          <ProductListing onNavigate={handleNavigate} />
          <Footer />
          <MiniCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "individual-products") {
      return (
        <>
          <Header cartCount={totalItems} onNavigate={handleNavigate} onCartClick={() => setIsCartOpen(true)} isLoggedIn={isLoggedIn} />
          <IndividualProducts onNavigate={handleNavigate} />
          <Footer />
          <MiniCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "custom-builder") {
      return (
        <>
          <Header cartCount={totalItems} onNavigate={handleNavigate} onCartClick={() => setIsCartOpen(true)} isLoggedIn={isLoggedIn} />
          <CustomGiftBuilder onNavigate={handleNavigate} />
          <Footer />
          <MiniCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "b2b") {
      return (
        <>
          <Header cartCount={totalItems} onNavigate={handleNavigate} onCartClick={() => setIsCartOpen(true)} isLoggedIn={isLoggedIn} />
          <B2BLanding  />
          <Footer />
          <MiniCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "tracking") {
      return (
        <>
          <Header cartCount={totalItems} onNavigate={handleNavigate} onCartClick={() => setIsCartOpen(true)} isLoggedIn={isLoggedIn} />
          <OrderTracking />
          <Footer />
          <MiniCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "admin") {
      return <AdminDashboard onNavigate={handleNavigate} />;
    }

    if (currentPage === "checkout") {
      return (
        <>
          <CheckoutPage onNavigate={handleNavigate} cartCount={totalItems} isLoggedIn={isLoggedIn} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "payment-return") {
      return <PaymentReturnPage onNavigate={handleNavigate} />;
    }

    if (currentPage === "profile") {
      return (
        <>
          <Header cartCount={totalItems} onNavigate={handleNavigate} onCartClick={() => setIsCartOpen(true)} isLoggedIn={isLoggedIn} />
          <UserProfile onNavigate={handleNavigate} onLogout={logout} />
          <Footer />
          <MiniCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "order-history") {
      return (
        <>
          <Header cartCount={totalItems} onNavigate={handleNavigate} onCartClick={() => setIsCartOpen(true)} isLoggedIn={isLoggedIn} />
          <OrderHistory onNavigate={handleNavigate} onLogout={logout} />
          <Footer />
          <MiniCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "change-password") {
      return (
        <>
          <Header cartCount={totalItems} onNavigate={handleNavigate} onCartClick={() => setIsCartOpen(true)} isLoggedIn={isLoggedIn} />
          <ChangePassword onNavigate={handleNavigate} onLogout={logout} />
          <Footer />
          <MiniCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "forgot-password") {
      return (
        <>
          <ForgotPassword onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "verify-otp") {
      return (
        <>
          <VerifyOTP onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    if (currentPage === "reset-password") {
      return (
        <>
          <ResetPassword onNavigate={handleNavigate} />
          <ChatBot />
        </>
      );
    }

    return (
      <>
        <Header cartCount={totalItems} onNavigate={handleNavigate} onCartClick={() => setIsCartOpen(true)} isLoggedIn={isLoggedIn} />
        <HeroSection />
        <ValueProposition />
        <CorporateSection onNavigate={handleNavigate} />
        <CategoryGrid />
        <BestSellers onAddToCart={handleAddToCart} />
        <Footer />
        <MiniCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={handleNavigate} />
        <ChatBot />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Toaster position="top-right" richColors />
      {/* {pageLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F9F9F9]">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#B71C1C] mb-4"></div>
          <p className="text-gray-500 text-sm tracking-wide">Đang tải...</p>
        </div>
      )} */}
      {renderContent()}
    </div>
  );
}
