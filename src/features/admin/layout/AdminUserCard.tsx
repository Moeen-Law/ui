import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { useMe } from "@/features/auth/hooks/useMe";

interface AdminUserCardProps {
  collapsed: boolean
}

export default function AdminUserCard({ collapsed }: AdminUserCardProps) {
  const { t } = useTranslation()
  const { profile } = useMe();
  
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/60 p-2 transition-colors hover:border-emerald-400/25 hover:bg-card",
        collapsed && "flex justify-center border-transparent bg-transparent p-0 hover:bg-transparent"
      )}
    >
      <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
        <div className="relative shrink-0">
          <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-emerald-500/10 text-sm font-black text-emerald-200 shadow-inner">
            {profile?.name[0].toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -end-1 size-3.5 rounded-full border-2 border-sidebar bg-emerald-400" />
        </div>

        {!collapsed && (
          <div className="min-w-0 flex flex-col text-end">
            <span className="truncate text-sm font-black text-foreground">
              {profile?.name}
            </span>
            <span className="truncate text-xs font-medium text-muted-foreground">
              {t("admin.profile.role")}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
