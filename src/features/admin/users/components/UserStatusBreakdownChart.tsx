import { Cell, Label, Pie, PieChart } from "recharts"
import { useTranslation } from "react-i18next"
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
import type { StatusBreakdownDatum } from "../helpers"
import { formatNumber } from "../helpers"

interface UserStatusBreakdownChartProps {
  data: StatusBreakdownDatum[]
  locale: string
}

export default function UserStatusBreakdownChart({
  data,
  locale,
}: UserStatusBreakdownChartProps) {
  const { t } = useTranslation()
  const localizedData = data.map((item) => ({
    ...item,
    label: t(item.labelKey),
  }))
  const totalUsers = localizedData.reduce((total, item) => total + item.users, 0)
  const chartConfig = localizedData.reduce<ChartConfig>(
    (config, item) => ({
      ...config,
      [item.status]: {
        label: item.label,
        color: item.fill,
      },
    }),
    {
      users: {
        label: t("admin.users.charts.status.users"),
      },
    }
  )

  return (
    <Card className="h-full min-h-[430px] rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="gap-2 px-6">
        <CardTitle className="text-xl font-black">
          {t("admin.users.charts.status.title")}
        </CardTitle>
        <CardDescription>{t("admin.users.charts.status.description")}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pt-4">
        {totalUsers > 0 ? (
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
                    nameKey="label"
                    formatter={(value, name) => (
                      <div className="flex min-w-32 items-center justify-between gap-4">
                        <span className="text-muted-foreground">{String(name)}</span>
                        <span className="font-mono font-medium text-foreground">
                          {formatNumber(Number(value), locale)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={localizedData}
                dataKey="users"
                nameKey="label"
                innerRadius={76}
                outerRadius={112}
                paddingAngle={localizedData.length > 1 ? 3 : 0}
                strokeWidth={3}
              >
                {localizedData.map((item) => (
                  <Cell key={item.status} fill={item.fill} />
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
                          {formatNumber(totalUsers, locale)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground text-xs font-bold"
                        >
                          {t("admin.users.charts.status.users")}
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
            {t("admin.users.empty.chart")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
