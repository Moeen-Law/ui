import { Copy } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { shortenEntityId } from "../helpers"

type EntityType = "chat" | "uploader" | "user"

interface AnalyticsEntityIdentityProps {
  id: string
  type: EntityType
  className?: string
}

export default function AnalyticsEntityIdentity({
  id,
  type,
  className,
}: AnalyticsEntityIdentityProps) {
  const { t } = useTranslation()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id)
      toast.success(t("admin.chats.identity.copied"))
    } catch {
      toast.error(t("admin.chats.identity.copyFailed"))
    }
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <div className="min-w-0">
        <p className="truncate text-sm font-black" title={id}>
          {t(`admin.chats.identity.${type}`)} {shortenEntityId(id)}
        </p>
        <p className="truncate text-xs text-muted-foreground" title={id}>
          {id}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="shrink-0 text-muted-foreground"
        onClick={(event) => {
          event.stopPropagation()
          void handleCopy()
        }}
        aria-label={t("admin.chats.identity.copy")}
      >
        <Copy data-icon="inline-start" />
      </Button>
    </div>
  )
}
