import { Copy } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { shortenPaymentId } from "../helpers"

interface PaymentUserIdentityProps {
  userId: string
  className?: string
}

export default function PaymentUserIdentity({
  userId,
  className,
}: PaymentUserIdentityProps) {
  const { t } = useTranslation()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userId)
      toast.success(t("admin.payments.identity.copied"))
    } catch {
      toast.error(t("admin.payments.identity.copyFailed"))
    }
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-foreground" title={userId}>
          {shortenPaymentId(userId)}
        </p>
        <p className="truncate text-xs text-muted-foreground" title={userId}>
          {userId}
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
        aria-label={t("admin.payments.identity.copy")}
      >
        <Copy data-icon="inline-start" />
      </Button>
    </div>
  )
}
