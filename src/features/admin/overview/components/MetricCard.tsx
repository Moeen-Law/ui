import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { MetricCardData, MetricTone } from "@/features/admin/types"

const toneClasses: Record<MetricTone, string> = {
  blue: "bg-emerald-500/10 text-emerald-300",
  emerald: "bg-emerald-500/10 text-emerald-300",
  violet: "bg-teal-500/10 text-teal-300",
  amber: "bg-amber-500/10 text-amber-400",
}

interface MetricCardProps {
  metric: MetricCardData
}

export default function MetricCard({ metric }: MetricCardProps) {
  const { i18n, t } = useTranslation()
  const Icon = metric.icon
  const formattedValue = new Intl.NumberFormat(i18n.resolvedLanguage ?? i18n.language, {
    maximumFractionDigits: metric.format === "compact" ? 1 : 0,
    notation: metric.format === "compact" ? "compact" : "standard",
  }).format(metric.value)

  return (
    <Card className="group min-h-40 justify-between rounded-2xl border border-border/80 bg-card/80 px-3 py-7 shadow-none ring-0 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/35 hover:bg-card hover:shadow-[0_18px_60px_var(--admin-glow)]">
      <CardHeader className="flex-row items-start justify-between gap-4 px-4">
        <div className={cn("flex size-[3.75rem] items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105", toneClasses[metric.tone])}>
          <Icon className="size-7" />
        </div>
        <CardTitle className="text-start text-base font-bold text-muted-foreground">
          {t(metric.title)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3 px-4">
        <div className="text-4xl font-black leading-none tracking-normal text-foreground">
          {formattedValue}
        </div>
      </CardContent>
    </Card>
  )
}
