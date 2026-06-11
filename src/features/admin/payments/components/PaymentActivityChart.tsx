import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"
import { AlertCircle, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  PaymentActivityDatum,
  PaymentActivityTotals,
} from "../helpers"
import { formatCurrency, formatNumber } from "../helpers"
import type { PaymentStatsGranularity } from "../types"

interface PaymentActivityChartProps {
  data: PaymentActivityDatum[]
  totals: PaymentActivityTotals
  currency: string
  granularity: PaymentStatsGranularity
  locale: string
  loading: boolean
  fetching: boolean
  error: boolean
  onRetry: () => void
  onGranularityChange: (granularity: PaymentStatsGranularity) => void
}

const granularities: PaymentStatsGranularity[] = ["DAILY", "WEEKLY", "MONTHLY"]

const chartConfig = {
  failureCount: {
    label: "Failed",
    color: "var(--chart-5)",
  },
  paymentCount: {
    label: "Payments",
    color: "var(--chart-2)",
  },
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  successCount: {
    label: "Successful",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export default function PaymentActivityChart({
  data,
  totals,
  currency,
  granularity,
  locale,
  loading,
  fetching,
  error,
  onRetry,
  onGranularityChange,
}: PaymentActivityChartProps) {
  const { t } = useTranslation()
  const localizedConfig = {
    failureCount: {
      ...chartConfig.failureCount,
      label: t("admin.payments.charts.activity.failed"),
    },
    paymentCount: {
      ...chartConfig.paymentCount,
      label: t("admin.payments.charts.activity.payments"),
    },
    revenue: {
      ...chartConfig.revenue,
      label: t("admin.payments.charts.activity.revenue"),
    },
    successCount: {
      ...chartConfig.successCount,
      label: t("admin.payments.charts.activity.successful"),
    },
  } satisfies ChartConfig

  return (
    <Card className="h-full min-h-[500px] rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="gap-5 px-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-xl font-black">
              {t("admin.payments.charts.activity.title")}
            </CardTitle>
            <CardDescription>
              {t("admin.payments.charts.activity.description")}
            </CardDescription>
          </div>

          <div className="flex flex-col gap-3 xl:items-end">
            {fetching ? (
              <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/50 px-3 py-1.5 text-xs font-bold text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                {t("admin.payments.charts.activity.updating")}
              </div>
            ) : null}
            <Select
              value={granularity}
              onValueChange={(value) =>
                onGranularityChange(value as PaymentStatsGranularity)
              }
            >
              <SelectTrigger aria-label={t("admin.payments.filters.granularity")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {granularities.map((item) => (
                    <SelectItem key={item} value={item}>
                      {t(`admin.payments.filters.granularities.${item}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-3 pt-2 sm:px-6">
        {error ? (
          <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
            <div className="flex items-center gap-2 font-bold text-destructive">
              <AlertCircle className="size-4" />
              {t("admin.payments.charts.activity.errorTitle")}
            </div>
            <p className="text-muted-foreground">
              {t("admin.payments.charts.activity.errorDescription")}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              {t("admin.payments.error.retry")}
            </Button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryStat
            label={t("admin.payments.charts.activity.revenue")}
            value={formatCurrency(totals.revenue, locale, currency, true)}
          />
          <SummaryStat
            label={t("admin.payments.charts.activity.payments")}
            value={formatNumber(totals.paymentCount, locale)}
          />
          <SummaryStat
            label={t("admin.payments.charts.activity.failed")}
            value={formatNumber(totals.failureCount, locale)}
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
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  yAxisId="revenue"
                  tickLine={false}
                  axisLine={false}
                  width={64}
                  tickFormatter={(value) => formatCurrency(Number(value), locale, currency, true)}
                />
                <YAxis
                  yAxisId="count"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  width={42}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  yAxisId="revenue"
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  yAxisId="count"
                  dataKey="paymentCount"
                  type="monotone"
                  stroke="var(--color-paymentCount)"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  yAxisId="count"
                  dataKey="successCount"
                  type="monotone"
                  stroke="var(--color-successCount)"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  yAxisId="count"
                  dataKey="failureCount"
                  type="monotone"
                  stroke="var(--color-failureCount)"
                  strokeWidth={3}
                  dot={false}
                />
              </ComposedChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[340px] items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground">
              {loading
                ? t("admin.payments.charts.activity.loading")
                : t("admin.payments.empty.chart")}
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

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/45 p-4">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-black text-foreground">{value}</p>
    </div>
  )
}
