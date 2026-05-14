import type { TerminologiesDatum, TerminologyResponse } from "../types";

export const historyToResponse = (item: TerminologiesDatum): TerminologyResponse => ({
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
