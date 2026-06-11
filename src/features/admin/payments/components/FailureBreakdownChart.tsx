import { useTranslation } from "react-i18next"
import { Cell, Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { FailureChartDatum } from "../helpers"
import { formatNumber } from "../helpers"

interface FailureBreakdownChartProps {
  data: FailureChartDatum[]
  locale: string
}

export default function FailureBreakdownChart({
  data,
  locale,
}: FailureBreakdownChartProps) {
  const { t } = useTranslation()
  const totalFailures = data.reduce((total, item) => total + item.count, 0)
  const chartConfig = data.reduce<ChartConfig>(
    (config, item) => ({
      ...config,
      [item.reason]: {
        label: item.reason,
        color: item.fill,
      },
    }),
    {
      count: {
        label: t("admin.payments.charts.failures.title"),
      },
    }
  )

  return (
    <Card className="h-full min-h-[430px] rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="gap-2 px-6">
        <CardTitle className="text-xl font-black">
          {t("admin.payments.charts.failures.title")}
        </CardTitle>
        <CardDescription>
          {t("admin.payments.charts.failures.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pt-4">
        {data.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto h-[320px] w-full"
            initialDimension={{ width: 420, height: 320 }}
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    nameKey="reason"
                    formatter={(value, name, item) => (
                      <div className="flex min-w-36 items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {String(name)}
                        </span>
                        <span className="font-mono font-medium text-foreground">
                          {formatNumber(Number(value), locale)}
                          {typeof item.payload?.percentage === "number"
                            ? ` (${formatNumber(item.payload.percentage, locale)}%)`
                            : ""}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="reason"
                innerRadius={76}
                outerRadius={112}
                paddingAngle={data.length > 1 ? 3 : 0}
                strokeWidth={3}
              >
                {data.map((item, index) => (
                  <Cell key={`${item.reason}-${index}`} fill={item.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                      return null
                    }

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-black"
                        >
                          {formatNumber(totalFailures, locale)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground text-xs font-bold"
                        >
                          {t("admin.payments.charts.activity.failed")}
                        </tspan>
                      </text>
                    )
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground">
            {t("admin.payments.empty.failures")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
