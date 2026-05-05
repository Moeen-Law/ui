import { useTranslation } from "react-i18next"
import type { AdminUser, UserActionType } from "../types"
import UsersTableRow from "./UsersTableRow"

interface UsersTableProps {
  users: AdminUser[]
  locale: "ar" | "en"
  onRequestAction: (user: AdminUser, action: UserActionType) => void
}

export default function UsersTable({ users, locale, onRequestAction }: UsersTableProps) {
  const { t } = useTranslation()

  return (
    <div className="admin-table-scrollbar overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse">
        <thead>
          <tr className="border-b border-border"> 
            <th className="px-5 py-4 text-start text-sm font-black text-muted-foreground">
              {t("admin.users.columns.user")}
            </th>
            <th className="px-5 py-4 text-center text-sm font-black text-muted-foreground">
              {t("admin.users.columns.plan")}
            </th>
            <th className="px-5 py-4 text-center text-sm font-black text-muted-foreground">
              {t("admin.users.columns.usage")}
            </th>
            <th className="px-5 py-4 text-center text-sm font-black text-muted-foreground">
              {t("admin.users.columns.joinedAt")}
            </th>
            <th className="px-5 py-4 text-center text-sm font-black text-muted-foreground">
              {t("admin.users.columns.status")}
            </th>
            <th className="px-5 py-4 text-start text-sm font-black text-muted-foreground">
              {t("admin.users.columns.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <UsersTableRow
                key={user.id}
                user={user}
                locale={locale}
                onRequestAction={onRequestAction}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-5 py-16 text-center text-muted-foreground">
                {t("admin.users.empty")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
