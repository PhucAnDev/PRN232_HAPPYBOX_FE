import { useEffect } from "react";

import { APP_PAGES } from "@/constants/pages";
import { useAppNavigation } from "@/context/AppNavigationContext";
import useAuth from "@/hooks/useAuth";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { BareLayout } from "@/layouts/BareLayout";
import { CheckoutLayout } from "@/layouts/CheckoutLayout";
import { StorefrontLayout } from "@/layouts/StorefrontLayout";
import { ROUTE_CONFIG, type RouteLayout } from "@/routes/routeConfig";

const LAYOUTS = {
  storefront: StorefrontLayout,
  auth: AuthLayout,
  checkout: CheckoutLayout,
  admin: AdminLayout,
  bare: BareLayout,
} satisfies Record<RouteLayout, typeof StorefrontLayout>;

export function AppRouter() {
  const { currentPage, navigate } = useAppNavigation();
  const { user } = useAuth();

  useEffect(() => {
    if (currentPage === APP_PAGES.ADMIN && user && user.roleName !== "Admin") {
      navigate(APP_PAGES.HOME);
    }
  }, [currentPage, user]);

  const activeRoute = ROUTE_CONFIG[currentPage] ?? ROUTE_CONFIG[APP_PAGES.HOME];
  const ActiveLayout = LAYOUTS[activeRoute.layout];
  const ActivePage = activeRoute.component;

  return (
    <ActiveLayout>
      <ActivePage onNavigate={navigate} />
    </ActiveLayout>
  );
}
