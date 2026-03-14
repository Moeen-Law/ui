import api from "@/shared/api";
import request from "@/shared/api/request";
import type { ChatResponse } from "../types";


export const fetchChats = () => request(api.get<ChatResponse>("/chat"));