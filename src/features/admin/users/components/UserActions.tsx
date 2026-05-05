import { Ban, Check, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import type { AdminUser, UserActionType } from "../types"

interface UserActionsProps {
  user: AdminUser
  onRequestAction: (user: AdminUser, action: UserActionType) => void
}

export default function UserActions({ user, onRequestAction }: UserActionsProps) {
  const { t } = useTranslation()
  const toggleAction = user.status === "active" ? "ban" : "unban"
  const ToggleIcon = user.status === "active" ? Ban : Check

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={user.status === "active" ? "text-amber-500 cursor-pointer" : "text-emerald-500 cursor-pointer"}
        onClick={() => onRequestAction(user, toggleAction)}
        aria-label={t(`admin.users.actions.${toggleAction}`)}
      >
        <ToggleIcon />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-destructive cursor-pointer"
        onClick={() => onRequestAction(user, "delete")}
        aria-label={t("admin.users.actions.delete")}
      >
        <Trash2 />
      </Button>
    </div>
  )
}
