import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { DirectionProvider } from "@/components/ui/direction"

import "./index.css"
import "./lib/i18n" // Import i18n configuration
import { useTranslation } from "react-i18next"

import App from "./App.tsx"
import ErrorBoundary from "./shared/components/ErrorBoundary"
import useThemeStore, { applyTheme, setupSystemListener } from "./shared/store/theme"

function ThemeInitializer() {
    const { mode } = useThemeStore();

    useEffect(() => {
        applyTheme(mode);
        const cleanup = setupSystemListener(mode);
        return cleanup;
    }, [mode]);

    return null;
}

function DirectionWrapper({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  // `dir` will be "rtl" for "ar" and "ltr" for "en"
  const dir = i18n.dir() as "rtl" | "ltr";
  
  return (
    <DirectionProvider dir={dir} direction={dir}>
      {children}
    </DirectionProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <DirectionWrapper>
        <ThemeInitializer />
        <App />
      </DirectionWrapper>
    </ErrorBoundary>
  </StrictMode>
)
