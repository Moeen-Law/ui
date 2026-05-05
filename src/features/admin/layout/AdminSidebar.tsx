import {
  Banknote,
  Bot,
  FileText,
  Home,
  LogOut,
  Settings,
  UsersRound,
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useLogout } from "@/features/auth/hooks/useLogout"
import type { AdminNavItem } from "@/features/admin/types"
import { MoeenLogo } from "@/shared/components/MoeenLogo"
import AdminUserCard from "./AdminUserCard"

const navItems: AdminNavItem[] = [
  { label: "admin.nav.home", href: "/admin", icon: Home },
  { label: "admin.nav.users", href: "/admin/users", icon: UsersRound },
  { label: "admin.nav.contracts", href: "/admin/contracts", icon: FileText },
  { label: "admin.nav.subscriptions", href: "/admin/subscriptions", icon: Banknote },
  { label: "admin.nav.aiFeeding", href: "/admin/ai-feeding", icon: Bot },
  { label: "admin.nav.settings", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
  collapsed: boolean
  mobile?: boolean
  onNavigate?: () => void
}

export default function AdminSidebar({
  collapsed,
  mobile = false,
  onNavigate,
}: AdminSidebarProps) {
  const { t } = useTranslation()
  const { handleLogout, loading } = useLogout()
  const showLabels = !collapsed || mobile

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300",
        mobile ? "w-[300px]" : collapsed ? "w-[4.5rem]" : "w-72"
      )}
    >
      <div className={cn("flex h-[88px] items-center px-4", collapsed && !mobile && "justify-center px-0")}>
        <MoeenLogo
          size="sm"
          showText={showLabels}
          className={cn(collapsed && !mobile && "justify-center gap-0")}
          textClassName="text-xl"
        />
      </div>

      <Separator />

      <nav className="flex flex-1 flex-col gap-3 px-4 py-8">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/admin"}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group flex h-14 items-center gap-3 rounded-lg px-3 text-sm font-bold text-muted-foreground transition-all duration-200",
                  collapsed && !mobile && "justify-center px-0",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:ring-1 hover:ring-emerald-400/10"
                )
              }
            >
              <Icon className="size-5 shrink-0" />
              {showLabels && <span className="truncate">{t(item.label)}</span>}
            </NavLink>
          )
        })}
      </nav>

      <Separator />

      <div className="flex flex-col gap-3 p-4">
        <AdminUserCard collapsed={collapsed && !mobile} />

        <Button
          type="button"
          variant="ghost"
          className={cn(
            "h-12 w-full justify-start gap-3 text-red-500 cursor-pointer hover:bg-red-500/10 hover:text-red-400",
            collapsed && !mobile && "justify-center px-0"
          )}
          disabled={loading}
          onClick={handleLogout}
          aria-label={t("auth.logout")}
        >
          <LogOut data-icon="inline-start" />
          {showLabels && <span>{t("auth.logout")}</span>}
        </Button>
      </div>
    </aside>
  )
}
