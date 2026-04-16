import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChatTitle as updateChatService } from "../services";
import { toast } from "sonner";
import i18n from "@/lib/i18n";



export const useUpdateChat = () => {
    const queryClient = useQueryClient();

    const { mutate: updateChat , isPending  } = useMutation({
        mutationFn: updateChatService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.message || i18n.t("toast.updateChatError"));
        } 
    }); 
    
   return { updateChat , isPending };
}