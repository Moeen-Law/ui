import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import type { RegistrationWindowDatum } from "../helpers"
import { formatNumber } from "../helpers"

interface UserRegistrationWindowsChartProps {
  data: RegistrationWindowDatum[]
  locale: string
}

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function UserRegistrationWindowsChart({
  data,
  locale,
}: UserRegistrationWindowsChartProps) {
  const { t } = useTranslation()
  const localizedData = data.map((item) => ({
    ...item,
    label: t(item.labelKey),
  }))
  const hasData = localizedData.some((item) => item.users > 0)
  const localizedConfig = {
    users: {
      ...chartConfig.users,
      label: t("admin.users.charts.registrations.users"),
    },
  } satisfies ChartConfig

  return (
    <Card className="h-full min-h-[430px] rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="gap-2 px-6">
        <CardTitle className="text-xl font-black">
          {t("admin.users.charts.registrations.title")}
        </CardTitle>
        <CardDescription>
          {t("admin.users.charts.registrations.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 pt-4 sm:px-6">
        {hasData ? (
          <ChartContainer
            config={localizedConfig}
            className="h-[320px] w-full"
            initialDimension={{ width: 700, height: 320 }}
          >
            <BarChart data={localizedData} accessibilityLayer margin={{ left: 0, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={42}
                tickFormatter={(value) => formatNumber(Number(value), locale, true)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatNumber(Number(value), locale)}
                  />
                }
              />
              <Bar dataKey="users" fill="var(--color-users)" radius={[6, 6, 0, 0]} />
            </BarChart>
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
