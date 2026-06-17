import {  Home, Menu } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/shared/components/LanguageToggle"
import { ThemeToggle } from "@/shared/components/ThemeToggle"

interface AdminHeaderProps {
  collapsed: boolean
  onToggleSidebar: () => void
  onOpenMobileSidebar: () => void
}  

const adminTitleKeys: Record<string, string> = {
  "/admin": "admin.overview.title",
  "/admin/users": "admin.users.title",
  "/admin/chats": "admin.chats.title",
  "/admin/contracts": "admin.nav.contracts",
  "/admin/subscriptions": "admin.payments.title",
  "/admin/ai-feeding": "admin.nav.aiFeeding",
  "/admin/settings": "admin.nav.settings",
}

export default function AdminHeader({
  collapsed,
  onToggleSidebar,
  onOpenMobileSidebar,
}: AdminHeaderProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const titleKey = adminTitleKeys[pathname] ?? "admin.overview.title"

  return (
    <header className="flex h-[88px] shrink-0 items-center justify-between border-b border-border bg-background px-5 md:px-10">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden cursor-pointer"
          onClick={onOpenMobileSidebar}
          aria-label={t("admin.actions.openSidebar")}
        >
          <Menu data-icon="inline-start" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex cursor-pointer"
          onClick={onToggleSidebar}
          aria-label={t("admin.actions.toggleSidebar")}
          aria-pressed={!collapsed}
        >
          <Menu data-icon="inline-start" />
        </Button> 
        <h1 className="text-lg font-black text-foreground md:text-2xl">
          {t(titleKey)}
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          aria-label={t("admin.actions.goHome")}
          title={t("admin.actions.goHome")}
        >
          <Link to="/">
            <Home data-icon="inline-start" />
          </Link>
        </Button>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
