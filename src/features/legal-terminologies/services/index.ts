import request from "@/shared/api/request";
import type {
    FetchLegalTerminologiesParams,
    GetAllTerminologiesResponse,
    TerminologyResponse,
} from "../types";
import api from "@/shared/api";
import { chatService } from "@/features/chat/helpers";

export const createLegalTerminology = (terminology: string) =>
    request<TerminologyResponse>(
        api.post(`${chatService}/tasks/legal-terminology`, { terminology })
    );

export const fetchLegalTerminologies = ({
    page = 1,
    size = 10,
    sortOrder = "DESC",
}: FetchLegalTerminologiesParams = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sortOrder,
    });

    return request<GetAllTerminologiesResponse>(
        api.get(`${chatService}/tasks/legal-terminology?${params.toString()}`) 
    );
};

export const fetchLegalTerminology = (id: string) =>
    request<TerminologyResponse>(
        api.get(`${chatService}/tasks/legal-terminology/${id}`)
    );

export const legalTerminologyRequest = createLegalTerminology;
export const getAllTerminologies = fetchLegalTerminologies;
export const getTerminology = fetchLegalTerminology;
