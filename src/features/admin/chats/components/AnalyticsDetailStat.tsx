interface AnalyticsDetailStatProps {
  label: string
  value: string
}

export default function AnalyticsDetailStat({
  label,
  value,
}: AnalyticsDetailStatProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-3">
      <p className="truncate text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-black tabular-nums">{value}</p>
    </div>
  )
}
