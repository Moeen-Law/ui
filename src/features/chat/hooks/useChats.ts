import { useQuery } from "@tanstack/react-query";
import { fetchChats } from "../services";
import type { ChatResponse } from "../types";


// i wanna fetch the chats every 1 minute

export const useChats = () => {

    const { data: chats, isPending, isError, refetch } = useQuery<ChatResponse>({
        queryKey: ["chats"],
        queryFn: fetchChats,
        refetchInterval: 60000
    });

    return { chats, isPending, isError, refetch };

}