import { useTranslation } from "react-i18next"
import type { ChartSeries } from "@/features/admin/types"

interface ChartLegendItemProps {
  series: ChartSeries
}

export default function ChartLegendItem({ series }: ChartLegendItemProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span
        className="size-4 rounded-full ring-2"
        style={{ color: series.color, boxShadow: `inset 0 0 0 2px ${series.color}` }}
      />
      <span>{t(series.label)}</span>
    </div>
  )
}
