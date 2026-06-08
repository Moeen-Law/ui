import type { Meta } from "@/features/chat/types";

export interface CreateContractAnalysisRequest {
    filesIds: string[];
}

export interface ContractAnalysisResponse {
    id: string;
    userId: string;
    taskType: "CONTRACT_ANALYSIS" | string;
    input: ContractAnalysisInput;
    result: ContractAnalysisResult;
    status: ContractAnalysisStatus | string;
    aiTaskId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContractAnalysisInput {
    files_ids: string[];
}

export interface ContractAnalysisResult {
    message?: string;
    sources?: ContractAnalysisSource[];
    intent?: "CONTRACT_ANALYSIS" | string;
}

export type ContractAnalysisStatus = "success" | "completed" | "pending" | "processing" | "failed";

export interface ContractAnalysisSource {
    metadata: ContractAnalysisSourceMetadata;
}

export interface ContractAnalysisSourceMetadata {
    law_name: string;
    article_number: string;
    article_text: string;
    kitab: string | null;
    bab: string | null;
    fasl: string | null;
    law_number: string;
    law_year: string;
    law_type: string;
    domain: string;
}

export interface ContractAnalysisInputFile {
    id: string;
    file: File;
    status: "selected" | "uploading" | "error";
}

export interface ContractAnalysisListResponse {
    data: ContractAnalysisResponse[];
    meta: Meta;
}

export interface FetchContractAnalysesParams {
    page?: number;
    size?: number;
    sortOrder?: "ASC" | "DESC";
}
