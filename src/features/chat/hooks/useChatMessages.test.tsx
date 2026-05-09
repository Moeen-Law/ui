import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { PropsWithChildren } from "react";
import { describe, expect, it } from "vitest";
import { server } from "@/test/server";
import type { MessageDatum } from "../types";
import { mapMessagesToStreamMessages, useChatMessages } from "./useChatMessages";

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return function Wrapper({ children }: PropsWithChildren) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
};

const createMessage = (id: string, sender: MessageDatum["sender"], content: string): MessageDatum => ({
    id,
    sender,
    content,
    chatId: "chat-1",
    createdAt: new Date(),
    responseSource: null,
    files: [],
});

describe("useChatMessages", () => {
    it("loads newest page first and prepends older pages in chronological order", async () => {
        const requestedSizes: string[] = [];

        server.use(
            http.get("*/chats/api/v1/messages/chat-1", ({ request }) => {
                const url = new URL(request.url);
                const page = Number(url.searchParams.get("page"));
                requestedSizes.push(url.searchParams.get("size") ?? "");

                if (page === 1) {
                    return HttpResponse.json({
                        data: [
                            createMessage("ai-2", "ai", "new answer"),
                            createMessage("user-2", "user", "new question"),
                        ],
                        meta: {
                            page: 1,
                            size: 10,
                            results: 2,
                            total: 4,
                            totalPages: 2,
                            hasNextPage: true,
                            hasPrevPage: false,
                        },
                    });
                }

                return HttpResponse.json({
                    data: [
                        createMessage("ai-1", "ai", "old answer"),
                        createMessage("user-1", "user", "old question"),
                    ],
                    meta: {
                        page: 2,
                        size: 10,
                        results: 2,
                        total: 4,
                        totalPages: 2,
                        hasNextPage: false,
                        hasPrevPage: true,
                    },
                });
            })
        );

        const { result } = renderHook(() => useChatMessages("chat-1"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.data.map((msg) => msg.id)).toEqual(["user-2", "ai-2"]));

        await result.current.fetchNextPage();

        await waitFor(() =>
            expect(result.current.data.map((msg) => msg.id)).toEqual(["user-1", "ai-1", "user-2", "ai-2"])
        );
        expect(requestedSizes).toEqual(["5", "5"]);
    });

    it("adds missing AI reply placeholders after flattening page boundaries", () => {
        const messages = mapMessagesToStreamMessages([
            createMessage("user-1", "user", "first question"),
            createMessage("ai-1", "ai", "first answer"),
            createMessage("user-2", "user", "second question"),
        ]);

        expect(messages.map((message) => message.id)).toEqual(["user-1", "ai-1", "user-2", "error-user-2"]);
        expect(messages.at(-1)?.isError).toBe(true);
    });
});
