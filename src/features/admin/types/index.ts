import type { LucideIcon } from "lucide-react"

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export type MetricTone = "blue" | "emerald" | "violet" | "amber"

export type MetricCardData = {
  title: string
  value: number
  format?: "standard" | "compact"
  trend: string
  trendDirection: "up" | "down"
  icon: LucideIcon
  tone: MetricTone
}

export type ActivityTone = "success" | "info" | "warning" | "billing"

export type ActivityItemData = {
  id: string
  label: string
  time: string
  tone: ActivityTone
}

export type ChartSeries = {
  label: string
  color: string
  values: number[]
}

export type UsageChartData = {
  labels: string[]
  series: ChartSeries[]
}
