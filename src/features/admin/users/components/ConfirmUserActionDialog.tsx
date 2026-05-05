import { Ban, Check, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { AdminUser, UserActionType } from "../types"

interface ConfirmUserActionDialogProps {
  action: UserActionType | null
  user: AdminUser | null
  locale: "ar" | "en"
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export default function ConfirmUserActionDialog({
  action,
  user,
  locale,
  open,
  onOpenChange,
  onConfirm,
}: ConfirmUserActionDialogProps) {
  const { t } = useTranslation()

  if (!action || !user) {
    return null
  }

  const Icon = action === "delete" ? Trash2 : action === "ban" ? Ban : Check

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{t(`admin.users.dialog.${action}.title`)}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(`admin.users.dialog.${action}.description`, {
              name: user.name[locale],
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            variant={action === "delete" ? "destructive" : "default"}
            onClick={onConfirm}
            className="cursor-pointer"
          >
            {t(`admin.users.actions.${action}`)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
