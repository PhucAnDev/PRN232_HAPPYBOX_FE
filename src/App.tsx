import { useEffect } from "react";
import { Toaster } from "sonner";

import { AppNavigationProvider } from "@/context/AppNavigationContext";
import useAuthSessionSync from "@/hooks/useAuthSessionSync";
import { AppRouter } from "@/routes/AppRouter";

export default function App() {
  useAuthSessionSync();

  useEffect(() => {
    const existingFonts = document.getElementById("app-fonts");
    if (existingFonts) {
      return;
    }

    const link = document.createElement("link");
    link.id = "app-fonts";
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, []);

  return (
    <AppNavigationProvider>
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Toaster position="top-right" richColors duration={2000} />
        <AppRouter />
      </div>
    </AppNavigationProvider>
  );
}
