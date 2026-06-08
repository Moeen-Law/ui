import type { ContractAnalysisResponse } from "../types";

export const historyToContractAnalysisResponse = (
    item: ContractAnalysisResponse
): ContractAnalysisResponse => ({
    id: item.id,
    userId: item.userId,
    taskType: item.taskType,
    input: item.input,
    result: item.result,
    status: item.status,
    aiTaskId: item.aiTaskId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
});
