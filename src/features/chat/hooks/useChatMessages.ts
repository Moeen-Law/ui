import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMessages } from "../services";
import type { MessageDatum, MessageResponse, StreamMessage } from "../types";

const MESSAGE_PAGE_SIZE = 5;
const MISSING_AI_REPLY_MESSAGE =
    "عذراً، حدث خطأ أثناء معالجة طلبك ولم نتمكن من الحصول على رد. يمكنك المحاولة مرة أخرى.";

export const mapMessagesToStreamMessages = (messages: MessageDatum[]): StreamMessage[] => {
    const mapped: StreamMessage[] = [];

    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        mapped.push({
            id: msg.id,
            content: msg.content,
            sender: msg.sender,
            files: msg.files,
            isStreaming: false,
        });

        if (msg.sender === "user") {
            const nextMsg = messages[i + 1];
            if (!nextMsg || nextMsg.sender === "user") {
                mapped.push({
                    id: `error-${msg.id}`,
                    content: MISSING_AI_REPLY_MESSAGE,
                    sender: "ai",
                    isStreaming: false,
                    isError: true,
                });
            }
        }
    }

    return mapped;
};

const flattenMessagesNewestPagesToChronological = (pages: MessageResponse[]) => {
    const chronologicalMessages = pages
        .slice()
        .reverse()
        .flatMap((page) => page.data.slice().reverse());

    return mapMessagesToStreamMessages(chronologicalMessages);
};

/**
 * Fetches paginated chat history and maps it to StreamMessage[].
 * Inserts synthetic error placeholders when a user message has no AI reply.
 *
 * refetchOnWindowFocus is disabled to prevent background refetches from
 * overwriting the in-progress streaming state managed by useChatStream.
 */
export const useChatMessages = (chatId: string | undefined) => {
    const query = useInfiniteQuery({
        queryKey: ["messages", chatId, { size: MESSAGE_PAGE_SIZE, sortOrder: "DESC" }],
        queryFn: async ({ pageParam = 1 }) => {
            if (!chatId) {
                return Promise.resolve({
                    data: [],
                    meta: {
                        page: 1,
                        size: MESSAGE_PAGE_SIZE,
                        results: 0,
                        total: 0,
                        totalPages: 0,
                        hasNextPage: false,
                        hasPrevPage: false,
                    },
                } satisfies MessageResponse);
            }

            return fetchMessages(chatId, {
                page: pageParam,
                size: MESSAGE_PAGE_SIZE,
                sortOrder: "DESC",
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { page, totalPages, hasNextPage } = lastPage.meta;
            return hasNextPage || page < totalPages ? page + 1 : undefined;
        },
        select: (data) => ({
            ...data,
            messages: flattenMessagesNewestPagesToChronological(data.pages),
        }),
        enabled: !!chatId,
        refetchOnWindowFocus: false,
    });

    return {
        ...query,
        data: query.data?.messages ?? [],
    };
};
