interface ActivitySummaryStatProps {
  label: string
  value: string
}

export default function ActivitySummaryStat({
  label,
  value,
}: ActivitySummaryStatProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-3">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black tabular-nums">{value}</p>
    </div>
  )
}
