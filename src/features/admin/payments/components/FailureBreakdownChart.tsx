import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { FailureChartDatum } from "../helpers"
import { formatNumber, formatPercent } from "../helpers"

interface FailureBreakdownChartProps {
  data: FailureChartDatum[]
  locale: string
}

export default function FailureBreakdownChart({
  data,
  locale,
}: FailureBreakdownChartProps) {
  const { t } = useTranslation()
  const maxCount = data.reduce((max, item) => Math.max(max, item.count), 0)

  return (
    <Card className="h-full min-h-[430px] rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="gap-2 px-6">
        <CardTitle className="text-xl font-black">
          {t("admin.payments.charts.failures.title")}
        </CardTitle>
        <CardDescription>
          {t("admin.payments.charts.failures.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 pt-4">
        {data.length > 0 ? (
          data.map((item, index) => {
            const width = maxCount > 0 ? Math.max((item.count / maxCount) * 100, 4) : 0

            return (
              <div
                key={`${item.reason}-${index}`}
                className="rounded-xl border border-border/70 bg-background/45 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground" title={item.reason}>
                      {item.reason}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatPercent(item.percentage, locale)}
                    </p>
                  </div>
                  <p className="shrink-0 text-lg font-black text-foreground">
                    {formatNumber(item.count, locale)}
                  </p>
                </div>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: item.fill,
                      width: `${width}%`,
                    }}
                  />
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground">
            {t("admin.payments.empty.failures")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
