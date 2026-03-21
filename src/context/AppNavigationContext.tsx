import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { APP_PAGES, type AppPage } from "@/constants/pages";
import {
  getHashForPage,
  getPageFromLocation,
  isAppPage,
  persistCurrentPage,
} from "@/utils/hashRouter";

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
    persistCurrentPage(currentPage);

    if (!window.location.hash || window.location.hash === "#") {
      window.location.hash = getHashForPage(currentPage);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const nextPage = getPageFromLocation(window.location);
      setCurrentPage(nextPage);
      persistCurrentPage(nextPage);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (page: string) => {
    const nextPage = isAppPage(page) ? page : APP_PAGES.HOME;

    setCurrentPage(nextPage);
    setIsCartOpen(false);
    persistCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const nextHash = getHashForPage(nextPage);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
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
