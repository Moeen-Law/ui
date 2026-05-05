import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { adminUsers as initialUsers } from "../data/mockUsers"
import type { AdminUser, UserActionType, UserStatusFilter } from "../types"
import ConfirmUserActionDialog from "../components/ConfirmUserActionDialog"
import UsersPagination from "../components/UsersPagination"
import UsersTable from "../components/UsersTable"
import UsersToolbar from "../components/UsersToolbar"

const PAGE_SIZE = 4

interface PendingAction {
  user: AdminUser
  action: UserActionType
}

export default function AdminUsersPage() {
  const { i18n, t } = useTranslation()
  const locale = i18n.resolvedLanguage?.startsWith("ar") ? "ar" : "en"
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<UserStatusFilter>("all")
  const [page, setPage] = useState(1)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
 
  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesStatus = status === "all" || user.status === status
      const matchesSearch =
        normalizedSearch.length === 0 ||
        user.name.ar.toLowerCase().includes(normalizedSearch) ||
        user.name.en.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.phone.toLowerCase().includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })
  }, [search, status, users])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const resetToFirstPage = () => setPage(1)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    resetToFirstPage()
  }

  const handleStatusChange = (value: UserStatusFilter) => {
    setStatus(value)
    resetToFirstPage()
  }

  const handleRequestAction = (user: AdminUser, action: UserActionType) => {
    setPendingAction({ user, action })
  }

  const handleConfirmAction = () => {
    if (!pendingAction) {
      return
    }

    const { user, action } = pendingAction

    if (action === "delete") {
      setUsers((currentUsers) => currentUsers.filter((item) => item.id !== user.id))
    } else {
      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === user.id
            ? { ...item, status: action === "ban" ? "banned" : "active" }
            : item
        )
      )
    }

    toast.success(t(`admin.users.toast.${action}`, { name: user.name[locale] }))
    setPendingAction(null)
  }

  return (
    <Card className="rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none ring-0">
      <CardHeader className="px-5 md:px-7">
        <UsersToolbar
          search={search}
          status={status}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-7 px-0">
        <UsersTable
          users={paginatedUsers}
          locale={locale}
          onRequestAction={handleRequestAction}
        />
        <div className="px-5 md:px-7">
          <UsersPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </CardContent>
      <ConfirmUserActionDialog
        action={pendingAction?.action ?? null}
        user={pendingAction?.user ?? null}
        locale={locale}
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingAction(null)
          }
        }}
        onConfirm={handleConfirmAction}
      />
    </Card>
  )
}
