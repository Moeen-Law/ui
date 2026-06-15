import { MoreHorizontal, Power, ShieldCheck, ShieldMinus, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User, UserActionTarget } from "../types"
import { getRoleAction, isRoleActionDisabled } from "../helpers"

interface UserActionsProps {
  user: User
  disabled: boolean
  onSelect: (target: UserActionTarget) => void
}

const roles = ["USER", "ADMIN"] as const

export default function UserActions({ user, disabled, onSelect }: UserActionsProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="cursor-pointer hover:bg-primary/10 hover:text-primary aria-expanded:bg-primary/10 aria-expanded:text-primary"
          aria-label={t("admin.users.actions.openMenu")}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52 border-border/80 bg-popover/95 shadow-[0_18px_60px_var(--admin-glow)]">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer focus:bg-primary/10 focus:text-primary data-disabled:cursor-not-allowed"
            disabled={user.deleted}
            onSelect={() => {
              onSelect({ action: "toggleActivation", user })
            }}
          >
            <Power />
            {t(
              user.active
                ? "admin.users.actions.deactivate"
                : "admin.users.actions.activate"
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer data-disabled:cursor-not-allowed"
            disabled={user.deleted}
            onSelect={() => {
              onSelect({ action: "delete", user })
            }}
          >
            <Trash2 />
            {t("admin.users.actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t("admin.users.actions.roles")}</DropdownMenuLabel>
        <DropdownMenuGroup>
          {roles.map((role) => {
            const roleAction = getRoleAction(user, role)

            return (
              <DropdownMenuItem
                key={role}
                className="cursor-pointer focus:bg-primary/10 focus:text-primary data-disabled:cursor-not-allowed"
                disabled={isRoleActionDisabled(user)}
                onSelect={() => {
                  onSelect({ action: roleAction, role, user })
                }}
              >
                {roleAction === "promote" ? <ShieldCheck /> : <ShieldMinus />}
                {t(`admin.users.actions.${roleAction}Role`, {
                  role: t(`admin.users.roles.${role}`),
                })}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
