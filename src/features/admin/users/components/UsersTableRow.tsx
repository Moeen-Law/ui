import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import type { User, UserActionTarget } from "../types"
import { formatDate } from "../helpers"
import UserActions from "./UserActions"
import UserIdentityCell from "./UserIdentityCell"
import UserPlanBadge from "./UserPlanBadge"
import UserStatusBadge from "./UserStatusBadge"

interface UsersTableRowProps {
  user: User
  locale: string
  actionPending: boolean
  onActionSelect: (target: UserActionTarget) => void
}

export default function UsersTableRow({
  user,
  locale,
  actionPending,
  onActionSelect,
}: UsersTableRowProps) {
  const { t } = useTranslation()

  return (
    <tr className="border-b border-border/70 last:border-b-0">
      <td className="px-4 py-4 align-middle">
        <UserIdentityCell user={user} />
      </td>
      <td className="px-4 py-4 align-middle">
        <div className="flex flex-wrap gap-2">
          {user.roles.length > 0 ? (
            user.roles.map((role) => (
              <Badge key={role} variant="outline">
                {t(`admin.users.roles.${role}`)}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">{t("admin.users.roles.none")}</Badge>
          )}
        </div>
      </td>
      <td className="px-4 py-4 align-middle">
        <UserPlanBadge user={user} />
      </td>
      <td className="px-4 py-4 align-middle">
        <UserStatusBadge user={user} />
      </td>
      <td className="px-4 py-4 align-middle">
        <Badge variant={user.deleted ? "destructive" : "outline"}>
          {t(user.deleted ? "admin.users.deleted.yes" : "admin.users.deleted.no")}
        </Badge>
      </td>
      <td className="px-4 py-4 align-middle text-sm text-muted-foreground">
        {formatDate(user.createdAt, locale)}
      </td>
      <td className="px-4 py-4 align-middle">
        <div className="flex justify-end">
          <UserActions
            user={user}
            disabled={actionPending}
            onSelect={onActionSelect}
          />
        </div>
      </td>
    </tr>
  )
}
