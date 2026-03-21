import { type ReactNode, useEffect } from "react";

import { ChatBot } from "@/components/common/ChatBot";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { MiniCartSidebar } from "@/components/common/MiniCartSidebar";
import { useAppNavigation } from "@/context/AppNavigationContext";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";

interface StorefrontLayoutProps {
  children: ReactNode;
}

export function StorefrontLayout({ children }: StorefrontLayoutProps) {
  const { navigate, isCartOpen, openCart, closeCart } = useAppNavigation();
  const { isLoggedIn } = useAuth();
  const { totalItems, fetchCart } = useCart();

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  return (
    <>
      <Header
        cartCount={totalItems}
        onNavigate={navigate}
        onCartClick={openCart}
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
