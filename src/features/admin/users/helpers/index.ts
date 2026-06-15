import type {
  GetUsersParams,
  SubscriptionInfo,
  User,
  UserRole,
  UserStats,
  UsersDeletedFilter,
  UsersEmailVerifiedFilter,
  UsersFilters,
  UsersStatusFilter,
} from "../types"

type IntlLocale = string | undefined

export type RegistrationWindowDatum = {
  key: keyof Pick<
    UserStats,
    | "usersRegisteredLast24Hours"
    | "usersRegisteredLast48Hours"
    | "usersRegisteredLastWeek"
    | "usersRegisteredLastMonth"
    | "usersRegisteredLast3Months"
    | "usersRegisteredLastYear"
  >
  labelKey: string
  users: number
}

export type StatusBreakdownDatum = {
  status: "active" | "banned" | "deleted"
  labelKey: string
  users: number
  fill: string
}

export const defaultUsersFilters: UsersFilters = {
  deleted: "all",
  emailVerified: "all",
  search: "",
  searchField: "name",
  status: "all",
}

export const formatNumber = (
  value: number,
  locale: IntlLocale,
  compact = false
) =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(value)

export const formatDate = (
  value: Date | string | null | undefined,
  locale: IntlLocale
) => {
  if (!value) {
    return "-"
  }

  const date = new Date(value)

  if (!Number.isFinite(date.getTime())) {
    return "-"
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export const getUserInitials = (name: string | undefined) => {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? []

  if (!words.length) {
    return "U"
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

export const getPrimarySubscription = (
  subscriptions: SubscriptionInfo[] | undefined
) =>
  subscriptions?.find((subscription) => subscription.status === "ACTIVE") ??
  subscriptions?.[0]

export const getUserStatus = (user: User): Exclude<UsersStatusFilter, "all"> =>
  user.active ? "active" : "banned"

export const getRoleAction = (
  user: User,
  role: UserRole
): "promote" | "demote" => (user.roles.includes(role) ? "demote" : "promote")

export const isRoleActionDisabled = (user: User) => user.deleted

export const buildUsersParams = (
  filters: UsersFilters,
  page: number,
  size: number
): GetUsersParams => {
  const params: GetUsersParams = { page, size }
  const search = filters.search.trim()

  if (search) {
    params[filters.searchField] = search
  }

  if (filters.status === "active") {
    params.active = true
  }

  if (filters.status === "banned") {
    params.active = false
  }

  if (filters.deleted !== "all") {
    params.deleted = filters.deleted === "deleted"
  }

  if (filters.emailVerified !== "all") {
    params.emailVerified = filters.emailVerified === "verified"
  }

  return params
}

export const buildRegistrationWindowData = (
  stats: UserStats | undefined
): RegistrationWindowDatum[] => [
  {
    key: "usersRegisteredLast24Hours",
    labelKey: "admin.users.charts.registrations.windows.last24Hours",
    users: stats?.usersRegisteredLast24Hours ?? 0,
  },
  {
    key: "usersRegisteredLast48Hours",
    labelKey: "admin.users.charts.registrations.windows.last48Hours",
    users: stats?.usersRegisteredLast48Hours ?? 0,
  },
  {
    key: "usersRegisteredLastWeek",
    labelKey: "admin.users.charts.registrations.windows.lastWeek",
    users: stats?.usersRegisteredLastWeek ?? 0,
  },
  {
    key: "usersRegisteredLastMonth",
    labelKey: "admin.users.charts.registrations.windows.lastMonth",
    users: stats?.usersRegisteredLastMonth ?? 0,
  },
  {
    key: "usersRegisteredLast3Months",
    labelKey: "admin.users.charts.registrations.windows.last3Months",
    users: stats?.usersRegisteredLast3Months ?? 0,
  },
  {
    key: "usersRegisteredLastYear",
    labelKey: "admin.users.charts.registrations.windows.lastYear",
    users: stats?.usersRegisteredLastYear ?? 0,
  },
]

export const buildStatusBreakdownData = (
  stats: UserStats | undefined
): StatusBreakdownDatum[] => [
  {
    fill: "var(--chart-1)",
    labelKey: "admin.users.status.active",
    status: "active",
    users: stats?.activeUsers ?? 0,
  },
  {
    fill: "var(--chart-5)",
    labelKey: "admin.users.status.banned",
    status: "banned",
    users: stats?.bannedUsers ?? 0,
  },
  {
    fill: "var(--chart-3)",
    labelKey: "admin.users.deleted.yes",
    status: "deleted",
    users: stats?.deletedUsers ?? 0,
  },
]

export const hasUsersData = (stats: UserStats | undefined, usersCount: number) =>
  Boolean(
    usersCount ||
      stats?.totalUsers ||
      stats?.activeUsers ||
      stats?.bannedUsers ||
      stats?.deletedUsers
  )

export const getDeletedFilterBoolean = (
  filter: UsersDeletedFilter
): boolean | undefined =>
  filter === "all" ? undefined : filter === "deleted"

export const getEmailVerifiedFilterBoolean = (
  filter: UsersEmailVerifiedFilter
): boolean | undefined =>
  filter === "all" ? undefined : filter === "verified"
