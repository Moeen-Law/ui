import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchLegalTerminology } from "../services";
import { legalTerminologyKeys } from "./queryKeys";

export const useLegalTerminology = (id: string) => {
    const { data: terminology, refetch } = useSuspenseQuery({
        queryKey: legalTerminologyKeys.detail(id),
        queryFn: () => fetchLegalTerminology(id),
    });

    return { terminology, refetch };
};
