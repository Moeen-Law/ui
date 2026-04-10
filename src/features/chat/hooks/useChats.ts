import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchChats } from "../services";
import type { ChatResponse } from "../types";

export const useChats = () => {
    const { 
        data, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        isError, 
        refetch 
    } = useSuspenseInfiniteQuery<ChatResponse>({
        queryKey: ["chats"],
        queryFn: ({ pageParam = 1 }) => fetchChats({ page: pageParam as number, size: 10 }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.meta;
            return page < totalPages ? page + 1 : undefined;
        },
    });

    const chats = data?.pages.flatMap((page) => page.data) ?? [];
    const meta = data?.pages[0]?.meta;

    return { 
        chats, 
        meta,
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        isError, 
        refetch 
    };
}