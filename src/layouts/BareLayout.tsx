import type { ReactNode } from "react";

interface BareLayoutProps {
  children: ReactNode;
}

export function BareLayout({ children }: BareLayoutProps) {
  return <>{children}</>;
}
