import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"
import { useTranslation } from "react-i18next"
import { AlertCircle, Loader2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ActivityChartDatum, ActivityTotals } from "../helpers"
import { formatActivityRange, formatNumber } from "../helpers"
import type { ActivityInterval, ActivityStatsParams } from "../types"
import ActivitySummaryStat from "./ActivitySummaryStat"

interface ChatActivityChartProps {
  data: ActivityChartDatum[]
  totals: ActivityTotals
  params: ActivityStatsParams
  locale: string
  loading: boolean
  fetching: boolean
  error: boolean
  onRetry: () => void
  onParamsChange: (params: ActivityStatsParams) => void
  onReset: () => void
}

const chartConfig = {
  chats: {
    label: "Chats",
    color: "var(--chart-1)",
  },
  userMessages: {
    label: "User",
    color: "var(--chart-2)",
  },
  aiMessages: {
    label: "AI",
    color: "var(--chart-4)",
  },
  systemMessages: {
    label: "System",
    color: "var(--chart-5)",
  },
  documents: {
    label: "Documents",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const intervals: ActivityInterval[] = ["day", "week", "month"]

export default function ChatActivityChart({
  data,
  totals,
  params,
  locale,
  loading,
  fetching,
  error,
  onRetry,
  onParamsChange,
  onReset,
}: ChatActivityChartProps) {
  const { t } = useTranslation()
  const localizedConfig = {
    chats: {
      ...chartConfig.chats,
      label: t("admin.chats.charts.activity.chats"),
    },
    userMessages: {
      ...chartConfig.userMessages,
      label: t("admin.chats.sender.user"),
    },
    aiMessages: {
      ...chartConfig.aiMessages,
      label: t("admin.chats.sender.ai"),
    },
    systemMessages: {
      ...chartConfig.systemMessages,
      label: t("admin.chats.sender.system"),
    },
    documents: {
      ...chartConfig.documents,
      label: t("admin.chats.charts.activity.documents"),
    },
  } satisfies ChartConfig
  const range = formatActivityRange(params, locale)

  return (
    <Card className="h-full min-h-[500px] rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="gap-5 px-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-xl font-black">
              {t("admin.chats.charts.activity.title")}
            </CardTitle>
            <CardDescription>
              {range
                ? t("admin.chats.charts.activity.rangeDescription", {
                    interval: t(`admin.chats.filters.interval.${params.interval}`),
                    range,
                  })
                : t("admin.chats.charts.activity.description")}
            </CardDescription>
          </div>

          <div className="flex flex-col gap-3">
            {fetching ? (
              <div className="flex items-center gap-2 self-start rounded-lg border border-border/70 bg-background/50 px-3 py-1.5 text-xs font-bold text-muted-foreground xl:self-end">
                <Loader2 className="size-3.5 animate-spin" />
                {t("admin.chats.charts.activity.updating")}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {intervals.map((interval) => (
                <Button
                  key={interval}
                  type="button"
                  variant={params.interval === interval ? "default" : "outline"}
                  size="sm"
                  onClick={() => onParamsChange({ ...params, interval })}
                >
                  {t(`admin.chats.filters.interval.${interval}`)}
                </Button>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="date"
                value={params.from ?? ""}
                aria-label={t("admin.chats.filters.from")}
                onChange={(event) =>
                  onParamsChange({ ...params, from: event.target.value || undefined })
                }
              />
              <Input
                type="date"
                value={params.to ?? ""}
                aria-label={t("admin.chats.filters.to")}
                onChange={(event) =>
                  onParamsChange({ ...params, to: event.target.value || undefined })
                }
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onReset}
                aria-label={t("admin.chats.filters.reset")}
              >
                <RotateCcw data-icon="inline-start" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-3 pt-2 sm:px-6">
        {error ? (
          <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
            <div className="flex items-center gap-2 font-bold text-destructive">
              <AlertCircle className="size-4" />
              {t("admin.chats.charts.activity.errorTitle")}
            </div>
            <p className="text-muted-foreground">
              {t("admin.chats.charts.activity.errorDescription")}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              {t("admin.chats.error.retry")}
            </Button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ActivitySummaryStat
            label={t("admin.chats.charts.activity.chats")}
            value={formatNumber(totals.chats, locale)}
          />
          <ActivitySummaryStat
            label={t("admin.chats.charts.activity.messages")}
            value={formatNumber(totals.messages, locale)}
          />
          <ActivitySummaryStat
            label={t("admin.chats.charts.activity.documents")}
            value={formatNumber(totals.documents, locale)}
          />
        </div>

        <div className="relative">
          {data.length > 0 ? (
            <ChartContainer
              config={localizedConfig}
              className="h-[340px] w-full"
              initialDimension={{ width: 700, height: 340 }}
            >
              <ComposedChart data={data} accessibilityLayer margin={{ left: 0, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} width={44} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="chats"
                  fill="var(--color-chats)"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  dataKey="userMessages"
                  type="monotone"
                  stroke="var(--color-userMessages)"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  dataKey="aiMessages"
                  type="monotone"
                  stroke="var(--color-aiMessages)"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  dataKey="systemMessages"
                  type="monotone"
                  stroke="var(--color-systemMessages)"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  dataKey="documents"
                  type="monotone"
                  stroke="var(--color-documents)"
                  strokeWidth={3}
                  dot={false}
                />
              </ComposedChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[340px] items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground">
              {loading ? t("admin.chats.charts.activity.loading") : t("admin.chats.empty.chart")}
            </div>
          )}

          {fetching && data.length > 0 ? (
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-card/30 backdrop-blur-[1px]" />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
