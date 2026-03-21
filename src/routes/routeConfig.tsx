import type { ComponentType } from "react";

import { APP_PAGES, type AppPage } from "@/constants/pages";
import { ChangePassword } from "@/pages/account/ChangePasswordPage";
import { OrderHistory } from "@/pages/account/OrderHistoryPage";
import { UserProfile } from "@/pages/account/UserProfilePage";
import { AdminDashboard } from "@/pages/admin/AdminDashboardPage";
import { ForgotPassword } from "@/pages/auth/ForgotPasswordPage";
import { LoginRegister } from "@/pages/auth/LoginRegisterPage";
import { ResetPassword } from "@/pages/auth/ResetPasswordPage";
import { VerifyOTP } from "@/pages/auth/VerifyOTPPage";
import { CheckoutPage } from "@/pages/checkout/CheckoutPage";
import { PaymentReturnPage } from "@/pages/checkout/PaymentReturnPage";
import { HomePage } from "@/pages/HomePage";
import { B2BLanding } from "@/pages/storefront/B2BLandingPage";
import { CustomGiftBuilder } from "@/pages/storefront/CustomGiftBuilderPage";
import { IndividualProducts } from "@/pages/storefront/IndividualProductsPage";
import { OrderTracking } from "@/pages/storefront/OrderTrackingPage";
import { ProductDetail } from "@/pages/storefront/ProductDetailPage";
import { ProductListing } from "@/pages/storefront/ProductListingPage";

export type RouteLayout = "storefront" | "auth" | "checkout" | "admin" | "bare";

export interface AppPageProps {
  onNavigate?: (page: string) => void;
}

interface RouteDefinition {
  component: ComponentType<AppPageProps>;
  layout: RouteLayout;
}

export const ROUTE_CONFIG: Record<AppPage, RouteDefinition> = {
  [APP_PAGES.HOME]: { component: HomePage, layout: "storefront" },
  [APP_PAGES.LOGIN]: { component: LoginRegister, layout: "auth" },
  [APP_PAGES.PRODUCT]: { component: ProductDetail, layout: "storefront" },
  [APP_PAGES.LISTING]: { component: ProductListing, layout: "storefront" },
  [APP_PAGES.INDIVIDUAL_PRODUCTS]: {
    component: IndividualProducts,
    layout: "storefront",
  },
  [APP_PAGES.CUSTOM_BUILDER]: {
    component: CustomGiftBuilder,
    layout: "storefront",
  },
  [APP_PAGES.B2B]: { component: B2BLanding, layout: "storefront" },
  [APP_PAGES.TRACKING]: { component: OrderTracking, layout: "storefront" },
  [APP_PAGES.ADMIN]: { component: AdminDashboard, layout: "admin" },
  [APP_PAGES.CHECKOUT]: { component: CheckoutPage, layout: "checkout" },
  [APP_PAGES.PROFILE]: { component: UserProfile, layout: "storefront" },
  [APP_PAGES.ORDER_HISTORY]: {
    component: OrderHistory,
    layout: "storefront",
  },
  [APP_PAGES.CHANGE_PASSWORD]: {
    component: ChangePassword,
    layout: "storefront",
  },
  [APP_PAGES.FORGOT_PASSWORD]: {
    component: ForgotPassword,
    layout: "auth",
  },
  [APP_PAGES.VERIFY_OTP]: { component: VerifyOTP, layout: "auth" },
  [APP_PAGES.RESET_PASSWORD]: {
    component: ResetPassword,
    layout: "auth",
  },
  [APP_PAGES.PAYMENT_RETURN]: {
    component: PaymentReturnPage,
    layout: "bare",
  },
};
