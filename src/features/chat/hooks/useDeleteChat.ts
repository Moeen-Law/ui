import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChat as deleteChatService } from "../services";
import { toast } from "sonner";
import i18n from "@/lib/i18n";


export const useDeleteChat = () => {
    const queryClient = useQueryClient();
    
    const { mutate: deleteChat , isPending  } = useMutation({
        mutationFn: deleteChatService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error) => {
            toast.error(error?.message || i18n.t("toast.deleteChatError"));
        } 
    }); 
    
   return { deleteChat , isPending };
}