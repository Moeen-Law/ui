import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChat as deleteChatService } from "../services";
import { toast } from "sonner";


export const useDeleteChat = () => {
    const queryClient = useQueryClient();
    
    const { mutate: deleteChat , isPending  } = useMutation({
        mutationFn: deleteChatService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error) => {
            toast.error(error?.message || "فشل في حذف المحادثة");
        } 
    }); 
    
   return { deleteChat , isPending };
}