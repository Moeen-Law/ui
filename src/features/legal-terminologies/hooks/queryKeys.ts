import type { FetchLegalTerminologiesParams } from "../types";

export const legalTerminologyKeys = {
    all: ["legal-terminologies"] as const,
    lists: () => [...legalTerminologyKeys.all, "list"] as const,
    list: (params: FetchLegalTerminologiesParams) =>
        [...legalTerminologyKeys.lists(), params] as const,
    details: () => [...legalTerminologyKeys.all, "detail"] as const,
    detail: (id: string) => [...legalTerminologyKeys.details(), id] as const,
};
