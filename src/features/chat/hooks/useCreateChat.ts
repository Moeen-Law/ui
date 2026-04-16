import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChat as createChatService  } from "../services";
import { toast } from "sonner";
import i18n from "@/lib/i18n";




export const useCreateChat = () => {
    const queryClient = useQueryClient();
    const { mutate: createChat , isPending  } = useMutation({
        mutationFn: createChatService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error) => {
            toast.error(error?.message || i18n.t("toast.createChatError"));
        } 
    }); 
    
   return { createChat , isPending };
}