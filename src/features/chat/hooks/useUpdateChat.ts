import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChatTitle as updateChatService } from "../services";
import { toast } from "sonner";



export const useUpdateChat = () => {
    const queryClient = useQueryClient();

    const { mutate: updateChat , isPending  } = useMutation({
        mutationFn: updateChatService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.message || "فشل في تحديث المحادثة");
        } 
    }); 
    
   return { updateChat , isPending };
}