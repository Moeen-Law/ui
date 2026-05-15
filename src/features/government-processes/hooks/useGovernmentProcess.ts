import { useSuspenseQuery } from "@tanstack/react-query";
import { governmentProcessById } from "../services";
import { governmentProcessKeys } from "./queryKeys";

export const useGovernmentProcess = (id: string) => {
    const { data: process, refetch } = useSuspenseQuery({
        queryKey: governmentProcessKeys.detail(id),
        queryFn: () => governmentProcessById(id),
    });

    return { process, refetch };
};
