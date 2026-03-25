import { type ReactNode, useEffect } from "react";

import { APP_PAGES } from "@/constants/pages";
import { ChatBot } from "@/components/common/ChatBot";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { MiniCartSidebar } from "@/components/common/MiniCartSidebar";
import { useAppNavigation } from "@/context/AppNavigationContext";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import { redirectToLogin } from "@/utils/authRedirect";

interface StorefrontLayoutProps {
  children: ReactNode;
}

export function StorefrontLayout({ children }: StorefrontLayoutProps) {
  const { currentPage, navigate, isCartOpen, openCart, closeCart } =
    useAppNavigation();
  const { isLoggedIn, user } = useAuth();
  const { totalItems, fetchCart, resetState } = useCart();

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchCart();
      return;
    }

    resetState();
  }, [isLoggedIn, user?.id]);

  const handleCartClick = () => {
    if (!isLoggedIn) {
      redirectToLogin(
        navigate,
        currentPage ?? APP_PAGES.HOME,
        "Vui lòng đăng nhập để xem giỏ hàng.",
      );
      return;
    }

    openCart();
  };

  return (
    <>
      <Header
        cartCount={totalItems}
        onNavigate={navigate}
        onCartClick={handleCartClick}
        isLoggedIn={isLoggedIn}
      />
      {children}
      <Footer />
      <MiniCartSidebar
        isOpen={isCartOpen}
        onClose={closeCart}
        onNavigate={navigate}
      />
      <ChatBot />
    </>
  );
}
