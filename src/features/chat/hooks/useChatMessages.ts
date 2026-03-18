import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchMessages } from "../services";


export const useChatMessages = (chatId: string) => {

    const { data: messages , isLoading , error } = useSuspenseQuery({
        queryKey: ["messages", chatId],
        queryFn: () => fetchMessages(chatId),
    });
    
    return { messages , isLoading , error };
}