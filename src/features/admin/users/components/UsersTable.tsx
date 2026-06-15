import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { User, UserActionTarget } from "../types"
import UsersTableRow from "./UsersTableRow"

interface UsersTableProps {
  users: User[]
  locale: string
  loading: boolean
  refetching: boolean
  actionPending: boolean
  onActionSelect: (target: UserActionTarget) => void
}

export default function UsersTable({
  users,
  locale,
  loading,
  refetching,
  actionPending,
  onActionSelect,
}: UsersTableProps) {
  const { t } = useTranslation()
  const showSkeletonRows = loading || (refetching && users.length === 0)
  const showUpdatingOverlay = refetching && users.length > 0

  return (
    <Card className="rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="gap-2 px-6">
        <CardTitle className="text-xl font-black">
          {t("admin.users.table.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="admin-table-scrollbar overflow-x-auto">
          <div className="relative min-h-[260px]">
            <table className="w-full min-w-[980px] caption-bottom text-start">
              <thead>
                <tr className="border-y border-border/70 bg-muted/30 text-xs font-bold uppercase text-muted-foreground">
                  <th className="px-4 py-3 text-start">{t("admin.users.columns.user")}</th>
                  <th className="px-4 py-3 text-start">{t("admin.users.columns.roles")}</th>
                  <th className="px-4 py-3 text-start">{t("admin.users.columns.plan")}</th>
                  <th className="px-4 py-3 text-start">{t("admin.users.columns.status")}</th>
                  <th className="px-4 py-3 text-start">{t("admin.users.columns.deleted")}</th>
                  <th className="px-4 py-3 text-start">{t("admin.users.columns.joinedAt")}</th>
                  <th className="px-4 py-3 text-end">{t("admin.users.columns.actions")}</th>
                </tr>
              </thead>
              <tbody className={showUpdatingOverlay ? "opacity-50" : undefined}>
                {showSkeletonRows ? (
                  <UsersTableSkeletonRows />
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <UsersTableRow
                      key={user.id}
                      user={user}
                      locale={locale}
                      actionPending={actionPending}
                      onActionSelect={onActionSelect}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="h-44 px-4 text-center text-sm font-medium text-muted-foreground">
                      {t("admin.users.empty")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {showUpdatingOverlay ? (
              <div className="pointer-events-none absolute inset-x-0 top-11 bottom-0 flex items-start justify-center bg-card/35 pt-16 backdrop-blur-[1px]">
                <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-background/95 px-3 py-2 text-xs font-bold text-muted-foreground shadow-sm">
                  <Loader2 className="animate-spin" />
                  {t("admin.users.loading.updating")}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function UsersTableSkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-border/70 last:border-b-0">
          <td className="px-4 py-4">
            <div className="flex min-w-[220px] items-center gap-3">
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex min-w-0 flex-col gap-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </td>
          <td className="px-4 py-4"><Skeleton className="h-5 w-28 rounded-4xl" /></td>
          <td className="px-4 py-4"><Skeleton className="h-5 w-32 rounded-4xl" /></td>
          <td className="px-4 py-4"><Skeleton className="h-5 w-20 rounded-4xl" /></td>
          <td className="px-4 py-4"><Skeleton className="h-5 w-24 rounded-4xl" /></td>
          <td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td>
          <td className="px-4 py-4">
            <div className="flex justify-end">
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}
