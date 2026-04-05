import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stopStream as stopStreamService } from "../services";
import { toast } from "sonner";




export const useStopStream = () => {
    const queryClient = useQueryClient();
    const { mutate: stopStream , isPending } = useMutation({
        mutationFn: stopStreamService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
        onError: () => {
            toast.error("فشل إيقاف البث", {
                description: "يرجى المحاولة مرة أخرى",
            });
        },
    });
    
    return { stopStream , isPending };
}