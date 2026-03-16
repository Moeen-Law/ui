import api from "@/shared/api";
import request from "@/shared/api/request";
import { authService } from "../helpers";
import type { ProfileResponse } from "../types";


export const fetchMe = () => request<ProfileResponse>(api.get(`${authService}/profile`));