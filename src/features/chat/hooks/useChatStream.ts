import { useCallback, useRef, useState, useEffect } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import useAuthStore from "@/features/auth/store/auth";
import type { LawSource, StreamMessage, StreamStatus } from "../types";
import { chatService } from "../helpers";
import { fetchChat, stopStream as stopStreamService } from "../services";
import { toast } from "sonner";
import { fetchMe } from "@/features/auth/services";

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
    sendMessage: (content: string, overrideChatId?: string, fileIds?: string[], retryCount?: number) => Promise<void>;
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
    // Tracks which chatId is currently streaming so we can notify the backend from any context
    const activeStreamChatIdRef = useRef<string | null>(null);

    // ─── Shared helper: notify backend to stop the active stream ─────────
    const notifyBackendStop = useCallback(async (chatId: string) => {
        try {
            await stopStreamService(chatId);
        } catch {
            toast.error("فشل إيقاف البث", {
                description: "يرجى المحاولة مرة أخرى",
            });
        }
    }, []);

    // ─── keepalive variant — used during beforeunload only ───────────────
    // sendBeacon doesn't support Authorization headers easily, so we use fetch with keepalive.
    const notifyBackendStopKeepalive = useCallback((chatId: string) => {
        const token = useAuthStore.getState().accessToken;
        const url = `${BASE_URL}${chatService}/messages/chat/stream/${chatId}/stop`;
        fetch(url, {
            method: "POST",
            keepalive: true,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }).catch(() => {
            // Cannot reliably show a toast during beforeunload — silently ignore.
        });
    }, []);

    const stopStreaming = useCallback(() => {
        if (!abortControllerRef.current) return;
        const stoppingChatId = activeStreamChatIdRef.current;
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
        activeStreamChatIdRef.current = null;
        setStatus((prev) => (prev === "streaming" ? "done" : prev));
        // Mark the last AI message as no longer streaming and add the stop message
        setMessages((prev) => [
            ...prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg)),
            {
                id: crypto.randomUUID(),
                content: "تم إيقاف إنشاء الرسائل بواسطة المستخدم",
                sender: "ai",
                isStopped: true,
            },
        ]);
        
        if (stoppingChatId) {
            notifyBackendStop(stoppingChatId);
        }
    }, [notifyBackendStop]);

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

    // ─── Scenario 2b: Component unmount — stop any active stream ─────────
    useEffect(() => {
        return () => {
            if (abortControllerRef.current && activeStreamChatIdRef.current) {
                const chatIdToStop = activeStreamChatIdRef.current;
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
                activeStreamChatIdRef.current = null;
                notifyBackendStop(chatIdToStop);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Scenario 3: Tab refresh / close — keepalive fetch ───────────────
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (abortControllerRef.current && activeStreamChatIdRef.current) {
                notifyBackendStopKeepalive(activeStreamChatIdRef.current);
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
                activeStreamChatIdRef.current = null;
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [notifyBackendStopKeepalive]);

    // Auto-load history when chatId changes
    useEffect(() => {
        // If we switch chats while streaming, stop the current stream
        if (chatId !== fetchedChatIdRef.current) {
            if (abortControllerRef.current && activeStreamChatIdRef.current) {
                const chatIdToStop = activeStreamChatIdRef.current;
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
                activeStreamChatIdRef.current = null;
                notifyBackendStop(chatIdToStop);
            }
            setStatus("idle");
        }

        if (chatId && chatId !== fetchedChatIdRef.current) {
            loadHistory(chatId);
        } else if (!chatId) {
            setMessages([]);
            fetchedChatIdRef.current = null;
        }
    }, [chatId, loadHistory, notifyBackendStop]);

    const sendMessage = useCallback(
        async (content: string, overrideChatId?: string, fileIds?: string[], retryCount = 1) => {
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
            activeStreamChatIdRef.current = currentChatId;

            const token = useAuthStore.getState().accessToken;

            try {
                await fetchEventSource(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "text/event-stream",
                    },
                    signal: ctrl.signal,
                    openWhenHidden: true,

                    async onopen(response) {
                        if (response.status === 401 && retryCount > 0) {
                            throw new Error("TOKEN_EXPIRED_RETRY");
                        }

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

                        // Bypass error UI for token refresh so loading indicator stays active
                        if (err instanceof Error && err.message === "TOKEN_EXPIRED_RETRY") {
                            throw err;
                        }

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

                if (err instanceof Error && err.message === "TOKEN_EXPIRED_RETRY") {
                    console.warn("[SSE] Token expired. Attempting refresh via dummy request...");
                    try {
                        await fetchMe();
                        // Clean up duplicate optimistic messages before retrying
                        setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id && msg.id !== aiMessageId));
                        await sendMessage(content, overrideChatId, fileIds, retryCount - 1);
                        return;
                    } catch (refreshErr) {
                        setError("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.");
                        setStatus("error");
                        // Mark AI message as failed
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === aiMessageId
                                    ? { ...msg, content: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.", isStreaming: false, isError: true }
                                    : msg
                            )
                        );
                        return;
                    }
                }

                // If status wasn't already set to error by the handlers above
                if (status !== "error") {
                    setError(
                        err instanceof Error ? err.message : "حدث خطأ غير متوقع"
                    );
                    setStatus("error");
                }
            } finally {
                // Only clear if another retry hasn't started and overridden the ref
                if (abortControllerRef.current === ctrl) {
                    abortControllerRef.current = null;
                    activeStreamChatIdRef.current = null;
                }
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
