

export interface PlanResponse {
    createdAt: Date; 
    description: string;
    durationDays: number;
    id: string;
    isDefault: boolean;
    maxDocumentAnalysisPerDay: number;
    maxDocumentGenerationPerDay: number;
    maxTextRequestsPerDay: number;
    name: string;
    price: number;
    updatedAt: Date | null;
}

export type PlansResponse = PlanResponse[]; 



