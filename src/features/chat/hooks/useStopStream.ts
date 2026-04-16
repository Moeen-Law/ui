import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stopStream as stopStreamService } from "../services";
import { toast } from "sonner";
import i18n from "@/lib/i18n";




export const useStopStream = () => {
    const queryClient = useQueryClient();
    const { mutate: stopStream , isPending } = useMutation({
        mutationFn: stopStreamService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
        onError: () => {
            toast.error(i18n.t("toast.stopStreamError"), {
                description: i18n.t("toast.tryAgain"),
            });
        },
    });
    
    return { stopStream , isPending };
}