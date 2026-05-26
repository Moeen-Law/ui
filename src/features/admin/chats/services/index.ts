import request from "@/shared/api/request";
import type { ActivityRes, ActivityStatsParams, ChatsStatsRes, DocumentsStatsRes, StatsOverviewRes, UsersStatsRes, UserStatsRes } from "../types";
import api from "@/shared/api";
import { chatService } from "@/features/chat/helpers";



export const overviewStats = () => request<StatsOverviewRes>(api.get(`${chatService}/admin/stats/overview`));


export const activityStats = (params?: ActivityStatsParams) => request<ActivityRes>(api.get(`${chatService}/admin/stats/activity`, { params }));


export const usersStats = () => request<UsersStatsRes>(api.get(`${chatService}/admin/stats/users`));


export const userStats = (id: string) => request<UserStatsRes>(api.get(`${chatService}/admin/stats/users/${id}`));


export const documentsStats = () => request<DocumentsStatsRes>(api.get(`${chatService}/admin/stats/documents`));


export const chatStats = () => request<ChatsStatsRes>(api.get(`${chatService}/admin/stats/chats`));

