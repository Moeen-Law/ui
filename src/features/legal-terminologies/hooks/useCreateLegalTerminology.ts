import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import i18n from "@/lib/i18n";
import { createLegalTerminology as createLegalTerminologyService } from "../services";
import { legalTerminologyKeys } from "./queryKeys";

export const useCreateLegalTerminology = () => {
    const queryClient = useQueryClient();

    const {
        mutate: createTerminology,
        mutateAsync: createTerminologyAsync,
        isPending,
        error,
    } = useMutation({
        mutationFn: createLegalTerminologyService,
        onSuccess: (terminology) => {
            queryClient.invalidateQueries({
                queryKey: legalTerminologyKeys.lists(),
            });
            queryClient.setQueryData(
                legalTerminologyKeys.detail(terminology.id),
                terminology
            );
        },
        onError: (error) => {
            toast.error(error?.message || i18n.t("toast.createTerminologyError"));
        },
    });

    return {
        createTerminology,
        createTerminologyAsync,
        isPending,
        error,
    };
};
