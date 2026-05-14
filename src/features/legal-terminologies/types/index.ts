export interface TerminologyResponse {
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
    terminology: string;
}

export interface Result {
    term: string;
    brief_explanation: string;
    examples: string[];
    sources: Source[];
    rag_used: boolean;
    raw_response: string;
}

export interface Source {
    id: string;
    title: string;
    excerpt: string;
    score: number;
}





export interface GetAllTerminologiesResponse {
    data: TerminologiesDatum[];
    meta: Meta;
}

export interface TerminologiesDatum { 
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
 


export interface Meta {
    page: number;
    size: number;
    results: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface FetchLegalTerminologiesParams {
    page?: number;
    size?: number;
    sortOrder?: "ASC" | "DESC";
}
