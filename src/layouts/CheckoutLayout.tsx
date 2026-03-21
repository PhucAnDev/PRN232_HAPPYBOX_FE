import type { ReactNode } from "react";

import { ChatBot } from "@/components/common/ChatBot";

interface CheckoutLayoutProps {
  children: ReactNode;
}

export function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <>
      {children}
      <ChatBot />
    </>
  );
}
