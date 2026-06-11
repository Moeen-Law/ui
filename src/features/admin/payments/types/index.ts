// full payments stats
export interface PaymentsFullStatsRes {
    summary: Summary;
    timeSeries: PaymentTimeSeriesPoint[];
    failureBreakdown: FailureBreakdown[];
    topUsers: TopUser[];
    stuckPayments: StuckPayment[];
}

export interface FailureBreakdown {
    reason: string;
    count: number;
    percentage: number;
}

export interface StuckPayment {
    paymentId: string;
    userId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    createdAt: string | Date;
    minutesStuck: number;
}

export interface Summary {
    totalRevenue: number;
    totalPayments: number;
    completedPayments: number;
    failedPayments: number;
    pendingPayments: number;
    successRate: number;
    averageTransactionValue: number;
    averageAttemptsPerPayment: number;
    paymentsWithMultipleAttempts: number;
    stuckPendingCount: number;
    reportGeneratedAt: string | Date;
}

export interface PaymentTimeSeriesPoint {
    period: string | Date;
    revenue: number;
    paymentCount: number;
    successCount: number;
    failureCount: number;
}

export interface TopUser {
    userId: string;
    totalSpent: number;
    paymentCount: number;
}


// stats summary 
export interface PaymentStatsSummaryRes {
    totalRevenue: number;
    totalPayments: number;
    completedPayments: number;
    failedPayments: number;
    pendingPayments: number;
    successRate: number;
    averageTransactionValue: number;
    averageAttemptsPerPayment: number;
    paymentsWithMultipleAttempts: number;
    stuckPendingCount: number;
    reportGeneratedAt: string | Date;
}


// stats by specific time
export interface PaymentStatsByTime {
    period: string;
    revenue: number;
    paymentCount: number;
    successCount: number;
    failureCount: number;
}


// failed payments stats
export interface FailedPaymentsStats {
    reason: string;
    count: number;
    percentage: number;
}



// payment top users 
export interface PaymentTopUser  {
    userId: string;
    totalSpent: number;
    paymentCount: number;
}
export type PaymentStatsGranularity = "DAILY" | "WEEKLY" | "MONTHLY";


