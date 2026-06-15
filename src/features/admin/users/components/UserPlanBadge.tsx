import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import type { User } from "../types"
import { getPrimarySubscription } from "../helpers"

interface UserPlanBadgeProps {
  user: User
}

export default function UserPlanBadge({ user }: UserPlanBadgeProps) {
  const { t } = useTranslation()
  const subscription = getPrimarySubscription(user.subscriptionInfo)
  const planName = subscription?.planName?.trim()
  const status = subscription?.status?.trim()

  if (!planName) {
    return <Badge variant="outline">{t("admin.users.plans.free")}</Badge>
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary">{planName}</Badge>
      {status ? <Badge variant="outline">{status}</Badge> : null}
    </div>
  )
}
