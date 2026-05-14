import { useQuery } from "@tanstack/react-query";
import { fetchLegalTerminology } from "../services";
import { legalTerminologyKeys } from "./queryKeys";

export const useOptionalLegalTerminology = (id: string | null | undefined) => {
    const query = useQuery({
        queryKey: legalTerminologyKeys.detail(id ?? ""),
        queryFn: () => fetchLegalTerminology(id as string),
        enabled: !!id,
    });

    return {
        ...query,
        terminology: query.data,
    };
};
