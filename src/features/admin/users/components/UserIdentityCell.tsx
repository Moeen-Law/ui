import { Copy } from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import type { User } from "../types"
import { getUserInitials } from "../helpers"

interface UserIdentityCellProps {
  user: User
}

export default function UserIdentityCell({ user }: UserIdentityCellProps) {
  const { t } = useTranslation()
  const name = user.name || t("admin.users.identity.unknown")

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user.id)
      toast.success(t("admin.users.identity.copied"))
    } catch {
      toast.error(t("admin.users.identity.copyFailed"))
    }
  }

  return (
    <div className="flex min-w-[220px] items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">
        {getUserInitials(name)}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <p className="truncate text-sm font-bold text-foreground">{name}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={t("admin.users.identity.copy")}
            onClick={copyId}
          >
            <Copy />
          </Button>
        </div>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        <p className="truncate font-mono text-[0.7rem] text-muted-foreground">
          {user.id}
        </p>
      </div>
    </div>
  )
}
