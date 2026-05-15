import type { GovernmentProcessesRes } from "../types";

export const historyToGovernmentProcessResponse = (
    item: GovernmentProcessesRes
): GovernmentProcessesRes => ({
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
