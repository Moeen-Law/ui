import { MoreVertical } from "lucide-react"
import { useId } from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { UsageChartData } from "@/features/admin/types"
import ChartLegendItem from "./ChartLegendItem"

interface UsageChartProps {
  data: UsageChartData
}

const chartWidth = 900
const chartHeight = 300
const padding = {
  top: 18,
  right: 44,
  bottom: 42,
  left: 18,
}

export default function UsageChart({ data }: UsageChartProps) {
  const { i18n, t } = useTranslation()
  const numberFormatter = new Intl.NumberFormat(i18n.resolvedLanguage ?? i18n.language)
  const gradientId = useId().replace(/:/g, "")
  const maxValue = Math.max(...data.series.flatMap((series) => series.values))
  const ticks = [5000, 4500, 4000, 3500, 3000, 2500, 2000, 1500, 1000, 500]

  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom

  const getX = (index: number) =>
    padding.left + (plotWidth / (data.labels.length - 1)) * index

  const getY = (value: number) =>
    padding.top + plotHeight - (value / maxValue) * plotHeight

  return (
    <Card className="group h-full min-h-[430px] rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none ring-0 transition-all duration-300 hover:border-emerald-400/35 hover:bg-card hover:shadow-[0_18px_60px_var(--admin-glow)]">
      <CardHeader className="grid grid-cols-[auto_1fr_auto] items-start gap-4 px-7">
        <MoreVertical className="mt-1 size-5 text-muted-foreground" />
        <div className="flex flex-wrap justify-end gap-5 pt-16 md:pt-14">
          {data.series.map((series) => (
            <ChartLegendItem key={series.label} series={series} />
          ))}
        </div>
        <CardTitle className="text-end text-2xl font-black">
          {t("admin.overview.chart.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-7 pt-8">
        <div className="admin-chart h-[320px] w-full overflow-hidden">
          <svg
            role="img"
            aria-label={t("admin.overview.chart.title")}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              {data.series.map((series, index) => (
                <linearGradient
                  key={series.label}
                  id={`${gradientId}-${index}`}
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={series.color} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={series.color} stopOpacity="0.05" />
                </linearGradient>
              ))}
            </defs>

            {ticks.map((tick) => {
              const y = getY(tick)

              return (
                <g key={tick}>
                  <line
                    x1={padding.left}
                    x2={chartWidth - padding.right}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    className="text-border/70"
                    strokeWidth="1"
                  />
                  <text
                    x={chartWidth - padding.right + 12}
                    y={y + 4}
                    fill="currentColor"
                    className="text-[12px] text-muted-foreground"
                  >
                    {numberFormatter.format(tick)}
                  </text>
                </g>
              )
            })}

            {data.series.map((series, index) => {
              const points = series.values.map((value, pointIndex) => ({
                x: getX(pointIndex),
                y: getY(value),
              }))
              const linePath = createLinePath(points)
              const areaPath = `${linePath} L ${points.at(-1)?.x ?? 0} ${padding.top + plotHeight} L ${points[0]?.x ?? 0} ${padding.top + plotHeight} Z`

              return (
                <g key={series.label}>
                  <path d={areaPath} fill={`url(#${gradientId}-${index})`} className="transition-opacity duration-300 group-hover:opacity-90" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke={series.color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    className="transition-[stroke-width] duration-300 group-hover:stroke-[4]"
                  />
                  {points.map((point) => (
                    <circle
                      key={`${series.label}-${point.x}`}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="var(--card)"
                      stroke={series.color}
                      strokeWidth="3"
                    />
                  ))}
                </g>
              )
            })}

            {data.labels.map((label, index) => (
              <text
                key={label}
                x={getX(index)}
                y={chartHeight - 9}
                fill="currentColor"
                textAnchor="middle"
                className="text-[12px] text-muted-foreground"
              >
                {t(label)}
              </text>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

function createLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return ""
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ")
}
