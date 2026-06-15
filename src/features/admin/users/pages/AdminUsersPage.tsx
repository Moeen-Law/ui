import {
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserPlus,
  UserRoundCheck,
  UserRoundX,
  UsersRound,
} from "lucide-react"
import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useDebounce } from "@/shared/hooks/useDebounce"
import AdminUsersErrorState from "../components/AdminUsersErrorState"
import AdminUsersPageSkeleton from "../components/AdminUsersPageSkeleton"
import ConfirmUserActionDialog from "../components/ConfirmUserActionDialog"
import UsersMetricCard from "../components/UsersMetricCard"
import UsersPagination from "../components/UsersPagination"
import UsersTable from "../components/UsersTable"
import UsersToolbar from "../components/UsersToolbar"
import {
  useAdminUsers,
  useAdminUserStats,
  useDeleteAdminUser,
  prefetchAdminUsers,
  useToggleAdminUserRole,
  useToggleUserActivation,
} from "../hooks"
import {
  buildRegistrationWindowData,
  buildStatusBreakdownData,
  buildUsersParams,
  defaultUsersFilters,
  formatNumber,
  hasUsersData,
} from "../helpers"
import type { UserActionTarget, UsersFilters } from "../types"

const UserRegistrationWindowsChart = lazy(
  () => import("../components/UserRegistrationWindowsChart")
)
const UserStatusBreakdownChart = lazy(
  () => import("../components/UserStatusBreakdownChart")
)

function ChartPanelFallback({ className = "min-h-[430px]" }: { className?: string }) {
  return (
    <div className={`${className} rounded-2xl border border-border/80 bg-card/80`} aria-hidden="true" />
  )
}

