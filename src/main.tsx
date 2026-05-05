import { StrictMode, useEffect } from "react"
import type { ReactNode } from "react"
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

function DirectionWrapper({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const dir = i18n.dir() as "rtl" | "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.resolvedLanguage ?? i18n.language ?? "ar";
  }, [dir, i18n.language, i18n.resolvedLanguage]);
  
  return (
    <DirectionProvider dir={dir}>
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
