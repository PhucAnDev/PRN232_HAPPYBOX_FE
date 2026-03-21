import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { APP_PAGES, type AppPage } from "@/constants/pages";
import {
  getCanonicalUrl,
  getPathForPage,
  getPageFromLocation,
  isAppPage,
  persistCurrentPage,
} from "@/utils/appRouter";

interface AppNavigationContextValue {
  currentPage: AppPage;
  navigate: (page: string) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const AppNavigationContext = createContext<
  AppNavigationContextValue | undefined
>(undefined);

interface AppNavigationProviderProps {
  children: ReactNode;
}

export function AppNavigationProvider({
  children,
}: AppNavigationProviderProps) {
  const [currentPage, setCurrentPage] = useState<AppPage>(() =>
    getPageFromLocation(window.location),
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const nextPage = getPageFromLocation(window.location);
    const canonicalUrl = getCanonicalUrl(window.location, nextPage);
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    setCurrentPage(nextPage);
    persistCurrentPage(nextPage);

    if (currentUrl !== canonicalUrl) {
      window.history.replaceState({}, document.title, canonicalUrl);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextPage = getPageFromLocation(window.location);
      setCurrentPage(nextPage);
      persistCurrentPage(nextPage);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (page: string) => {
    const nextPage = isAppPage(page) ? page : APP_PAGES.HOME;
    const nextPath = getPathForPage(nextPage);
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    setCurrentPage(nextPage);
    setIsCartOpen(false);
    persistCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (currentUrl !== nextPath) {
      window.history.pushState({}, document.title, nextPath);
    }
  };

  return (
    <AppNavigationContext.Provider
      value={{
        currentPage,
        navigate,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </AppNavigationContext.Provider>
  );
}

export function useAppNavigation() {
  const context = useContext(AppNavigationContext);

  if (!context) {
    throw new Error(
      "useAppNavigation must be used inside AppNavigationProvider",
    );
  }

  return context;
}
