import { useQuery } from "@tanstack/react-query";
import { fetchDocumentTemplate } from "../services";
import { documentGenerationKeys } from "./queryKeys";

export const useDocumentTemplate = (templateId?: string) => {
    const query = useQuery({
        queryKey: documentGenerationKeys.template(templateId ?? ""),
        queryFn: () => fetchDocumentTemplate(templateId as string),
        enabled: Boolean(templateId),
    });

    return {
        template: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
};
