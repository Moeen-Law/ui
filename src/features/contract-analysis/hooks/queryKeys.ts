import type { FetchContractAnalysesParams } from "../types";

export const contractAnalysisKeys = {
    all: ["contract-analysis"] as const,
    lists: () => [...contractAnalysisKeys.all, "list"] as const,
    list: (params: FetchContractAnalysesParams) =>
        [...contractAnalysisKeys.lists(), params] as const,
    detail: (id: string) => [...contractAnalysisKeys.all, "detail", id] as const,
};
