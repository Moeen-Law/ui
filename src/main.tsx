import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { DirectionProvider } from "@/components/ui/direction"


import "./index.css"
import App from "./App.tsx"
import ErrorBoundary from "./shared/components/ErrorBoundary"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <DirectionProvider dir="rtl" direction="rtl">
        <App />
      </DirectionProvider>
    </ErrorBoundary>
  </StrictMode>
)
