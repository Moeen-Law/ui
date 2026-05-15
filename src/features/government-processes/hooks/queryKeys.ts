import type { FetchGovernmentProcessesParams } from "../types";

export const governmentProcessKeys = {
    all: ["government-processes"] as const,
    lists: () => [...governmentProcessKeys.all, "list"] as const,
    list: (params: FetchGovernmentProcessesParams) =>
        [...governmentProcessKeys.lists(), params] as const,
    details: () => [...governmentProcessKeys.all, "detail"] as const,
    detail: (id: string) => [...governmentProcessKeys.details(), id] as const,
};
