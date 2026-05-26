import { AlertCircle, RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AdminChatsErrorStateProps {
  onRetry: () => void
  retrying?: boolean
}

export default function AdminChatsErrorState({
  onRetry,
  retrying = false,
}: AdminChatsErrorStateProps) {
  const { t } = useTranslation()

  return (
    <Card className="rounded-2xl border border-border/80 bg-card/80 py-12 shadow-none">
      <CardContent className="flex flex-col items-center gap-5 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="size-7" />
        </div>
        <div className="flex max-w-md flex-col gap-2">
          <h2 className="text-xl font-black">{t("admin.chats.error.title")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {t("admin.chats.error.description")}
          </p>
        </div>
        <Button type="button" onClick={onRetry} disabled={retrying}>
          <RefreshCw data-icon="inline-start" />
          {t("admin.chats.error.retry")}
        </Button>
      </CardContent>
    </Card>
  )
}
