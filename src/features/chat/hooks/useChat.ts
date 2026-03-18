import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchChat } from "../services";



export const useChat = (chatId: string) => {
    const { data: chat , isLoading , error } = useSuspenseQuery({
        queryKey: ["chats", chatId],
        queryFn: () => fetchChat(chatId),
    });
    return { chat , isLoading , error };
}