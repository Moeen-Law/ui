import { useMutation, useQueryClient } from "@tanstack/react-query";
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
        },
    });

    return {
        generateDocument: mutation.mutate,
        generateDocumentAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error,
    };
};
