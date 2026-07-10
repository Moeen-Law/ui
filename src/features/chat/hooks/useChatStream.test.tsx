import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { FetchEventSourceInit } from "@microsoft/fetch-event-source";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { refreshAccessToken } from "@/shared/api";
import { stopStream } from "../services";
import { useChatStream } from "./useChatStream";

vi.mock("@microsoft/fetch-event-source", () => ({
    fetchEventSource: vi.fn(),
}));

vi.mock("./useChatMessages", () => ({
    useChatMessages: (() => {
        const result = {
        data: [],
        isLoading: false,
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        };
        return () => result;
    })(),
}));

vi.mock("../services", () => ({
    stopStream: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/shared/api", () => ({
    refreshAccessToken: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: { error: vi.fn() },
}));

interface StreamHarness {
    options: FetchEventSourceInit | null;
    resolve: (() => void) | null;
}

const mockedFetchEventSource = vi.mocked(fetchEventSource);
const mockedStopStream = vi.mocked(stopStream);
const mockedRefreshAccessToken = vi.mocked(refreshAccessToken);

describe("useChatStream presentation lifecycle", () => {
    let frames: Map<number, FrameRequestCallback>;
    let nextFrameId: number;
    let harness: StreamHarness;
    let queryClient: QueryClient;

    const runFrame = (timestamp: number) => {
        const entry = frames.entries().next().value as [number, FrameRequestCallback] | undefined;
        if (!entry) throw new Error("Expected a scheduled animation frame");
        frames.delete(entry[0]);
        act(() => entry[1](timestamp));
    };

    const createWrapper = () => function Wrapper({ children }: PropsWithChildren) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    const startStream = async () => {
        const rendered = renderHook(() => useChatStream({ chatId: "chat-1" }), {
            wrapper: createWrapper(),
        });

        act(() => {
            void rendered.result.current.sendMessage("Question");
        });

        await vi.waitFor(() => expect(harness.options).not.toBeNull());
        return rendered;
    };

    beforeEach(() => {
        vi.clearAllMocks();
        frames = new Map();
        nextFrameId = 1;
        harness = { options: null, resolve: null };
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
            const id = nextFrameId++;
            frames.set(id, callback);
            return id;
        });
        vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
            frames.delete(id);
        });
        Object.defineProperty(document, "hidden", {
            configurable: true,
            value: false,
        });

        mockedFetchEventSource.mockImplementation((_url, options) => {
            harness.options = options;
            return new Promise<void>((resolve) => {
                harness.resolve = resolve;
            });
        });
    });

    it("keeps a closed transport streaming until a large queue drains", async () => {
        const rendered = await startStream();
        const invalidate = vi.spyOn(queryClient, "invalidateQueries");

        act(() => {
            harness.options?.onmessage?.({ data: "abcdefghijklmnopqr", event: "", id: "", retry: undefined });
            harness.options?.onclose?.();
            harness.resolve?.();
        });

        expect(rendered.result.current.status).toBe("streaming");
        expect(rendered.result.current.messages.at(-1)?.content).toBe("");
        expect(invalidate).not.toHaveBeenCalled();

        runFrame(32);
        expect(rendered.result.current.messages.at(-1)?.content).toBe("abcdef");
        expect(rendered.result.current.status).toBe("streaming");

        runFrame(64);
        runFrame(96);

        expect(rendered.result.current.messages.at(-1)?.content).toBe("abcdefghijklmnopqr");
        expect(rendered.result.current.messages.at(-1)?.isStreaming).toBe(false);
        expect(rendered.result.current.status).toBe("done");
        expect(invalidate).toHaveBeenCalledTimes(1);
    });

    it("stopping preserves queued content and notifies the backend once", async () => {
        const rendered = await startStream();

        act(() => {
            harness.options?.onmessage?.({ data: "partial answer", event: "", id: "", retry: undefined });
        });
        runFrame(32);

        act(() => rendered.result.current.stopStreaming());

        expect(rendered.result.current.messages.at(-1)).toMatchObject({
            content: "partial answer",
            isStreaming: false,
            isStopped: true,
        });
        expect(mockedStopStream).toHaveBeenCalledTimes(1);
        expect(mockedStopStream).toHaveBeenCalledWith("chat-1");
    });

    it("preserves partial content when a transport error occurs", async () => {
        const rendered = await startStream();

        act(() => {
            harness.options?.onmessage?.({ data: "partial answer", event: "", id: "", retry: undefined });
        });
        runFrame(32);

        let thrownError: unknown;
        act(() => {
            try {
                harness.options?.onerror?.(new Error("connection lost"));
            } catch (error) {
                thrownError = error;
            }
        });

        expect(thrownError).toEqual(new Error("connection lost"));
        expect(rendered.result.current.status).toBe("error");
        expect(rendered.result.current.messages.at(-1)).toMatchObject({
            content: "partial answer",
            isStreaming: false,
            isError: true,
        });
    });

    it("finalizes immediately when the transport closes in a hidden tab", async () => {
        const rendered = await startStream();
        Object.defineProperty(document, "hidden", {
            configurable: true,
            value: true,
        });

        act(() => {
            harness.options?.onmessage?.({ data: "complete hidden answer", event: "", id: "", retry: undefined });
            harness.options?.onclose?.();
            harness.resolve?.();
        });

        expect(rendered.result.current.status).toBe("done");
        expect(rendered.result.current.messages.at(-1)).toMatchObject({
            content: "complete hidden answer",
            isStreaming: false,
        });
        expect(frames).toHaveLength(0);
    });

    it("reveals a post-transport queue without marking it stopped", async () => {
        const rendered = await startStream();

        act(() => {
            harness.options?.onmessage?.({ data: "already generated", event: "", id: "", retry: undefined });
            harness.options?.onclose?.();
            harness.resolve?.();
        });
        act(() => rendered.result.current.stopStreaming());

        expect(rendered.result.current.messages.at(-1)).toMatchObject({
            content: "already generated",
            isStreaming: false,
        });
        expect(rendered.result.current.messages.at(-1)?.isStopped).not.toBe(true);
        expect(mockedStopStream).not.toHaveBeenCalled();
    });

    it("ignores callbacks from a stream discarded during chat navigation", async () => {
        const rendered = renderHook(
            ({ currentChatId }: { currentChatId: string }) => useChatStream({ chatId: currentChatId }),
            { initialProps: { currentChatId: "chat-1" }, wrapper: createWrapper() }
        );

        act(() => {
            void rendered.result.current.sendMessage("Question");
        });
        await vi.waitFor(() => expect(harness.options).not.toBeNull());
        const oldOptions = harness.options;

        rendered.rerender({ currentChatId: "chat-2" });
        act(() => {
            oldOptions?.onmessage?.({ data: "stale answer", event: "", id: "", retry: undefined });
            oldOptions?.onclose?.();
        });

        expect(rendered.result.current.status).toBe("idle");
        expect(rendered.result.current.messages.some((message) => message.content === "stale answer")).toBe(false);
        expect(frames).toHaveLength(0);
    });

    it("retries one 401 without duplicating optimistic messages", async () => {
        mockedRefreshAccessToken.mockResolvedValue("refreshed-token");
        mockedFetchEventSource
            .mockImplementationOnce(async (_url, options) => {
                await options.onopen?.(new Response("", { status: 401 }));
            })
            .mockImplementationOnce((_url, options) => {
                harness.options = options;
                return new Promise<void>((resolve) => {
                    harness.resolve = resolve;
                });
            });

        const rendered = renderHook(() => useChatStream({ chatId: "chat-1" }), {
            wrapper: createWrapper(),
        });
        act(() => {
            void rendered.result.current.sendMessage("Question");
        });

        await vi.waitFor(() => expect(mockedFetchEventSource).toHaveBeenCalledTimes(2));
        await vi.waitFor(() => expect(rendered.result.current.messages).toHaveLength(2));

        expect(mockedRefreshAccessToken).toHaveBeenCalledTimes(1);
        expect(rendered.result.current.messages.map((message) => message.sender)).toEqual(["user", "ai"]);
        expect(rendered.result.current.messages[0]?.content).toBe("Question");
    });
});
