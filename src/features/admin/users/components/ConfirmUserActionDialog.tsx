import { AlertTriangle, Power, ShieldCheck, ShieldMinus, Trash2 } from "lucide-react"
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
import type { UserActionTarget } from "../types"

interface ConfirmUserActionDialogProps {
  target: UserActionTarget | null
  open: boolean
  pending: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

const actionIcon = {
  delete: Trash2,
  demote: ShieldMinus,
  promote: ShieldCheck,
  toggleActivation: Power,
}

export default function ConfirmUserActionDialog({
  target,
  open,
  pending,
  onOpenChange,
  onConfirm,
}: ConfirmUserActionDialogProps) {
  const { t } = useTranslation()
  const action = target?.action ?? "toggleActivation"
  const Icon = actionIcon[action]
  const name = target?.user.name || target?.user.email || t("admin.users.identity.unknown")
  const isDeleteAction = action === "delete"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border/80 bg-card/95 shadow-[0_24px_80px_var(--admin-glow)] backdrop-blur supports-[backdrop-filter]:bg-card/90">
        <AlertDialogHeader>
          <AlertDialogMedia
            className={
              isDeleteAction
                ? "border border-destructive/20 bg-destructive/10 text-destructive"
                : "border border-primary/25 bg-primary/10 text-primary"
            }
          >
            {isDeleteAction ? (
              <AlertTriangle className="text-destructive" />
            ) : (
              <Icon />
            )}
          </AlertDialogMedia>
          <AlertDialogTitle>
            {t(
              action === "toggleActivation" && target?.user.active
                ? "admin.users.dialog.deactivate.title"
                : action === "toggleActivation"
                  ? "admin.users.dialog.activate.title"
                  : `admin.users.dialog.${action}.title`
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              action === "toggleActivation" && target?.user.active
                ? "admin.users.dialog.deactivate.description"
                : action === "toggleActivation"
                  ? "admin.users.dialog.activate.description"
                  : `admin.users.dialog.${action}.description`,
              {
                name,
                role: target?.role ? t(`admin.users.roles.${target.role}`) : "",
              }
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="border-border/80 bg-muted/35">
          <AlertDialogCancel
            className="border-border/80 bg-card hover:border-primary/30 hover:bg-accent"
            disabled={pending}
          >
            {t("admin.users.dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={isDeleteAction ? "destructive" : "default"}
            className={
              isDeleteAction
                ? "border border-destructive/20 hover:bg-destructive/25"
                : "bg-primary text-primary-foreground shadow-[0_10px_30px_var(--admin-glow)] hover:bg-primary/90"
            }
            disabled={pending}
            onClick={(event) => {
              event.preventDefault()
              onConfirm()
            }}
          >
            {pending
              ? t("admin.users.dialog.working")
              : action === "toggleActivation" && target?.user.active
                ? t("admin.users.actions.deactivate")
                : action === "toggleActivation"
                  ? t("admin.users.actions.activate")
                  : t(`admin.users.actions.${action}`)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
