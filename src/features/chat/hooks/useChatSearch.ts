import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchChats } from "../services";
import type { ChatResponse } from "../types";

const CHAT_SEARCH_PAGE_SIZE = 10;
const MIN_SEARCH_LENGTH = 2;
 
export const useChatSearch = (search: string) => {
    const searchTerm = search.trim();
    const shouldSearch = searchTerm.length >= MIN_SEARCH_LENGTH;

    const query = useInfiniteQuery<ChatResponse>({
        queryKey: ["chat-search", searchTerm],
        queryFn: ({ pageParam = 1 }) =>
            fetchChats({
                page: pageParam as number,
                size: CHAT_SEARCH_PAGE_SIZE,
                search: searchTerm,
            }),
        initialPageParam: 1,
        enabled: shouldSearch,
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.meta;
            return page < totalPages ? page + 1 : undefined;
        },
    });

    const chats = query.data?.pages.flatMap((page) => page.data) ?? [];
    const meta = query.data?.pages[0]?.meta;

    return {
        ...query,
        chats,
        meta,
        searchTerm,
        shouldSearch,
    };
};
