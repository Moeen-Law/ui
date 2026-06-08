import { useQuery } from "@tanstack/react-query";
import { fetchContractAnalysis } from "../services";
import { contractAnalysisKeys } from "./queryKeys";

export const useOptionalContractAnalysis = (id?: string) => {
    const query = useQuery({
        queryKey: contractAnalysisKeys.detail(id ?? ""),
        queryFn: () => fetchContractAnalysis(id as string),
        enabled: Boolean(id),
    });

    return {
        analysis: query.data,
        refetch: query.refetch,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};
