import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChat as createChatService  } from "../services";
import { toast } from "sonner";




export const useCreateChat = () => {
    const queryClient = useQueryClient();
    const { mutate: createChat , isPending  } = useMutation({
        mutationFn: createChatService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error) => {
            toast.error(error?.message || "فشل في إنشاء محادثة جديدة");
        } 
    }); 
    
   return { createChat , isPending };
}