import { FileText } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DocumentsStatsRes } from "../types"
import { formatDecimal, formatNumber } from "../helpers"
import AnalyticsEntityIdentity from "./AnalyticsEntityIdentity"
import AnalyticsMiniStat from "./AnalyticsMiniStat"

interface DocumentsStatsPanelProps {
  documents: DocumentsStatsRes | undefined
  locale: string
}

export default function DocumentsStatsPanel({
  documents,
  locale,
}: DocumentsStatsPanelProps) {
  const { t } = useTranslation()
  const topUploaders = documents?.topUploaders ?? []

  return (
    <Card className="h-full rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="flex-row items-start justify-between gap-4 px-6">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-black">
            {t("admin.chats.panels.documents.title")}
          </CardTitle>
          <CardDescription>
            {t("admin.chats.panels.documents.description")}
          </CardDescription>
        </div>
        <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
          <FileText className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <AnalyticsMiniStat
            label={t("admin.chats.metrics.documents7d")}
            value={formatNumber(documents?.periods.last7d ?? 0, locale)}
          />
          <AnalyticsMiniStat
            label={t("admin.chats.metrics.documents30d")}
            value={formatNumber(documents?.periods.last30d ?? 0, locale)}
          />
          <AnalyticsMiniStat
            label={t("admin.chats.metrics.avgDocsPerChat")}
            value={formatDecimal(documents?.avgDocumentsPerChat ?? 0, locale)}
          />
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/35 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-muted-foreground">
              {t("admin.chats.metrics.userUploadedDocs")}
            </p>
            <p className="text-2xl font-black tabular-nums">
              {formatNumber(documents?.bySource.USER ?? 0, locale)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {topUploaders.length > 0 ? (
            topUploaders.slice(0, 5).map((uploader, index) => (
              <div
                key={uploader.userId}
                className="flex min-h-16 items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/40 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Badge variant="secondary" className="size-7 shrink-0 justify-center rounded-full px-0">
                    {formatNumber(index + 1, locale)}
                  </Badge>
                  <AnalyticsEntityIdentity id={uploader.userId} type="uploader" />
                </div>
                <p className="shrink-0 text-lg font-black tabular-nums">
                  {formatNumber(uploader.documentCount, locale)}
                </p>
              </div>
            ))
          ) : (
            <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground">
              {t("admin.chats.empty.documents")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
