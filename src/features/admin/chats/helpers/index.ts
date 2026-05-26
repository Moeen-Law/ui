import type {
  ActivityRes,
  ActivityInterval,
  ActivityStatsParams,
  ChatsStatsRes,
  DocumentsStatsRes,
  Sender,
  StatsOverviewRes,
  UsersStatsRes,
} from "../types"

export type ActivityChartDatum = {
  period: string
  label: string
  chats: number
  userMessages: number
  aiMessages: number
  systemMessages: number
  totalMessages: number
  documents: number
}

export type ActivityTotals = {
  chats: number
  messages: number
  documents: number
}

export type SenderChartDatum = {
  sender: "user" | "ai" | "system"
  value: number
  fill: string
}

type IntlLocale = string | undefined

export const formatNumber = (value: number, locale: IntlLocale, compact = false) =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(value)

export const formatPercent = (value: number, locale: IntlLocale) =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value / 100)

export const formatDecimal = (value: number, locale: IntlLocale) =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value)

export const formatDateLabel = (value: Date | string, locale: IntlLocale) =>
  new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(new Date(value))

export const formatDateTime = (value: Date | string, locale: IntlLocale) =>
  new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))

export const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10)

export const getDefaultActivityParams = (): ActivityStatsParams => {
  const to = new Date()
  const from = new Date(to)
  from.setDate(to.getDate() - 30)

  return {
    interval: "day",
    from: toDateInputValue(from),
    to: toDateInputValue(to),
  }
}

export const formatActivityPeriodLabel = (
  value: Date | string,
  interval: ActivityInterval,
  locale: IntlLocale
) => {
  const date = new Date(value)

  if (interval === "month") {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      year: "numeric",
    }).format(date)
  }

  if (interval === "week") {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return formatDateLabel(value, locale)
}

export const formatActivityRange = (
  params: ActivityStatsParams,
  locale: IntlLocale
) => {
  if (!params.from || !params.to) {
    return ""
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return `${formatter.format(new Date(params.from))} - ${formatter.format(new Date(params.to))}`
}

export const formatDuration = (seconds: number, locale: IntlLocale) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return formatNumber(0, locale)
  }

  if (seconds < 60) {
    return `${formatNumber(Math.round(seconds), locale)}s`
  }

  const minutes = seconds / 60

  if (minutes < 60) {
    return `${formatDecimal(minutes, locale)}m`
  }

  return `${formatDecimal(minutes / 60, locale)}h`
}

export const buildActivityChartData = (
  activity: ActivityRes | undefined,
  locale: IntlLocale,
  interval: ActivityInterval
): ActivityChartDatum[] => {
  if (!activity) {
    return []
  }

  const periods = new Map<string, ActivityChartDatum>()
  const ensurePeriod = (period: Date | string) => {
    const key = new Date(period).toISOString()
    const existing = periods.get(key)

    if (existing) {
      return existing
    }

    const next = {
      period: key,
      label: formatActivityPeriodLabel(period, interval, locale),
      chats: 0,
      userMessages: 0,
      aiMessages: 0,
      systemMessages: 0,
      totalMessages: 0,
      documents: 0,
    }
    periods.set(key, next)
    return next
  }

  activity.chats.forEach((item) => {
    ensurePeriod(item.period).chats += item.count
  })

  activity.messages.forEach((item) => {
    const period = ensurePeriod(item.period)
    period[messageKeyBySender[item.sender]] += item.count
    period.totalMessages += item.count
  })

  activity.documents.forEach((item) => {
    ensurePeriod(item.period).documents += item.count
  })

  return Array.from(periods.entries())
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([, value]) => value)
}

const messageKeyBySender: Record<Sender, "aiMessages" | "systemMessages" | "userMessages"> = {
  ai: "aiMessages",
  system: "systemMessages",
  user: "userMessages",
}

export const buildActivityTotals = (data: ActivityChartDatum[]): ActivityTotals =>
  data.reduce(
    (totals, item) => ({
      chats: totals.chats + item.chats,
      messages: totals.messages + item.totalMessages,
      documents: totals.documents + item.documents,
    }),
    { chats: 0, messages: 0, documents: 0 }
  )

export const shortenEntityId = (id: string, start = 6, end = 6) => {
  if (id.length <= start + end + 3) {
    return id
  }

  return `${id.slice(0, start)}...${id.slice(-end)}`
}

export const buildSenderChartData = (
  overview: StatsOverviewRes | undefined
): SenderChartDatum[] => {
  if (!overview) {
    return []
  }

  const senderData: SenderChartDatum[] = [
    {
      sender: "user",
      value: overview.messagesBySender.user,
      fill: "var(--color-user)",
    },
    {
      sender: "ai",
      value: overview.messagesBySender.ai,
      fill: "var(--color-ai)",
    },
    {
      sender: "system",
      value: overview.messagesBySender.system,
      fill: "var(--color-system)",
    },
  ]

  return senderData.filter((item) => item.value > 0)
}

export const hasAnyStats = (
  overview: StatsOverviewRes | undefined,
  users: UsersStatsRes | undefined,
  documents: DocumentsStatsRes | undefined,
  stats: ChatsStatsRes | undefined
) =>
  Boolean(
    overview?.totalChats ||
      overview?.totalMessages ||
      overview?.totalDocuments ||
      overview?.uniqueUsers ||
      users?.uniqueUsers ||
      documents?.totalDocuments ||
      stats?.avgLifespan.chatCount
  )
