import { Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import useThemeStore from "@/shared/store/theme"

function getSystemIsDark() {
  if (typeof window === "undefined") {
    return false
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function ThemeToggle() {
  const { t } = useTranslation()
  const { mode, setMode } = useThemeStore()
  const isDark = mode === "dark" || (mode === "system" && getSystemIsDark())
  const Icon = isDark ? Sun : Moon

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      onClick={() => setMode(isDark ? "light" : "dark")}
      aria-label={isDark ? t("chat.ui.light") : t("chat.ui.dark")}
      title={isDark ? t("chat.ui.light") : t("chat.ui.dark")}
    >
      <Icon data-icon="inline-start" />
    </Button>
  )
}
