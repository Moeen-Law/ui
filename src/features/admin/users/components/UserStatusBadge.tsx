import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import type { User } from "../types"
import { getUserStatus } from "../helpers"

interface UserStatusBadgeProps {
  user: User
}

export default function UserStatusBadge({ user }: UserStatusBadgeProps) {
  const { t } = useTranslation()
  const status = getUserStatus(user)

  return (
    <Badge variant={status === "banned" ? "destructive" : "secondary"}>
      {t(`admin.users.status.${status}`)}
    </Badge>
  )
}
