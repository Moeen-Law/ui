import { useQuery } from "@tanstack/react-query";
import { governmentProcessById } from "../services";
import { governmentProcessKeys } from "./queryKeys";

export const useOptionalGovernmentProcess = (id?: string) => {
    const query = useQuery({
        queryKey: governmentProcessKeys.detail(id ?? ""),
        queryFn: () => governmentProcessById(id as string),
        enabled: Boolean(id),
    });

    return {
        process: query.data,
        refetch: query.refetch,
        isLoading: query.isLoading,
        isError: query.isError,
    };
};
