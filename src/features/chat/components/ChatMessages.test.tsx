import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StreamMessage } from "../types";
import ChatMessages from "./ChatMessages";

class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = [];
    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        MockIntersectionObserver.instances.push(this);
    }

    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);

    trigger(isIntersecting: boolean) {
        this.callback(
            [{ isIntersecting } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver
        );
    }
}

const messages: StreamMessage[] = [
    { id: "user-1", sender: "user", content: "Question" },
    { id: "ai-1", sender: "ai", content: "Answer" },
];

describe("ChatMessages pagination trigger", () => {
    beforeEach(() => {
        MockIntersectionObserver.instances = [];
        vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
        vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
            callback(0);
            return 1;
        });
        vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("does not fetch older messages when the top sentinel is visible on initial render", async () => {
        const fetchOlderMessages = vi.fn().mockResolvedValue(undefined);

        render(
            <ChatMessages
                chatId="chat-1"
                messages={messages}
                hasOlderMessages
                fetchOlderMessages={fetchOlderMessages}
            />
        );

        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));

        MockIntersectionObserver.instances[0].trigger(true);

        expect(fetchOlderMessages).not.toHaveBeenCalled();
    });

    it("fetches older messages on wheel intent when no scroll event fires", async () => {
        const fetchOlderMessages = vi.fn().mockResolvedValue(undefined);
        const { container } = render(
            <ChatMessages
                chatId="chat-1"
                messages={messages}
                hasOlderMessages
                fetchOlderMessages={fetchOlderMessages}
            />
        );
        const scrollContainer = container.firstElementChild as HTMLDivElement;

        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));
        MockIntersectionObserver.instances[0].trigger(true);
        expect(fetchOlderMessages).not.toHaveBeenCalled();

        Object.defineProperty(scrollContainer, "scrollTop", {
            value: 0,
            writable: true,
            configurable: true,
        });
        Object.defineProperty(scrollContainer, "scrollHeight", {
            value: 800,
            configurable: true,
        });

        fireEvent.wheel(scrollContainer);

        await waitFor(() => expect(fetchOlderMessages).toHaveBeenCalledTimes(1));
    });

    it("fetches older messages on touch intent when no scroll event fires", async () => {
        const fetchOlderMessages = vi.fn().mockResolvedValue(undefined);
        const { container } = render(
            <ChatMessages
                chatId="chat-1"
                messages={messages}
                hasOlderMessages
                fetchOlderMessages={fetchOlderMessages}
            />
        );
        const scrollContainer = container.firstElementChild as HTMLDivElement;

        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));
        MockIntersectionObserver.instances[0].trigger(true);
        expect(fetchOlderMessages).not.toHaveBeenCalled();

        Object.defineProperty(scrollContainer, "scrollTop", {
            value: 0,
            writable: true,
            configurable: true,
        });

        fireEvent.touchStart(scrollContainer);

        await waitFor(() => expect(fetchOlderMessages).toHaveBeenCalledTimes(1));
    });

    it("does not fetch older messages when user scroll is not near the top", async () => {
        const fetchOlderMessages = vi.fn().mockResolvedValue(undefined);
        const { container } = render(
            <ChatMessages
                chatId="chat-1"
                messages={messages}
                hasOlderMessages
                fetchOlderMessages={fetchOlderMessages}
            />
        );
        const scrollContainer = container.firstElementChild as HTMLDivElement;

        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));

        Object.defineProperty(scrollContainer, "scrollTop", {
            value: 160,
            writable: true,
            configurable: true,
        });

        fireEvent.wheel(scrollContainer);
        fireEvent.scroll(scrollContainer);

        expect(fetchOlderMessages).not.toHaveBeenCalled();
    });

    it("does not fetch older messages while a fetch is already in progress", async () => {
        const fetchOlderMessages = vi.fn().mockResolvedValue(undefined);
        const { container } = render(
            <ChatMessages
                chatId="chat-1"
                messages={messages}
                hasOlderMessages
                isFetchingOlderMessages
                fetchOlderMessages={fetchOlderMessages}
            />
        );
        const scrollContainer = container.firstElementChild as HTMLDivElement;

        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));

        Object.defineProperty(scrollContainer, "scrollTop", {
            value: 0,
            writable: true,
            configurable: true,
        });

        fireEvent.wheel(scrollContainer);
        fireEvent.scroll(scrollContainer);
        MockIntersectionObserver.instances[0].trigger(true);

        expect(fetchOlderMessages).not.toHaveBeenCalled();
    });

    it("renders active content as plain text with an inline hidden cursor", () => {
        render(
            <ChatMessages
                chatId="chat-1"
                messages={[{ id: "ai-stream", sender: "ai", content: "# Partial", isStreaming: true }]}
                isStreaming
            />
        );

        const content = screen.getByTestId("streaming-message-content");
        expect(content).toHaveTextContent("# Partial");
        expect(screen.queryByRole("heading", { name: "Partial" })).not.toBeInTheDocument();
        expect(content.querySelector("[aria-hidden='true']")).toBeInTheDocument();
    });

    it("renders completed content as Markdown", () => {
        render(
            <ChatMessages
                chatId="chat-1"
                messages={[{ id: "ai-done", sender: "ai", content: "# Complete", isStreaming: false }]}
            />
        );

        expect(screen.getByRole("heading", { name: "Complete" })).toBeInTheDocument();
        expect(screen.queryByTestId("streaming-message-content")).not.toBeInTheDocument();
    });
});
