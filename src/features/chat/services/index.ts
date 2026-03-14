import api from "@/shared/api";
import request from "@/shared/api/request";
import type { ChatResponse } from "../types";
import { chatService } from "../helpers";

export const fetchChats = () => request(api.get<ChatResponse>(`${chatService}/chat`));