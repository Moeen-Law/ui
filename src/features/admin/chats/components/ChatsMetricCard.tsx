import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MetricTone = "emerald" | "blue" | "violet" | "amber" | "rose" | "teal"

const toneClasses: Record<MetricTone, string> = {
  emerald: "bg-emerald-500/10 text-emerald-300",
  blue: "bg-blue-500/10 text-blue-300",
  violet: "bg-violet-500/10 text-violet-300",
  amber: "bg-amber-500/10 text-amber-400",
  rose: "bg-rose-500/10 text-rose-300",
  teal: "bg-teal-500/10 text-teal-300",
}

interface ChatsMetricCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  tone: MetricTone
  compact?: boolean
}

export default function ChatsMetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
  compact = false,
}: ChatsMetricCardProps) {
  return (
    <Card
      className={cn(
        "group justify-between rounded-2xl border border-border/80 bg-card/80 px-3 shadow-none ring-0 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/35 hover:bg-card hover:shadow-[0_18px_60px_var(--admin-glow)]",
        compact ? "min-h-32 py-5" : "min-h-40 py-7"
      )}
    >
      <CardHeader className="flex-row items-start justify-between gap-4 px-4">
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
            compact ? "size-12" : "size-[3.75rem]",
            toneClasses[tone]
          )}
        >
          <Icon className={compact ? "size-5" : "size-7"} />
        </div>
        <CardTitle className="text-start text-sm font-bold leading-6 text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-2 px-4">
        <div
          className={cn(
            "font-black leading-none tracking-normal text-foreground",
            compact ? "text-2xl" : "text-4xl"
          )}
        >
          {value}
        </div>
        {description ? (
          <p className="text-xs font-medium leading-5 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
