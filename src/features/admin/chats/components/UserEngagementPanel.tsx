import { Loader2, UserRoundCheck, UsersRound } from "lucide-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UsersStatsRes } from "../types"
import { formatDecimal, formatNumber } from "../helpers"
import { useAdminUserStats } from "../hooks"
import AnalyticsEntityIdentity from "./AnalyticsEntityIdentity"
import AnalyticsDetailStat from "./AnalyticsDetailStat"
import AnalyticsMiniStat from "./AnalyticsMiniStat"

interface UserEngagementPanelProps {
  users: UsersStatsRes | undefined
  locale: string
}

export default function UserEngagementPanel({
  users,
  locale,
}: UserEngagementPanelProps) {
  const { t } = useTranslation()
  const topUsers = useMemo(() => users?.topUsers ?? [], [users?.topUsers])
  const firstUserId = topUsers[0]?.userId
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(firstUserId)
  const effectiveSelectedUserId =
    selectedUserId && topUsers.some((user) => user.userId === selectedUserId)
      ? selectedUserId
      : firstUserId
  const selectedUserFromList = useMemo(
    () => topUsers.find((user) => user.userId === effectiveSelectedUserId),
    [effectiveSelectedUserId, topUsers]
  )
  const selectedUserStats = useAdminUserStats(effectiveSelectedUserId)

  return (
    <Card className="h-full rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="flex-row items-start justify-between gap-4 px-6">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-black">
            {t("admin.chats.panels.users.title")}
          </CardTitle>
          <CardDescription>{t("admin.chats.panels.users.description")}</CardDescription>
        </div>
        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
          <UsersRound className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-6">
        <div className="grid grid-cols-3 gap-3">
          <AnalyticsMiniStat
            label={t("admin.chats.metrics.dau")}
            value={formatNumber(users?.dailyActiveUsers ?? 0, locale)}
            variant="compact"
          />
          <AnalyticsMiniStat
            label={t("admin.chats.metrics.wau")}
            value={formatNumber(users?.weeklyActiveUsers ?? 0, locale)}
            variant="compact"
          />
          <AnalyticsMiniStat
            label={t("admin.chats.metrics.mau")}
            value={formatNumber(users?.monthlyActiveUsers ?? 0, locale)}
            variant="compact"
          />
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <UserRoundCheck className="size-4 shrink-0 text-emerald-300" />
              <p className="truncate text-sm font-black">
                {t("admin.chats.identity.selectedUser")}
              </p>
            </div>
            {selectedUserStats.isFetching ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
            ) : null}
          </div>
          {effectiveSelectedUserId ? (
            <>
              <AnalyticsEntityIdentity id={effectiveSelectedUserId} type="user" />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <AnalyticsDetailStat
                  label={t("admin.chats.metrics.totalChats")}
                  value={formatNumber(
                    selectedUserStats.data?.chatCount ?? selectedUserFromList?.chatCount ?? 0,
                    locale
                  )}
                />
                <AnalyticsDetailStat
                  label={t("admin.chats.metrics.totalMessages")}
                  value={formatNumber(
                    selectedUserStats.data?.messageCount ?? selectedUserFromList?.messageCount ?? 0,
                    locale
                  )}
                />
                <AnalyticsDetailStat
                  label={t("admin.chats.metrics.totalDocuments")}
                  value={formatNumber(selectedUserStats.data?.documentCount ?? 0, locale)}
                />
                <AnalyticsDetailStat
                  label={t("admin.chats.metrics.avgMessagesPerChat")}
                  value={formatDecimal(selectedUserStats.data?.avgMsgsPerChat ?? 0, locale)}
                />
              </div>
            </>
          ) : (
            <div className="flex h-24 items-center justify-center text-sm font-medium text-muted-foreground">
              {t("admin.chats.empty.users")}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {topUsers.length > 0 ? (
            topUsers.slice(0, 5).map((user, index) => (
              <div
                role="button"
                tabIndex={0}
                key={user.userId}
                onClick={() => setSelectedUserId(user.userId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setSelectedUserId(user.userId)
                  }
                }}
                className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-start transition-all duration-200 hover:border-emerald-400/35 hover:bg-card data-[selected=true]:border-emerald-400/40 data-[selected=true]:bg-emerald-500/10"
                data-selected={user.userId === effectiveSelectedUserId}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Badge variant="secondary" className="size-7 shrink-0 justify-center rounded-full px-0">
                    {formatNumber(index + 1, locale)}
                  </Badge>
                  <div className="min-w-0">
                    <AnalyticsEntityIdentity id={user.userId} type="user" />
                    <p className="text-xs text-muted-foreground">
                      {t("admin.chats.panels.users.messages", {
                        count: formatNumber(user.messageCount, locale),
                      })}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-lg font-black tabular-nums">
                  {formatNumber(user.chatCount, locale)}
                </p>
              </div>
            ))
          ) : (
            <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground">
              {t("admin.chats.empty.users")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
