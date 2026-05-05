import { useTranslation } from "react-i18next"
import type { AdminUser, UserActionType } from "../types"
import UserActions from "./UserActions"
import UserIdentityCell from "./UserIdentityCell"
import UserPlanBadge from "./UserPlanBadge"
import UserStatusBadge from "./UserStatusBadge"

interface UsersTableRowProps {
  user: AdminUser
  locale: "ar" | "en"
  onRequestAction: (user: AdminUser, action: UserActionType) => void
}

export default function UsersTableRow({
  user,
  locale,
  onRequestAction,
}: UsersTableRowProps) {
  const { t } = useTranslation()
  const joinedDate = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(user.joinedAt))
  const usageLimit = user.usage.limit ?? t("admin.users.usage.unlimited")

  return (
    <tr className="border-b border-border/70 transition-colors hover:bg-muted/30 last:border-b-0">
      <td className="min-w-[260px] px-5 py-5 text-start">
        <UserIdentityCell user={user} locale={locale} />
      </td>
      <td className="px-5 py-5 text-center">
        <UserPlanBadge plan={user.plan} />
      </td>
      <td className="px-5 py-5 text-center text-base font-bold text-foreground">
        {new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(user.usage.used)}
        <span className="px-1 text-muted-foreground">/</span>
        <span className="text-muted-foreground">{usageLimit}</span>
      </td>
      <td className="px-5 py-5 text-center text-base font-medium text-foreground">
        {joinedDate}
      </td>
      <td className="px-5 py-5 text-center">
        <UserStatusBadge status={user.status} />
      </td>
      <td className="px-5 py-5">
        <UserActions user={user} onRequestAction={onRequestAction} />
      </td>
    </tr>
  )
}
