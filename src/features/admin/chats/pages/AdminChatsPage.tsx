import {
  Activity,
  Bot,
  FileText,
  MessageSquareText,
  RefreshCw,
  Timer,
  UserCheck,
  UsersRound,
} from "lucide-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import AdminChatsErrorState from "../components/AdminChatsErrorState"
import AdminChatsPageSkeleton from "../components/AdminChatsPageSkeleton"
import ChatActivityChart from "../components/ChatActivityChart"
import ChatHealthPanel from "../components/ChatHealthPanel"
import ChatsMetricCard from "../components/ChatsMetricCard"
import DocumentsStatsPanel from "../components/DocumentsStatsPanel"
import MessagesBySenderChart from "../components/MessagesBySenderChart"
import UserEngagementPanel from "../components/UserEngagementPanel"
import {
  useAdminChatsActivity,
  useAdminChatsDocuments,
  useAdminChatsOverview,
  useAdminChatsStats,
  useAdminChatsUsers,
} from "../hooks"
import {
  buildActivityChartData,
  buildActivityTotals,
  buildSenderChartData,
  formatDecimal,
  formatDuration,
  getDefaultActivityParams,
  formatNumber,
  formatPercent,
  hasAnyStats,
} from "../helpers"

export default function AdminChatsPage() {
  const { i18n, t } = useTranslation()
  const locale = i18n.resolvedLanguage ?? i18n.language
  const [activityParams, setActivityParams] = useState(getDefaultActivityParams)
  const overviewQuery = useAdminChatsOverview()
  const activityQuery = useAdminChatsActivity(activityParams)
  const usersQuery = useAdminChatsUsers()
  const documentsQuery = useAdminChatsDocuments()
  const statsQuery = useAdminChatsStats()

  const coreQueries = [overviewQuery, usersQuery, documentsQuery, statsQuery]
  const allQueries = [...coreQueries, activityQuery]
  const isCoreLoading = coreQueries.some((query) => query.isLoading)
  const isCoreError = coreQueries.some((query) => query.isError)
  const isFetching = allQueries.some((query) => query.isFetching)

  const activityData = useMemo(
    () => buildActivityChartData(activityQuery.data, locale, activityParams.interval),
    [activityQuery.data, activityParams.interval, locale]
  )
  const activityTotals = useMemo(
    () => buildActivityTotals(activityData),
    [activityData]
  )
  const senderData = useMemo(
    () => buildSenderChartData(overviewQuery.data),
    [overviewQuery.data]
  )

  const retry = () => {
    allQueries.forEach((query) => {
      void query.refetch()
    })
  }

  if (isCoreLoading) {
    return <AdminChatsPageSkeleton />
  }

  if (isCoreError) {
    return <AdminChatsErrorState onRetry={retry} retrying={isFetching} />
  }

  const overview = overviewQuery.data
  const users = usersQuery.data
  const documents = documentsQuery.data
  const stats = statsQuery.data
  const hasData = hasAnyStats(overview, users, documents, stats)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-muted-foreground">
            {t("admin.chats.subtitle")}
          </p>
          {!hasData ? (
            <p className="text-sm text-muted-foreground">{t("admin.chats.empty.page")}</p>
          ) : null}
        </div>
        <Button type="button" variant="outline" onClick={retry} disabled={isFetching}>
          <RefreshCw data-icon="inline-start" />
          {t("admin.chats.actions.refresh")}
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ChatsMetricCard
          title={t("admin.chats.metrics.totalChats")}
          value={formatNumber(overview?.totalChats ?? 0, locale, true)}
          description={t("admin.chats.periods.last30d", {
            count: formatNumber(overview?.periods.chats.last30d ?? 0, locale),
          })}
          icon={MessageSquareText}
          tone="emerald"
        />
        <ChatsMetricCard
          title={t("admin.chats.metrics.totalMessages")}
          value={formatNumber(overview?.totalMessages ?? 0, locale, true)}
          description={t("admin.chats.periods.last7d", {
            count: formatNumber(overview?.periods.messages.last7d ?? 0, locale),
          })}
          icon={Bot}
          tone="blue"
        />
        <ChatsMetricCard
          title={t("admin.chats.metrics.totalDocuments")}
          value={formatNumber(overview?.totalDocuments ?? 0, locale, true)}
          description={t("admin.chats.periods.today", {
            count: formatNumber(overview?.periods.documents.today ?? 0, locale),
          })}
          icon={FileText}
          tone="amber"
        />
        <ChatsMetricCard
          title={t("admin.chats.metrics.uniqueUsers")}
          value={formatNumber(overview?.uniqueUsers ?? 0, locale, true)}
          description={t("admin.chats.metrics.uniqueUsersDescription")}
          icon={UsersRound}
          tone="violet"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ChatsMetricCard
          compact
          title={t("admin.chats.metrics.avgChatsPerUser")}
          value={formatDecimal(users?.averageChatsPerUser ?? 0, locale)}
          icon={UserCheck}
          tone="teal"
        />
        <ChatsMetricCard
          compact
          title={t("admin.chats.metrics.avgMessagesPerChat")}
          value={formatDecimal(users?.averageMessagesPerChat ?? 0, locale)}
          icon={MessageSquareText}
          tone="emerald"
        />
        <ChatsMetricCard
          compact
          title={t("admin.chats.metrics.abandonment")}
          value={formatPercent(stats?.abandonmentRate.rate ?? 0, locale)}
          icon={Activity}
          tone="rose"
        />
        <ChatsMetricCard
          compact
          title={t("admin.chats.metrics.avgLifespan")}
          value={formatDuration(stats?.avgLifespan.avgLifespanSeconds ?? 0, locale)}
          icon={Timer}
          tone="amber"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <ChatActivityChart
          data={activityData}
          totals={activityTotals}
          params={activityParams}
          locale={locale}
          loading={activityQuery.isLoading}
          fetching={activityQuery.isFetching}
          error={activityQuery.isError}
          onRetry={() => {
            void activityQuery.refetch()
          }}
          onParamsChange={setActivityParams}
          onReset={() => setActivityParams(getDefaultActivityParams())}
        />
        <MessagesBySenderChart data={senderData} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <UserEngagementPanel users={users} locale={locale} />
        <DocumentsStatsPanel documents={documents} locale={locale} />
        <ChatHealthPanel stats={stats} locale={locale} />
      </section>
    </div>
  )
}
