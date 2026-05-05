import {
  BotMessageSquare,
  CreditCard,
  FileText,
  UsersRound,
} from "lucide-react"
import type {
  ActivityItemData,
  MetricCardData,
  UsageChartData,
} from "@/features/admin/types"

export const overviewMetrics: MetricCardData[] = [
  {
    title: "admin.overview.metrics.activeUsers",
    value: 12450,
    trend: "admin.overview.metrics.activeUsersTrend",
    trendDirection: "up",
    icon: UsersRound,
    tone: "blue",
  },
  {
    title: "admin.overview.metrics.generatedContracts",
    value: 8321,
    trend: "admin.overview.metrics.generatedContractsTrend",
    trendDirection: "up",
    icon: FileText,
    tone: "emerald",
  },
  {
    title: "admin.overview.metrics.aiConsultations",
    value: 54200,
    format: "compact",
    trend: "admin.overview.metrics.aiConsultationsTrend",
    trendDirection: "up",
    icon: BotMessageSquare,
    tone: "violet",
  },
  {
    title: "admin.overview.metrics.activeSubscriptions",
    value: 2890,
    trend: "admin.overview.metrics.activeSubscriptionsTrend",
    trendDirection: "down",
    icon: CreditCard,
    tone: "amber",
  },
]

export const overviewActivities: ActivityItemData[] = [
  {
    id: "new-user",
    label: "admin.overview.activities.newUser",
    time: "admin.overview.activities.fiveMinutesAgo",
    tone: "success",
  },
  {
    id: "contract-created",
    label: "admin.overview.activities.contractCreated",
    time: "admin.overview.activities.fifteenMinutesAgo",
    tone: "info",
  },
  {
    id: "payment-failed",
    label: "admin.overview.activities.paymentFailed",
    time: "admin.overview.activities.oneHourAgo",
    tone: "warning",
  },
  {
    id: "account-upgraded",
    label: "admin.overview.activities.accountUpgraded",
    time: "admin.overview.activities.twoHoursAgo",
    tone: "billing",
  },
]

export const weeklyUsageData: UsageChartData = {
  labels: [
    "admin.overview.days.saturday",
    "admin.overview.days.sunday",
    "admin.overview.days.monday",
    "admin.overview.days.tuesday",
    "admin.overview.days.wednesday",
    "admin.overview.days.thursday",
    "admin.overview.days.friday",
  ],
  series: [
    {
      label: "admin.overview.chart.aiConsultations",
      color: "var(--admin-chart-blue)",
      values: [1200, 1900, 3000, 5000, 4200, 3800, 2100],
    },
    {
      label: "admin.overview.chart.generatedContracts",
      color: "var(--admin-chart-amber)",
      values: [500, 800, 1200, 2100, 1800, 1500, 700],
    },
  ],
}
