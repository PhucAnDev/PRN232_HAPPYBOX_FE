import type { ReactNode } from "react";

import { ChatBot } from "@/components/common/ChatBot";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      {children}
      <ChatBot />
    </>
  );
}
