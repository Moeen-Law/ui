import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { UserStatus } from "../types"

const statusClasses: Record<UserStatus, string> = {
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  banned: "border-destructive/30 bg-destructive/10 text-destructive",
}

interface UserStatusBadgeProps {
  status: UserStatus
}

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const { t } = useTranslation()

  return (
    <Badge variant="outline" className={cn("h-8 px-3 font-bold", statusClasses[status])}>
      {t(`admin.users.status.${status}`)}
    </Badge>
  )
}
