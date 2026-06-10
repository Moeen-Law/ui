import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dailyQuotaKeys } from "@/features/chat/hooks/useDailyQuota";
import { createContractAnalysis } from "../services";
import { contractAnalysisKeys } from "./queryKeys";

export const useCreateContractAnalysis = () => {
    const queryClient = useQueryClient();

    const {
        mutate: analyzeContract,
        mutateAsync: analyzeContractAsync,
        isPending,
        error,
    } = useMutation({
        mutationFn: createContractAnalysis,
        onSuccess: (analysis) => {
            queryClient.invalidateQueries({
                queryKey: contractAnalysisKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: dailyQuotaKeys.all,
            });

            if (typeof analysis.id === "string") {
                queryClient.setQueryData(
                    contractAnalysisKeys.detail(analysis.id),
                    analysis
                );
            }
        },
    });

    return {
        analyzeContract,
        analyzeContractAsync,
        isPending,
        error,
    };
};
