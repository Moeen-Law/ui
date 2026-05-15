import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import i18n from "@/lib/i18n";
import { governmentProcess } from "../services";
import { governmentProcessKeys } from "./queryKeys";

export const useCreateGovernmentProcess = () => {
    const queryClient = useQueryClient();

    const {
        mutate: createGovernmentProcess,
        mutateAsync: createGovernmentProcessAsync,
        isPending,
        error,
    } = useMutation({
        mutationFn: governmentProcess,
        onSuccess: (process) => {
            queryClient.invalidateQueries({
                queryKey: governmentProcessKeys.lists(),
            });
            queryClient.setQueryData(
                governmentProcessKeys.detail(process.id),
                process
            );
        },
        onError: (error) => {
            toast.error(error?.message || i18n.t("governmentProcesses.error.description"));
        },
    });

    return {
        createGovernmentProcess,
        createGovernmentProcessAsync,
        isPending,
        error,
    };
};
