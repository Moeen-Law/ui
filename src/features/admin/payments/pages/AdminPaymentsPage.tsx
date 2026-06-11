import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  RefreshCw,
  Repeat2,
  TrendingUp,
  XCircle,
} from "lucide-react"
import { lazy, Suspense, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import AdminPaymentsErrorState from "../components/AdminPaymentsErrorState"
import AdminPaymentsPageSkeleton from "../components/AdminPaymentsPageSkeleton"
import PaymentsMetricCard from "../components/PaymentsMetricCard"
import StuckPaymentsPanel from "../components/StuckPaymentsPanel"
import TopPaymentsUsersPanel from "../components/TopPaymentsUsersPanel"
import {
  useAdminPaymentsFullStats,
  useAdminPaymentsTimeSeries,
} from "../hooks"
import {
  buildFailureChartData,
  buildPaymentActivityData,
  buildPaymentActivityTotals,
  formatCurrency,
  formatDecimal,
  formatNumber,
  formatPercent,
  getPrimaryCurrency,
  hasPaymentsData,
} from "../helpers"
import type { PaymentStatsGranularity } from "../types"

const PaymentActivityChart = lazy(() => import("../components/PaymentActivityChart"))
const FailureBreakdownChart = lazy(() => import("../components/FailureBreakdownChart"))

function ChartPanelFallback({ className = "min-h-[430px]" }: { className?: string }) {
  return (
    <div className={`${className} rounded-2xl border border-border/80 bg-card/80`} aria-hidden="true" />
  )
}

export default function AdminPaymentsPage() {
  const { i18n, t } = useTranslation()
  const locale = i18n.resolvedLanguage ?? i18n.language
  const [granularity, setGranularity] =
    useState<PaymentStatsGranularity>("MONTHLY")
  const fullStatsQuery = useAdminPaymentsFullStats()
  const timeSeriesQuery = useAdminPaymentsTimeSeries(granularity)

  const allQueries = [fullStatsQuery, timeSeriesQuery]
  const isFetching = allQueries.some((query) => query.isFetching)

  const fullStats = fullStatsQuery.data
  const summary = fullStats?.summary
  const topUsers = fullStats?.topUsers ?? []
  const stuckPayments = fullStats?.stuckPayments ?? []
  const currency = getPrimaryCurrency(stuckPayments)
  const timeSeries = timeSeriesQuery.data ?? fullStats?.timeSeries

  const activityData = useMemo(
    () => buildPaymentActivityData(timeSeries, granularity, locale),
    [granularity, locale, timeSeries]
  )
  const activityTotals = useMemo(
    () => buildPaymentActivityTotals(activityData),
    [activityData]
  )
  const failureData = useMemo(
    () => buildFailureChartData(fullStats?.failureBreakdown),
    [fullStats?.failureBreakdown]
  )

  const retry = () => {
    allQueries.forEach((query) => {
      void query.refetch()
    })
  }

  if (fullStatsQuery.isLoading) {
    return <AdminPaymentsPageSkeleton />
  }

  if (fullStatsQuery.isError) {
    return <AdminPaymentsErrorState onRetry={retry} retrying={isFetching} />
  }

  const hasData = hasPaymentsData(fullStats)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-muted-foreground">
            {t("admin.payments.subtitle")}
          </p>
          {!hasData ? (
            <p className="text-sm text-muted-foreground">
              {t("admin.payments.empty.page")}
            </p>
          ) : null}
        </div>
        <Button type="button" variant="outline" onClick={retry} disabled={isFetching}>
          <RefreshCw data-icon="inline-start" />
          {t("admin.payments.actions.refresh")}
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <PaymentsMetricCard
          title={t("admin.payments.metrics.totalRevenue")}
          value={formatCurrency(summary?.totalRevenue ?? 0, locale, currency, true)}
          description={t("admin.payments.metrics.reportGenerated", {
            date: summary?.reportGeneratedAt
              ? new Intl.DateTimeFormat(locale, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(new Date(summary.reportGeneratedAt))
              : t("admin.payments.metrics.noReportDate"),
          })}
          icon={CircleDollarSign}
          tone="emerald"
        />
        <PaymentsMetricCard
          title={t("admin.payments.metrics.totalPayments")}
          value={formatNumber(summary?.totalPayments ?? 0, locale, true)}
          description={t("admin.payments.metrics.completed", {
            count: formatNumber(summary?.completedPayments ?? 0, locale),
          })}
          icon={CreditCard}
          tone="blue"
        />
        <PaymentsMetricCard
          title={t("admin.payments.metrics.successRate")}
          value={formatPercent(summary?.successRate ?? 0, locale)}
          description={t("admin.payments.metrics.failed", {
            count: formatNumber(summary?.failedPayments ?? 0, locale),
          })}
          icon={CheckCircle2}
          tone="teal"
        />
        <PaymentsMetricCard
          title={t("admin.payments.metrics.averageTransactionValue")}
          value={formatCurrency(
            summary?.averageTransactionValue ?? 0,
            locale,
            currency,
            true
          )}
          description={t("admin.payments.metrics.pending", {
            count: formatNumber(summary?.pendingPayments ?? 0, locale),
          })}
          icon={TrendingUp}
          tone="violet"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <PaymentsMetricCard
          compact
          title={t("admin.payments.metrics.failedPayments")}
          value={formatNumber(summary?.failedPayments ?? 0, locale)}
          icon={XCircle}
          tone="rose"
        />
        <PaymentsMetricCard
          compact
          title={t("admin.payments.metrics.pendingPayments")}
          value={formatNumber(summary?.pendingPayments ?? 0, locale)}
          icon={Clock3}
          tone="amber"
        />
        <PaymentsMetricCard
          compact
          title={t("admin.payments.metrics.averageAttempts")}
          value={formatDecimal(summary?.averageAttemptsPerPayment ?? 0, locale)}
          icon={Repeat2}
          tone="blue"
        />
        <PaymentsMetricCard
          compact
          title={t("admin.payments.metrics.stuckPending")}
          value={formatNumber(summary?.stuckPendingCount ?? 0, locale)}
          description={t("admin.payments.metrics.multipleAttempts", {
            count: formatNumber(summary?.paymentsWithMultipleAttempts ?? 0, locale),
          })}
          icon={AlertTriangle}
          tone="rose"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <Suspense fallback={<ChartPanelFallback className="min-h-[500px]" />}>
          <PaymentActivityChart
            data={activityData}
            totals={activityTotals}
            currency={currency}
            granularity={granularity}
            locale={locale}
            loading={timeSeriesQuery.isLoading}
            fetching={timeSeriesQuery.isFetching}
            error={timeSeriesQuery.isError}
            onRetry={() => {
              void timeSeriesQuery.refetch()
            }}
            onGranularityChange={setGranularity}
          />
        </Suspense>
        <Suspense fallback={<ChartPanelFallback />}>
          <FailureBreakdownChart data={failureData} locale={locale} />
        </Suspense>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TopPaymentsUsersPanel
          users={topUsers}
          currency={currency}
          locale={locale}
        />
        <StuckPaymentsPanel payments={stuckPayments} locale={locale} />
      </section>
    </div>
  )
}
