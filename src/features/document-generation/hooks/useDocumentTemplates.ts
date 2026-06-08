import { useQuery } from "@tanstack/react-query";
import { fetchDocumentTemplates } from "../services";
import { documentGenerationKeys } from "./queryKeys";

export const useDocumentTemplates = () => {
    const query = useQuery({
        queryKey: documentGenerationKeys.templates(),
        queryFn: fetchDocumentTemplates,
    });

    return {
        templates: query.data?.items ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
};
