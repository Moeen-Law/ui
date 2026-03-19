import { useCallback, useRef, useState, useEffect } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import useAuthStore from "@/features/auth/store/auth";
import type { LawSource, StreamMessage, StreamStatus } from "../types";
import { chatService } from "../helpers";
import { fetchChat } from "../services";
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
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string, overrideChatId?: string, fileIds?: string[]) => Promise<void>;
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
    const [isLoading, setIsLoading] = useState(false);
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

    // ─── History Fetching Logic ─────────────────────────────────────────
    const fetchedChatIdRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false);

    const loadHistory = useCallback(async (id: string) => {
        if (isFetchingRef.current || !id) return;
        
        isFetchingRef.current = true;
        setIsLoading(true);
        setMessages([]); // Clear while loading or set to loading state
        
        try {
            const chatData = await fetchChat(id);
            if (chatData?.messages && chatData.messages.length > 0) {
                const typedMessages = chatData.messages as Array<{
                    id: string;
                    content: string;
                    sender: "user" | "ai";
                }>;
                
                const mappedMessages: StreamMessage[] = [];
                for (let i = 0; i < typedMessages.length; i++) {
                    const msg = typedMessages[i];
                    mappedMessages.push({
                        id: msg.id,
                        content: msg.content,
                        sender: msg.sender,
                        isStreaming: false,
                    });

                    // If this is a user message and it's either the last message 
                    // or the next message is also from a user, insert a synthetic error response.
                    if (msg.sender === "user") {
                        const nextMsg = typedMessages[i + 1];
                        if (!nextMsg || nextMsg.sender === "user") {
                            mappedMessages.push({
                                id: `error-${msg.id}`,
                                content: "عذراً، حدث خطأ أثناء معالجة طلبك ولم نتمكن من الحصول على رد. يمكنك المحاولة مرة أخرى.",
                                sender: "ai",
                                isStreaming: false,
                                isError: true,
                            });
                        }
                    }
                }
                
                setMessages(mappedMessages);
            } else {
                setMessages([]);
            }
            fetchedChatIdRef.current = id;
        } catch (err) {
            console.error("Failed to load chat messages:", err);
            setMessages([]);
        } finally {
            isFetchingRef.current = false;
            setIsLoading(false);
        }
    }, []);

    // Auto-load history when chatId changes
    useEffect(() => {
        // If we switch chats while streaming, stop the current stream
        if (chatId !== fetchedChatIdRef.current) {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
            setStatus("idle");
        }

        if (chatId && chatId !== fetchedChatIdRef.current) {
            loadHistory(chatId);
        } else if (!chatId) {
            setMessages([]);
            fetchedChatIdRef.current = null;
        }
    }, [chatId, loadHistory]);

    const sendMessage = useCallback(
        async (content: string, overrideChatId?: string, fileIds?: string[]) => {
            const currentChatId = overrideChatId || chatId;
            if (!currentChatId || !content.trim()) return;

            // If we are sending to a new chat, mark it as "fetched" or "processed" 
            // so our history loader doesn't overwrite the active stream.
            if (overrideChatId) {
                fetchedChatIdRef.current = overrideChatId;
            }

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
                chatId: currentChatId,
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
                                    ? { ...msg, content: errorPayload, isStreaming: false, isError: true }
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
                                        ? { ...msg, content: data, isStreaming: false, isError: true }
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

                        // Mark AI message as done
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === aiMessageId
                                    ? { 
                                        ...msg, 
                                        content: msg.content || errorMessage, 
                                        isStreaming: false,
                                        isError: true 
                                      }
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
        isLoading,
        error,
        sendMessage,
        stopStreaming,
    };
};
