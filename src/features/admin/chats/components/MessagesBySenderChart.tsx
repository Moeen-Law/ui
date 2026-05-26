import { Cell, Pie, PieChart } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { SenderChartDatum } from "../helpers"

interface MessagesBySenderChartProps {
  data: SenderChartDatum[]
}

export default function MessagesBySenderChart({ data }: MessagesBySenderChartProps) {
  const { t } = useTranslation()
  const chartConfig = {
    user: {
      label: t("admin.chats.sender.user"),
      color: "var(--chart-1)",
    },
    ai: {
      label: t("admin.chats.sender.ai"),
      color: "var(--chart-2)",
    },
    system: {
      label: t("admin.chats.sender.system"),
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig

  return (
    <Card className="h-full min-h-[430px] rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="gap-2 px-6">
        <CardTitle className="text-xl font-black">
          {t("admin.chats.charts.sender.title")}
        </CardTitle>
        <CardDescription>
          {t("admin.chats.charts.sender.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pt-4">
        {data.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto h-[320px] w-full max-w-[420px]"
            initialDimension={{ width: 420, height: 320 }}
          >
            <PieChart accessibilityLayer>
              <ChartTooltip content={<ChartTooltipContent nameKey="sender" />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="sender"
                innerRadius={70}
                outerRadius={112}
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell key={entry.sender} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="sender" />}
                verticalAlign="bottom"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground">
            {t("admin.chats.empty.chart")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
