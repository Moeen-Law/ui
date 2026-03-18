import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchChats } from "../services";
import type { ChatResponse } from "../types";




export const useChats = () => {

    const { data: chats, isPending, isError, refetch } = useSuspenseQuery<ChatResponse>({
        queryKey: ["chats"],
        queryFn: fetchChats,
    });

    return { chats, isPending, isError, refetch };
}