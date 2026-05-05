import type { AdminUser } from "../types"

interface UserIdentityCellProps {
  user: AdminUser
  locale: "ar" | "en"
}

export default function UserIdentityCell({ user, locale }: UserIdentityCellProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-black text-foreground">
        {user.initial[locale]}
      </div>
      <div className="min-w-0 text-start">
        <div className="truncate text-base font-black text-foreground">
          {user.name[locale]}
        </div>
        <div className="truncate text-sm text-muted-foreground">{user.email}</div>
      </div>
    </div>
  )
}
