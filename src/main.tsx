import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { DirectionProvider } from "@/components/ui/direction"

import "./index.css"
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <DirectionProvider dir="rtl" direction="rtl">
        <ThemeInitializer />
        <App />
      </DirectionProvider>
    </ErrorBoundary>
  </StrictMode>
)
