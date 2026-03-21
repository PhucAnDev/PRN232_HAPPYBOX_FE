export const APP_PAGES = {
  HOME: "home",
  LOGIN: "login",
  PRODUCT: "product",
  LISTING: "listing",
  INDIVIDUAL_PRODUCTS: "individual-products",
  CUSTOM_BUILDER: "custom-builder",
  B2B: "b2b",
  TRACKING: "tracking",
  ADMIN: "admin",
  CHECKOUT: "checkout",
  PROFILE: "profile",
  ORDER_HISTORY: "order-history",
  CHANGE_PASSWORD: "change-password",
  FORGOT_PASSWORD: "forgot-password",
  VERIFY_OTP: "verify-otp",
  RESET_PASSWORD: "reset-password",
  PAYMENT_RETURN: "payment-return",
} as const;

export type AppPage = (typeof APP_PAGES)[keyof typeof APP_PAGES];

export const VALID_APP_PAGES = Object.values(APP_PAGES);
