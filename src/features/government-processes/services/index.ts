import request from "@/shared/api/request";
import type {
    AllGovernmentProcessesRes,
    FetchGovernmentProcessesParams,
    GovernmentProcessesRes,
} from "../types";
import api from "@/shared/api";
import { chatService } from "@/features/chat/helpers";


export const governmentProcess = (query: string) => request<GovernmentProcessesRes>(api.post(`${chatService}/tasks/government-process` , {query}));

export const governmentProcessById = (id: string) => request<GovernmentProcessesRes>(api.get(`${chatService}/tasks/government-process/${id}`));

export const getAllGovernmentProcess = ({
    page = 1,
    size = 10,
    sortOrder = "DESC",
}: FetchGovernmentProcessesParams = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sortOrder,
    });

    return request<AllGovernmentProcessesRes>(api.get(`${chatService}/tasks/government-process?${params.toString()}`))
}

