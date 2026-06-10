

// get all plans 
export interface PlanResponse {
    createdAt: Date; 
    description: string;
    durationDays: number;
    id: string;
    isDefault: boolean;
    isBestPlan: boolean;
    maxDocumentAnalysisPerDay: number;
    maxDocumentGenerationPerDay: number;
    maxTextRequestsPerDay: number;
    name: string;
    price: number;
    updatedAt: Date | null;
}

export type PlansResponse = PlanResponse[]; 


// create subscription
export interface CreateSubscriptionResponse {
    autoRenew: boolean;
    createdAt: Date;
    endDate: null;
    id: string;
    planId: string;
    planName: string;
    price: number;
    startDate: null;
    status: string;
    updatedAt: Date;
    userId: string;
}


// payment action
export interface PaymentActionResponse {
    id: string;
    userId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    status: string;
    paymobOrderId: string;
    iframeUrl: string;
    attemptCount: number;
    createdAt: Date;
    updatedAt: null;
}
