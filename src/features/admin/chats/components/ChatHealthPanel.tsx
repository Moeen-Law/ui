import { Activity } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ChatsStatsRes } from "../types"
import {
  formatDateTime,
  formatDuration,
  formatNumber,
  formatPercent,
} from "../helpers"
import AnalyticsEntityIdentity from "./AnalyticsEntityIdentity"
import AnalyticsMiniStat from "./AnalyticsMiniStat"

interface ChatHealthPanelProps {
  stats: ChatsStatsRes | undefined
  locale: string
}

export default function ChatHealthPanel({ stats, locale }: ChatHealthPanelProps) {
  const { t } = useTranslation()
  const activeChats = stats?.mostActiveChats ?? []

  return (
    <Card className="h-full rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="flex-row items-start justify-between gap-4 px-6">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-black">
            {t("admin.chats.panels.health.title")}
          </CardTitle>
          <CardDescription>{t("admin.chats.panels.health.description")}</CardDescription>
        </div>
        <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
          <Activity className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AnalyticsMiniStat
            label={t("admin.chats.metrics.abandonment")}
            value={formatPercent(stats?.abandonmentRate.rate ?? 0, locale)}
            detail={t("admin.chats.panels.health.abandoned", {
              count: formatNumber(stats?.abandonmentRate.abandonedChats ?? 0, locale),
              total: formatNumber(stats?.abandonmentRate.totalChats ?? 0, locale),
            })}
            variant="large"
          />
          <AnalyticsMiniStat
            label={t("admin.chats.metrics.avgLifespan")}
            value={formatDuration(stats?.avgLifespan.avgLifespanSeconds ?? 0, locale)}
            detail={t("admin.chats.panels.health.sample", {
              count: formatNumber(stats?.avgLifespan.chatCount ?? 0, locale),
            })}
            variant="large"
          />
        </div>

        <div className="flex flex-col gap-3">
          {activeChats.length > 0 ? (
            activeChats.slice(0, 5).map((chat, index) => (
              <div
                key={chat.chatId}
                className="flex min-h-16 items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/40 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Badge variant="secondary" className="size-7 shrink-0 justify-center rounded-full px-0">
                    {formatNumber(index + 1, locale)}
                  </Badge>
                  <div className="min-w-0">
                    <AnalyticsEntityIdentity id={chat.chatId} type="chat" />
                    <p className="truncate text-xs text-muted-foreground">
                      {t("admin.chats.panels.health.range", {
                        first: formatDateTime(chat.firstMessage, locale),
                        last: formatDateTime(chat.lastMessage, locale),
                      })}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-lg font-black tabular-nums">
                  {formatNumber(chat.messageCount, locale)}
                </p>
              </div>
            ))
          ) : (
            <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground">
              {t("admin.chats.empty.activeChats")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
