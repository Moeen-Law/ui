import { chatService } from "@/features/chat/helpers";
import api from "@/shared/api";
import request from "@/shared/api/request";
import type {
    ContractAnalysisListResponse,
    ContractAnalysisResponse,
    CreateContractAnalysisRequest,
    FetchContractAnalysesParams,
} from "../types";

export const createContractAnalysis = (filesIds: string[]) => {
    const body: CreateContractAnalysisRequest = { filesIds };

    return request<ContractAnalysisResponse>(
        api.post(`${chatService}/tasks/contract-analysis`, body)
    );
};

export const fetchContractAnalyses = ({
    page = 1,
    size = 10,
    sortOrder = "DESC",
}: FetchContractAnalysesParams = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sortOrder,
    });

    return request<ContractAnalysisListResponse>(
        api.get(`${chatService}/tasks/contract-analysis?${params.toString()}`)
    );
};

export const fetchContractAnalysis = (id: string) =>
    request<ContractAnalysisResponse>(
        api.get(`${chatService}/tasks/contract-analysis/${id}`)
    );


