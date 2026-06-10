import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dailyQuotaKeys } from "@/features/chat/hooks/useDailyQuota";
import { generateDocument } from "../services";
import { documentGenerationKeys } from "./queryKeys";

export const useGenerateDocument = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: generateDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: documentGenerationKeys.documents(),
            });
            queryClient.invalidateQueries({
                queryKey: dailyQuotaKeys.all,
            });
        },
    });

    return {
        generateDocument: mutation.mutate,
        generateDocumentAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error,
    };
};
