import type {
  FailedPaymentsStats,
  PaymentStatsByTime,
  PaymentStatsGranularity,
  PaymentTimeSeriesPoint,
  PaymentsFullStatsRes,
  PaymentTopUser,
  StuckPayment,
} from "../types"

type IntlLocale = string | undefined
type PaymentSeriesItem = PaymentStatsByTime | PaymentTimeSeriesPoint

type ParsedPaymentPeriod = {
  date: Date | null
  key: string
  raw: string
}

export type PaymentActivityDatum = {
  period: string
  label: string
  revenue: number
  paymentCount: number
  successCount: number
  failureCount: number
}

export type PaymentActivityTotals = {
  revenue: number
  paymentCount: number
  successCount: number
  failureCount: number
}

export type FailureChartDatum = FailedPaymentsStats & {
  fill: string
}

const failureColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const isoWeekPattern = /^(\d{4})-W(\d{1,2})(?:-(\d))?$/
const monthPattern = /^(\d{4})-(\d{2})$/

const isValidDate = (date: Date) => Number.isFinite(date.getTime())

const parseIsoWeekStart = (year: number, week: number) => {
  if (week < 1 || week > 53) {
    return null
  }

  const fourthOfJanuary = new Date(Date.UTC(year, 0, 4))
  const fourthDay = fourthOfJanuary.getUTCDay() || 7
  const firstWeekMonday = new Date(fourthOfJanuary)
  firstWeekMonday.setUTCDate(fourthOfJanuary.getUTCDate() - fourthDay + 1)

  const weekStart = new Date(firstWeekMonday)
  weekStart.setUTCDate(firstWeekMonday.getUTCDate() + (week - 1) * 7)

  return isValidDate(weekStart) ? weekStart : null
}

export const parsePaymentPeriod = (
  period: Date | string | number
): ParsedPaymentPeriod => {
  if (period instanceof Date) {
    return isValidDate(period)
      ? {
          date: period,
          key: period.toISOString(),
          raw: period.toISOString(),
        }
      : {
          date: null,
          key: "invalid-date",
          raw: "invalid-date",
        }
  }

  const raw = String(period ?? "").trim()

  if (!raw) {
    return {
      date: null,
      key: "unknown-period",
      raw: "unknown-period",
    }
  }

  const isoWeekMatch = raw.match(isoWeekPattern)
  if (isoWeekMatch) {
    const [, yearValue, weekValue] = isoWeekMatch
    const weekStart = parseIsoWeekStart(Number(yearValue), Number(weekValue))

    if (weekStart) {
      return {
        date: weekStart,
        key: weekStart.toISOString(),
        raw,
      }
    }
  }

  const monthMatch = raw.match(monthPattern)
  if (monthMatch) {
    const [, yearValue, monthValue] = monthMatch
    const monthDate = new Date(Date.UTC(Number(yearValue), Number(monthValue) - 1, 1))

    if (isValidDate(monthDate)) {
      return {
        date: monthDate,
        key: monthDate.toISOString(),
        raw,
      }
    }
  }

  const date = new Date(raw)

  if (isValidDate(date)) {
    return {
      date,
      key: date.toISOString(),
      raw,
    }
  }

  return {
    date: null,
    key: raw,
    raw,
  }
}

export const formatNumber = (
  value: number,
  locale: IntlLocale,
  compact = false
) =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(value)

export const formatDecimal = (value: number, locale: IntlLocale) =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value)

export const formatPercent = (value: number, locale: IntlLocale) =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value / 100)

export const formatCurrency = (
  value: number,
  locale: IntlLocale,
  currency = "EGP",
  compact = false
) =>
  new Intl.NumberFormat(locale, {
    compactDisplay: "short",
    currency,
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
    style: "currency",
  }).format(value)

export const formatDateTime = (value: Date | string, locale: IntlLocale) =>
  new Intl.DateTimeFormat(locale, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value))

export const formatMinutes = (minutes: number, locale: IntlLocale) => {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return `0m`
  }

  if (minutes < 60) {
    return `${formatNumber(Math.round(minutes), locale)}m`
  }

  return `${formatDecimal(minutes / 60, locale)}h`
}

export const shortenPaymentId = (id: string, start = 6, end = 6) => {
  if (id.length <= start + end + 3) {
    return id
  }

  return `${id.slice(0, start)}...${id.slice(-end)}`
}

export const formatPaymentPeriodLabel = (
  value: Date | string,
  granularity: PaymentStatsGranularity,
  locale: IntlLocale
) => {
  const parsed = parsePaymentPeriod(value)

  if (!parsed.date) {
    return parsed.raw
  }

  const date = parsed.date

  if (granularity === "MONTHLY") {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      year: "numeric",
    }).format(date)
  }

  if (granularity === "WEEKLY") {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
    }).format(date)
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date)
}

export const buildPaymentActivityData = (
  series: PaymentSeriesItem[] | undefined,
  granularity: PaymentStatsGranularity,
  locale: IntlLocale
): PaymentActivityDatum[] => {
  if (!series?.length) {
    return []
  }

  return [...series]
    .sort((first, second) => {
      const firstPeriod = parsePaymentPeriod(first.period)
      const secondPeriod = parsePaymentPeriod(second.period)

      if (firstPeriod.date && secondPeriod.date) {
        return firstPeriod.date.getTime() - secondPeriod.date.getTime()
      }

      if (firstPeriod.date) {
        return -1
      }

      if (secondPeriod.date) {
        return 1
      }

      return firstPeriod.key.localeCompare(secondPeriod.key)
    })
    .map((item) => {
      const parsedPeriod = parsePaymentPeriod(item.period)

      return {
        period: parsedPeriod.key,
        label: formatPaymentPeriodLabel(item.period, granularity, locale),
        revenue: item.revenue ?? 0,
        paymentCount: item.paymentCount ?? 0,
        successCount: item.successCount ?? 0,
        failureCount: item.failureCount ?? 0,
      }
    })
}

export const buildPaymentActivityTotals = (
  data: PaymentActivityDatum[]
): PaymentActivityTotals =>
  data.reduce(
    (totals, item) => ({
      failureCount: totals.failureCount + item.failureCount,
      paymentCount: totals.paymentCount + item.paymentCount,
      revenue: totals.revenue + item.revenue,
      successCount: totals.successCount + item.successCount,
    }),
    { failureCount: 0, paymentCount: 0, revenue: 0, successCount: 0 }
  )

export const buildFailureChartData = (
  failures: FailedPaymentsStats[] | undefined
): FailureChartDatum[] =>
  failures?.map((item, index) => ({
    ...item,
    fill: failureColors[index % failureColors.length],
  })) ?? []

export const hasPaymentsData = (stats: PaymentsFullStatsRes | undefined) =>
  Boolean(
    stats?.summary.totalPayments ||
      stats?.summary.totalRevenue ||
      stats?.failureBreakdown.length ||
      stats?.topUsers.length ||
      stats?.stuckPayments.length
  )

export const getPrimaryCurrency = (stuckPayments: StuckPayment[] | undefined) =>
  stuckPayments?.find((payment) => payment.currency)?.currency ?? "EGP"

export const hasTopUsers = (users: PaymentTopUser[] | undefined) =>
  Boolean(users?.length)
