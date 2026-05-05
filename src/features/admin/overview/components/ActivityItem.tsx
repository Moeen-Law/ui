import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import type { ActivityItemData, ActivityTone } from "../../types"
import { AlertTriangle, Check, CreditCard, FileText } from "lucide-react"


const activityIcons = {
  success: Check,
  info: FileText,
  warning: AlertTriangle,
  billing: CreditCard,
} satisfies Record<ActivityTone, typeof Check>

const activityStyles: Record<ActivityTone, string> = {
    success: "bg-emerald-500/10 text-emerald-400",
    info: "bg-blue-500/10 text-blue-400",
    warning: "bg-amber-500/10 text-amber-400",
    billing: "bg-amber-500/10 text-amber-400",
}

interface ActivityItemProps {
  item: ActivityItemData
}

export default function ActivityItem({ item }: ActivityItemProps) {
  const { t } = useTranslation()
  const Icon = activityIcons[item.tone]

  return (
    <div className="flex items-start gap-4 text-start">
      <div className={cn("mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ring-border", activityStyles[item.tone])}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold leading-8 text-muted-foreground">
          {t(item.label)}
        </p>
        <p className="text-sm text-muted-foreground/50">{t(item.time)}</p>
      </div>
    </div>
  )
}
