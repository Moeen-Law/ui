import {
  keepPreviousData,
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import {
  deleteUser,
  getAllUsers,
  getUser,
  toggleActivation,
  toggleUserRoles,
  UsersStats,
} from "../services"
import type { GetUsersParams, ToggleUserRolesParams } from "../types"

const adminUsersKeys = {
  all: ["admin", "users"] as const,
  list: (params: GetUsersParams) => ["admin", "users", "list", params] as const,
  detail: (id: string) => ["admin", "users", "detail", id] as const,
  stats: ["admin", "users", "stats"] as const,
}

const usersListStaleTime = 30_000

export const useAdminUsers = (params: GetUsersParams) =>
  useQuery({
    queryKey: adminUsersKeys.list(params),
    queryFn: () => getAllUsers(params),
    placeholderData: keepPreviousData,
    staleTime: usersListStaleTime,
  })

export const prefetchAdminUsers = (
  queryClient: QueryClient,
  params: GetUsersParams
) =>
  queryClient.prefetchQuery({
    queryKey: adminUsersKeys.list(params),
    queryFn: () => getAllUsers(params),
    staleTime: usersListStaleTime,
  })

export const useAdminUser = (id: string | undefined) =>
  useQuery({
    queryKey: id ? adminUsersKeys.detail(id) : ["admin", "users", "detail", "idle"],
    queryFn: () => getUser(id ?? ""),
    enabled: Boolean(id),
    staleTime: 30_000,
  })

export const useAdminUserStats = () =>
  useQuery({
    queryKey: adminUsersKeys.stats,
    queryFn: UsersStats,
    staleTime: 30_000,
  })

const useInvalidateAdminUsers = () => {
  const queryClient = useQueryClient()

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.all }),
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.stats }),
    ])
}

export const useToggleUserActivation = () => {
  const invalidateAdminUsers = useInvalidateAdminUsers()

  return useMutation({
    mutationFn: toggleActivation,
    onSuccess: () => {
      void invalidateAdminUsers()
    },
  })
}

export const useDeleteAdminUser = () => {
  const invalidateAdminUsers = useInvalidateAdminUsers()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      void invalidateAdminUsers()
    },
  })
}

export const useToggleAdminUserRole = () => {
  const invalidateAdminUsers = useInvalidateAdminUsers()

  return useMutation({
    mutationFn: (params: ToggleUserRolesParams) => toggleUserRoles(params),
    onSuccess: () => {
      void invalidateAdminUsers()
    },
  })
}

export { adminUsersKeys }
