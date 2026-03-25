import { useEffect } from "react";
import { toast } from "sonner";

import { APP_PAGES } from "@/constants/pages";
import { useAppNavigation } from "@/context/AppNavigationContext";
import useAuth from "@/hooks/useAuth";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { BareLayout } from "@/layouts/BareLayout";
import { CheckoutLayout } from "@/layouts/CheckoutLayout";
import { StorefrontLayout } from "@/layouts/StorefrontLayout";
import { ROUTE_CONFIG, type RouteLayout } from "@/routes/routeConfig";
import {
  AUTH_REQUIRED_PAGES,
  redirectToLogin,
} from "@/utils/authRedirect";

const LAYOUTS = {
  storefront: StorefrontLayout,
  auth: AuthLayout,
  checkout: CheckoutLayout,
  admin: AdminLayout,
  bare: BareLayout,
} satisfies Record<RouteLayout, typeof StorefrontLayout>;

export function AppRouter() {
  const { currentPage, navigate } = useAppNavigation();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (currentPage === APP_PAGES.ADMIN) {
      if (!isLoggedIn) {
        redirectToLogin(
          navigate,
          APP_PAGES.ADMIN,
          "Vui lòng đăng nhập để truy cập trang quản trị.",
        );
        return;
      }

      if (user?.roleName !== "Admin") {
        toast.error("Bạn không có quyền truy cập trang quản trị.");
        navigate(APP_PAGES.HOME);
      }
      return;
    }

    if (AUTH_REQUIRED_PAGES.has(currentPage) && !isLoggedIn) {
      redirectToLogin(navigate, currentPage);
    }
  }, [currentPage, isLoggedIn, navigate, user]);

  if (currentPage === APP_PAGES.ADMIN) {
    if (!isLoggedIn || user?.roleName !== "Admin") {
      return null;
    }
  }

  if (AUTH_REQUIRED_PAGES.has(currentPage) && !isLoggedIn) {
    return null;
  }

  const activeRoute = ROUTE_CONFIG[currentPage] ?? ROUTE_CONFIG[APP_PAGES.HOME];
  const ActiveLayout = LAYOUTS[activeRoute.layout];
  const ActivePage = activeRoute.component;

  return (
    <ActiveLayout>
      <ActivePage onNavigate={navigate} />
    </ActiveLayout>
  );
}
