export interface DailyQuotaRes { date: Date; quotas: Quota[]; }
export interface Quota { feature: "chat" | "doc_analysis" | "doc_gen"; limit: number; remaining: number; used: number; }