export default function AdminUsersPage() {
  const { i18n, t } = useTranslation()
  const locale = i18n.resolvedLanguage ?? i18n.language
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<UsersFilters>(defaultUsersFilters)
  const [actionTarget, setActionTarget] = useState<UserActionTarget | null>(null)
  const debouncedSearch = useDebounce(filters.search, 300)
  const queryClient = useQueryClient()

  const effectiveFilters = useMemo(
    () => ({
      deleted: filters.deleted,
      emailVerified: filters.emailVerified,
      search: debouncedSearch,
      searchField: filters.searchField,
      status: filters.status,
    }),
    [
      debouncedSearch,
      filters.deleted,
      filters.emailVerified,
      filters.searchField,
      filters.status,
    ]
  )

  const usersParams = useMemo(
    () => buildUsersParams(effectiveFilters, page, pageSize),
    [effectiveFilters, page, pageSize]
  )

  const usersQuery = useAdminUsers(usersParams)
  const statsQuery = useAdminUserStats()
  const toggleActivationMutation = useToggleUserActivation()
  const deleteUserMutation = useDeleteAdminUser()
  const toggleRoleMutation = useToggleAdminUserRole()

  const isActionPending =
    toggleActivationMutation.isPending ||
    deleteUserMutation.isPending ||
    toggleRoleMutation.isPending
  const isUsersRefetching = usersQuery.isFetching && !usersQuery.isLoading
  const isFetching = usersQuery.isFetching || statsQuery.isFetching

  const registrationData = useMemo(
    () => buildRegistrationWindowData(statsQuery.data),
    [statsQuery.data]
  )
  const statusData = useMemo(
    () => buildStatusBreakdownData(statsQuery.data),
    [statsQuery.data]
  )

  useEffect(() => {
    const totalPages = usersQuery.data?.totalPages ?? 0

    if (!totalPages) {
      return
    }

    if (page + 1 < totalPages) {
      void prefetchAdminUsers(
        queryClient,
        buildUsersParams(effectiveFilters, page + 1, pageSize)
      )
    }

    if (page > 0) {
      void prefetchAdminUsers(
        queryClient,
        buildUsersParams(effectiveFilters, page - 1, pageSize)
      )
    }
  }, [effectiveFilters, page, pageSize, queryClient, usersQuery.data?.totalPages])

  const retry = () => {
    void usersQuery.refetch()
    void statsQuery.refetch()
  }

  const updateFilters = (nextFilters: UsersFilters) => {
    setPage(0)
    setFilters(nextFilters)
  }

  const updatePageSize = (size: number) => {
    setPage(0)
    setPageSize(size)
  }

  const closeActionDialog = () => {
    if (!isActionPending) {
      setActionTarget(null)
    }
  }

  const confirmAction = () => {
    if (!actionTarget) {
      return
    }

    const name =
      actionTarget.user.name ||
      actionTarget.user.email ||
      t("admin.users.identity.unknown")
    const successToastKey =
      actionTarget.action === "toggleActivation" && actionTarget.user.active
        ? "admin.users.toast.deactivate"
        : actionTarget.action === "toggleActivation"
          ? "admin.users.toast.activate"
          : `admin.users.toast.${actionTarget.action}`
    const mutationOptions = {
      onSuccess: () => {
        toast.success(t(successToastKey, { name }))
      },
      onError: () => {
        toast.error(t("admin.users.toast.error"))
      },
      onSettled: () => {
        setActionTarget(null)
      },
    }

    if (actionTarget.action === "delete") {
      deleteUserMutation.mutate(actionTarget.user.id, mutationOptions)
      return
    }

    if (actionTarget.action === "toggleActivation") {
      toggleActivationMutation.mutate(actionTarget.user.id, mutationOptions)
      return
    }

    if (actionTarget.role) {
      toggleRoleMutation.mutate(
        {
          action: actionTarget.action,
          role: actionTarget.role,
          userId: actionTarget.user.id,
        },
        mutationOptions
      )
    }
  }

  if (usersQuery.isLoading || statsQuery.isLoading) {
    return <AdminUsersPageSkeleton />
  }

  if (usersQuery.isError || statsQuery.isError) {
    return <AdminUsersErrorState onRetry={retry} retrying={isFetching} />
  }

  const users = usersQuery.data?.content ?? []
  const stats = statsQuery.data
  const hasData = hasUsersData(stats, users.length)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-muted-foreground">
            {t("admin.users.subtitle")}
          </p>
          {!hasData ? (
            <p className="text-sm text-muted-foreground">
              {t("admin.users.emptyPage")}
            </p>
          ) : null}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <UsersMetricCard
          title={t("admin.users.metrics.total")}
          value={formatNumber(stats?.totalUsers ?? 0, locale, true)}
          description={t("admin.users.metrics.totalDescription")}
          icon={UsersRound}
          tone="emerald"
        />
        <UsersMetricCard
          title={t("admin.users.metrics.active")}
          value={formatNumber(stats?.activeUsers ?? 0, locale, true)}
          description={t("admin.users.metrics.activeDescription")}
          icon={UserRoundCheck}
          tone="blue"
        />
        <UsersMetricCard
          title={t("admin.users.metrics.banned")}
          value={formatNumber(stats?.bannedUsers ?? 0, locale, true)}
          description={t("admin.users.metrics.bannedDescription")}
          icon={UserRoundX}
          tone="rose"
        />
        <UsersMetricCard
          title={t("admin.users.metrics.deleted")}
          value={formatNumber(stats?.deletedUsers ?? 0, locale, true)}
          description={t("admin.users.metrics.deletedDescription")}
          icon={Trash2}
          tone="amber"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <UsersMetricCard
          compact
          title={t("admin.users.metrics.last24Hours")}
          value={formatNumber(stats?.usersRegisteredLast24Hours ?? 0, locale)}
          icon={UserPlus}
          tone="teal"
        />
        <UsersMetricCard
          compact
          title={t("admin.users.metrics.last48Hours")}
          value={formatNumber(stats?.usersRegisteredLast48Hours ?? 0, locale)}
          icon={UserPlus}
          tone="emerald"
        />
        <UsersMetricCard
          compact
          title={t("admin.users.metrics.lastWeek")}
          value={formatNumber(stats?.usersRegisteredLastWeek ?? 0, locale)}
          icon={ShieldCheck}
          tone="violet"
        />
        <UsersMetricCard
          compact
          title={t("admin.users.metrics.lastMonth")}
          value={formatNumber(stats?.usersRegisteredLastMonth ?? 0, locale)}
          icon={ShieldAlert}
          tone="blue"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <Suspense fallback={<ChartPanelFallback />}>
          <UserRegistrationWindowsChart data={registrationData} locale={locale} />
        </Suspense>
        <Suspense fallback={<ChartPanelFallback />}>
          <UserStatusBreakdownChart data={statusData} locale={locale} />
        </Suspense>
      </section>

      <UsersToolbar
        filters={filters}
        pageSize={pageSize}
        fetching={isFetching}
        onFiltersChange={updateFilters}
        onPageSizeChange={updatePageSize}
        onRefresh={retry}
      />

      <UsersTable
        users={users}
        locale={locale}
        loading={usersQuery.isLoading}
        refetching={isUsersRefetching}
        actionPending={isActionPending}
        onActionSelect={setActionTarget}
      />

      <UsersPagination
        page={usersQuery.data?.page ?? page}
        totalPages={usersQuery.data?.totalPages ?? 0}
        totalElements={usersQuery.data?.totalElements ?? 0}
        locale={locale}
        disabled={usersQuery.isFetching}
        onPageChange={setPage}
      />

      <ConfirmUserActionDialog
        target={actionTarget}
        open={Boolean(actionTarget)}
        pending={isActionPending}
        onOpenChange={(open) => {
          if (!open) {
            closeActionDialog()
          }
        }}
        onConfirm={confirmAction}
      />
    </div>
  )
}
