import { useCallback, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import useAuthStore from "@/features/auth/store/auth";
import type { LawSource, StreamMessage, StreamStatus } from "../types";
import { chatService } from "../helpers";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface UseChatStreamOptions {
    chatId: string | undefined;
}

interface UseChatStreamReturn {
    messages: StreamMessage[];
    setMessages: React.Dispatch<React.SetStateAction<StreamMessage[]>>;
    sources: LawSource[];
    status: StreamStatus;
    error: string | null;
    sendMessage: (content: string, fileIds?: string[]) => Promise<void>;
    stopStreaming: () => void;
}

/**
 * Custom hook that manages a Server-Sent Events (SSE) connection
 * to stream AI chat responses chunk-by-chunk, similar to ChatGPT.
 *
 * Flow:
 * 1. User sends a message → optimistically adds it to local state.
 * 2. Opens an SSE connection via GET /chat/stream?chatId=...&content=...
 * 3. Appends incoming text chunks to the AI message in real-time.
 * 4. Handles `sources` events and error events from the server.
 * 5. Provides abort capability so the user can stop generation.
 */
export const useChatStream = ({ chatId }: UseChatStreamOptions): UseChatStreamReturn => {
    const [messages, setMessages] = useState<StreamMessage[]>([]);
    const [sources, setSources] = useState<LawSource[]>([]);
    const [status, setStatus] = useState<StreamStatus>("idle");
    const [error, setError] = useState<string | null>(null);

    // AbortController ref so we can cancel mid-stream
    const abortControllerRef = useRef<AbortController | null>(null);

    const stopStreaming = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
        setStatus((prev) => (prev === "streaming" ? "done" : prev));
        // Mark the last AI message as no longer streaming
        setMessages((prev) =>
            prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg))
        );
    }, []);

    const sendMessage = useCallback(
        async (content: string, fileIds?: string[]) => {
            if (!chatId || !content.trim()) return;

            // Reset error state & sources on new message
            setError(null);
            setSources([]);

            // 1. Optimistically add the user's message
            const userMessage: StreamMessage = {
                id: crypto.randomUUID(),
                content: content.trim(),
                sender: "user",
            };

            // 2. Create a placeholder for the AI response
            const aiMessageId = crypto.randomUUID();
            const aiMessage: StreamMessage = {
                id: aiMessageId,
                content: "",
                sender: "ai",
                isStreaming: true,
            };

            setMessages((prev) => [...prev, userMessage, aiMessage]);
            setStatus("streaming");

            // 3. Build the SSE URL
            const params = new URLSearchParams({
                chatId,
                content: content.trim(),
            });
            if (fileIds && fileIds.length > 0) {
                params.set("fileIds", fileIds.join(","));
            }

            const url = `${BASE_URL}${chatService}/messages/chat/stream?${params.toString()}`;

            // 4. Set up AbortController
            const ctrl = new AbortController();
            abortControllerRef.current = ctrl;

            const token = useAuthStore.getState().accessToken;

            try {
                await fetchEventSource(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "text/event-stream",
                    },
                    signal: ctrl.signal,

                    async onopen(response) {
                        if (
                            response.ok &&
                            response.headers.get("content-type")?.includes("text/event-stream")
                        ) {
                            // Connection established successfully
                            return;
                        }

                        // Server returned an error on open
                        let errorPayload: string;
                        try {
                            const json = await response.json();
                            errorPayload = json?.message || JSON.stringify(json);
                        } catch {
                            errorPayload = await response.text();
                        }

                        setError(errorPayload);
                        setStatus("error");
                        toast.error(errorPayload);
                        console.error("[SSE] Connection failed on open:", errorPayload);

                        // Mark AI message as failed
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === aiMessageId
                                    ? { ...msg, content: errorPayload, isStreaming: false }
                                    : msg
                            )
                        );

                        console.log(response)
                        throw new Error(`SSE connection failed: ${response.status}`);
                    },

                    onmessage(ev) {
                        const eventType = ev.event || "message";
                        const data = ev.data;

                        if (eventType === "message") {
                            // Append text chunk to the AI message
                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === aiMessageId
                                        ? { ...msg, content: msg.content + data }
                                        : msg
                                )
                            );
                        } else if (eventType === "sources") {
                            // Parse sources JSON
                            try {
                                const parsedSources: LawSource[] = JSON.parse(data);
                                setSources(parsedSources);
                            } catch {
                                console.error("Failed to parse sources event:", data);
                            }
                        } else if (eventType === "error") {
                            // Server-sent error event
                            console.error("[SSE] Received error event from server:", data);
                            setError(data);
                            setStatus("error");
                            toast.error(data);
                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === aiMessageId
                                        ? { ...msg, content: data, isStreaming: false }
                                        : msg
                                )
                            );
                        }
                    },

                    onerror(err) {
                        // If the user manually aborted, don't treat as error
                        if (ctrl.signal.aborted) return;

                        console.error("[SSE] Stream error encountered:", err);
                        const errorMessage = typeof err === "string"
                            ? err
                            : err?.message || "حدث خطأ أثناء الاتصال";
                        
                        setError(errorMessage);
                        setStatus("error");
                        toast.error(errorMessage);

                        // Mark AI message as done (with whatever content accumulated)
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === aiMessageId
                                    ? { ...msg, isStreaming: false }
                                    : msg
                            )
                        );

                        // Throw to prevent auto-retry
                        throw err;
                    },

                    onclose() {
                        // Stream ended normally — mark as done
                        setStatus("done");
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === aiMessageId
                                    ? { ...msg, isStreaming: false }
                                    : msg
                            )
                        );
                    },
                });
            } catch (err) {
                // Ignore AbortError (user-initiated cancellation)
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }

                // If status wasn't already set to error by the handlers above
                if (status !== "error") {
                    setError(
                        err instanceof Error ? err.message : "حدث خطأ غير متوقع"
                    );
                    setStatus("error");
                }
            } finally {
                abortControllerRef.current = null;
            }
        },
        [chatId, status]
    );

    return {
        messages,
        setMessages,
        sources,
        status,
        error,
        sendMessage,
        stopStreaming,
    };
};
