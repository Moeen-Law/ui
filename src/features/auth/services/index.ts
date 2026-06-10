import api from "@/shared/api";
import request from "@/shared/api/request";
import { authService } from "../helpers";
import type { ProfileResponse, userSessionRes } from "../types";


export const fetchMe = () => request<ProfileResponse>(api.get(`${authService}/profile`));

export const userSessions = () => request<userSessionRes[]>(api.get(`${authService}/auth/sessions`));

export const sessionLogout = (id: string) => request<{message: string}>(api.delete(`${authService}/auth/sessions/${id}`));

export const logoutAll = () => request<{message: string}>(api.delete(`${authService}/auth/sessions`));  