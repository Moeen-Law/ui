interface AnalyticsMiniStatProps {
  label: string
  value: string
  detail?: string
  variant?: "compact" | "regular" | "large"
}

const variantClasses = {
  compact: {
    container: "min-h-20",
    value: "text-xl",
  },
  regular: {
    container: "min-h-24",
    value: "text-2xl tabular-nums",
  },
  large: {
    container: "min-h-28",
    value: "text-3xl tabular-nums",
  },
} satisfies Record<
  NonNullable<AnalyticsMiniStatProps["variant"]>,
  { container: string; value: string }
>

export default function AnalyticsMiniStat({
  label,
  value,
  detail,
  variant = "regular",
}: AnalyticsMiniStatProps) {
  const classes = variantClasses[variant]

  return (
    <div className={`${classes.container} rounded-xl border border-border/70 bg-background/40 p-3`}>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className={`mt-2 font-black ${classes.value}`}>{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  )
}
