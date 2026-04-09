import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../services";
import type { StreamMessage } from "../types";

/**
 * Fetches chat history and maps it to StreamMessage[].
 * Inserts synthetic error placeholders when a user message has no AI reply.
 *
 * refetchOnWindowFocus is disabled to prevent background refetches from
 * overwriting the in-progress streaming state managed by useChatStream.
 */
export const useChatMessages = (chatId: string | undefined) => {
    return useQuery<StreamMessage[]>({
        queryKey: ["messages", chatId],
        queryFn: async () => {
            if (!chatId) return [];

            const response = await fetchMessages(chatId);

            if (!response?.data || response.data.length === 0) {
                return [];
            }

            const messages = response.data;
            const mapped: StreamMessage[] = [];

            for (let i = 0; i < messages.length; i++) {
                const msg = messages[i];
                mapped.push({
                    id: msg.id,
                    content: msg.content,
                    sender: msg.sender,
                    isStreaming: false,
                });

                // If this is a user message and it's either the last message
                // or the next message is also from a user, insert a synthetic error response.
                if (msg.sender === "user") {
                    const nextMsg = messages[i + 1];
                    if (!nextMsg || nextMsg.sender === "user") {
                        mapped.push({
                            id: `error-${msg.id}`,
                            content:
                                "عذراً، حدث خطأ أثناء معالجة طلبك ولم نتمكن من الحصول على رد. يمكنك المحاولة مرة أخرى.",
                            sender: "ai",
                            isStreaming: false,
                            isError: true,
                        });
                    }
                }
            }

            return mapped;
        },
        enabled: !!chatId,
        refetchOnWindowFocus: false,
    });
};