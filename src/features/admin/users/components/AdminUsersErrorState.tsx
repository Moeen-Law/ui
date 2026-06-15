import { AlertTriangle, RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

interface AdminUsersErrorStateProps {
  onRetry: () => void
  retrying: boolean
}

export default function AdminUsersErrorState({
  onRetry,
  retrying,
}: AdminUsersErrorStateProps) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-black">{t("admin.users.error.title")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {t("admin.users.error.description")}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onRetry} disabled={retrying}>
          <RefreshCw data-icon="inline-start" />
          {t("admin.users.error.retry")}
        </Button>
      </div>
    </div>
  )
}
