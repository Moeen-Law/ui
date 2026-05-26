import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  activityStats,
  chatStats,
  documentsStats,
  overviewStats,
  userStats,
  usersStats,
} from "../services"
import type { ActivityStatsParams } from "../types"

const adminChatsKeys = {
  overview: ["admin", "chats", "overview"] as const,
  activity: (params: ActivityStatsParams) => ["admin", "chats", "activity", params] as const,
  users: ["admin", "chats", "users"] as const,
  user: (userId: string) => ["admin", "chats", "users", userId] as const,
  documents: ["admin", "chats", "documents"] as const,
  chatStats: ["admin", "chats", "chat-stats"] as const,
}

export const useAdminChatsOverview = () =>
  useQuery({
    queryKey: adminChatsKeys.overview,
    queryFn: overviewStats,
  })

export const useAdminChatsActivity = (params: ActivityStatsParams) =>
  useQuery({
    queryKey: adminChatsKeys.activity(params),
    queryFn: () => activityStats(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })

export const useAdminChatsUsers = () =>
  useQuery({
    queryKey: adminChatsKeys.users,
    queryFn: usersStats,
  })

export const useAdminUserStats = (userId: string | undefined) =>
  useQuery({
    queryKey: userId
      ? adminChatsKeys.user(userId)
      : ["admin", "chats", "users", "idle"],
    queryFn: () => userStats(userId as string),
    enabled: Boolean(userId),
  })

export const useAdminChatsDocuments = () =>
  useQuery({
    queryKey: adminChatsKeys.documents,
    queryFn: documentsStats,
  })

export const useAdminChatsStats = () =>
  useQuery({
    queryKey: adminChatsKeys.chatStats,
    queryFn: chatStats,
  })

export { adminChatsKeys }
