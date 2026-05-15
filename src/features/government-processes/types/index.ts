
export interface AllGovernmentProcessesRes {
    data: GovernmentProcessesRes[];
    meta: Meta;
}


export interface GovernmentProcessesRes {
    id: string;
    userId: string;
    taskType: string;
    input: Input;
    result: Result;
    status: string;
    aiTaskId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Input {
    query: string;
}

export interface Result {
    summary: string;
    structured_data: StructuredData;
    sources: GovernmentProcessSource[];
    fallback: boolean;
    fallback_reason: string;
}

export interface StructuredData {
    required_docs: string[];
    estimated_fees: string;
    authority: string;
    steps: string[];
}

export interface GovernmentProcessSource {
    id?: string;
    title?: string;
    excerpt?: string;
    url?: string;
    score?: number;
}

export interface FetchGovernmentProcessesParams {
    page?: number;
    size?: number;
    sortOrder?: "ASC" | "DESC";
}

export interface Meta {
    page: number;
    size: number;
    results: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
