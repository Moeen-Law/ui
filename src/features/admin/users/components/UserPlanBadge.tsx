import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { UserPlan } from "../types"

const planClasses: Record<UserPlan, string> = {
  professional: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300",
  free: "border-border bg-muted text-foreground",
  enterprise: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
}

interface UserPlanBadgeProps {
  plan: UserPlan
}

export default function UserPlanBadge({ plan }: UserPlanBadgeProps) {
  const { t } = useTranslation()

  return (
    <Badge variant="outline" className={cn("h-8 px-3 font-bold", planClasses[plan])}>
      {t(`admin.users.plans.${plan}`)}
    </Badge>
  )
}
