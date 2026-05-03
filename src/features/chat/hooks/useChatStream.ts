import { useCallback, useRef, useState, useEffect } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import useAuthStore from "@/features/auth/store/auth";
import type { ChatMessageFile, FilesStreamEvent, LawSource, StreamMessage, StreamStatus } from "../types";
import { chatService } from "../helpers";
import { stopStream as stopStreamService } from "../services";
import { toast } from "sonner";
import { fetchMe } from "@/features/auth/services";
import { useQueryClient } from "@tanstack/react-query";
import i18n from "@/lib/i18n";
import { useChatMessages } from "./useChatMessages";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const STREAM_FLUSH_INTERVAL_MS = 40;

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
    sendMessage: (
        content: string,
        overrideChatId?: string,
        fileIds?: string[],
        optimisticFiles?: ChatMessageFile[],
        retryCount?: number
    ) => Promise<void>;
    stopStreaming: () => void;
}

/**
 * Custom hook that manages a Server-Sent Events (SSE) connection
 * to stream AI chat responses chunk-by-chunk, similar to ChatGPT.
 *
 * History is loaded via useChatMessages (React Query).
 * This hook only manages the active streaming state and optimistic updates.
 *
 * Flow:
 * 1. useChatMessages loads history from the backend (cached by React Query).
 * 2. User sends a message → optimistically adds it to local state.
 * 3. Opens an SSE connection via GET /chat/stream?chatId=...&content=...
 * 4. Appends incoming text chunks to the AI message in real-time.
 * 5. On stream close, invalidates the React Query cache so real IDs replace optimistic ones.
 */
export const useChatStream = ({ chatId }: UseChatStreamOptions): UseChatStreamReturn => {
    const queryClient = useQueryClient();

    // ─── History from React Query ───────────────────────────────────────
    const { data: historyMessages, isLoading: isHistoryLoading } = useChatMessages(chatId);

    // ─── Local streaming state ──────────────────────────────────────────
    const [messages, setMessages] = useState<StreamMessage[]>([]);
    const [sources, setSources] = useState<LawSource[]>([]);
    const [status, setStatus] = useState<StreamStatus>("idle");
    const [error, setError] = useState<string | null>(null);

    // Keep a ref of status so we can read it synchronously in effects
    // without adding it to dependency arrays.
    const statusRef = useRef<StreamStatus>("idle");
    statusRef.current = status;

    // AbortController ref so we can cancel mid-stream
    const abortControllerRef = useRef<AbortController | null>(null);
    // Tracks which chatId is currently streaming so we can notify the backend from any context
    const activeStreamChatIdRef = useRef<string | null>(null);
    const streamBufferRef = useRef("");
    const activeAiMessageIdRef = useRef<string | null>(null);
    const flushTimerRef = useRef<number | null>(null);

    const clearFlushTimer = useCallback(() => {
        if (flushTimerRef.current === null) return;
        window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
    }, []);

    const flushStreamBuffer = useCallback(() => {
        const aiMessageId = activeAiMessageIdRef.current;
        const nextContent = streamBufferRef.current;

        clearFlushTimer();

        if (!aiMessageId || !nextContent) return;

        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === aiMessageId
                    ? { ...msg, content: nextContent }
                    : msg
            )
        );
    }, [clearFlushTimer]);

    const scheduleStreamFlush = useCallback(() => {
        if (flushTimerRef.current !== null) return;

        flushTimerRef.current = window.setTimeout(() => {
            flushStreamBuffer();
        }, STREAM_FLUSH_INTERVAL_MS);
    }, [flushStreamBuffer]);

    const resetStreamBuffer = useCallback((aiMessageId: string | null = null, initialContent = "") => {
        clearFlushTimer();
        activeAiMessageIdRef.current = aiMessageId;
        streamBufferRef.current = initialContent;
    }, [clearFlushTimer]);

    // ─── Sync history into local state ────────
    useEffect(() => {
        if (!historyMessages) return;

        // If we switch chats, we SHOULD sync the new history immediately.
        // We only want to block hydration if we are actively streaming the EXACT chat we are currently viewing.
        const isStreamingCurrentChat =
            (statusRef.current === "streaming" || statusRef.current === "creating") &&
            activeStreamChatIdRef.current === chatId;

        if (!isStreamingCurrentChat) {
            setMessages(historyMessages);
        }
    }, [chatId, historyMessages]);

    // Reset local state when chatId is cleared (new-chat page)
    useEffect(() => {
        if (!chatId) {
            resetStreamBuffer();
            setMessages([]);
            setStatus("idle");
        }
    }, [chatId, resetStreamBuffer]);

    // ─── Shared helper: notify backend to stop the active stream ─────────
    const notifyBackendStop = useCallback(async (chatIdToStop: string) => {
        try {
            await stopStreamService(chatIdToStop);
        } catch {
            toast.error(i18n.t("toast.stopStreamError"), {
                description: i18n.t("toast.tryAgain"),
            });
        }
    }, []);

    // ─── keepalive variant — used during beforeunload only ───────────────
    const notifyBackendStopKeepalive = useCallback((chatIdToStop: string) => {
        const token = useAuthStore.getState().accessToken;
        const url = `${BASE_URL}${chatService}/messages/chat/stream/${chatIdToStop}/stop`;
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
        const stoppedContent = streamBufferRef.current;
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
        activeStreamChatIdRef.current = null;
        flushStreamBuffer();
        resetStreamBuffer();
        setStatus("done");
        setMessages((prev) =>
            prev.map((msg) =>
                msg.isStreaming
                    ? {
                        ...msg,
                        content: stoppedContent || msg.content || i18n.t("toast.streamStopped"),
                        isStreaming: false,
                        isStopped: true,
                    }
                    : msg
            )
        );

        if (stoppingChatId) {
            notifyBackendStop(stoppingChatId);
        }
    }, [flushStreamBuffer, notifyBackendStop, resetStreamBuffer]);

    // ─── Component unmount — stop any active stream ─────────────────────
    useEffect(() => {
        return () => {
            if (abortControllerRef.current && activeStreamChatIdRef.current) {
                const chatIdToStop = activeStreamChatIdRef.current;
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
                activeStreamChatIdRef.current = null;
                resetStreamBuffer();
                notifyBackendStop(chatIdToStop);
            }
        };
    }, [notifyBackendStop, resetStreamBuffer]);

    // ─── Tab refresh / close — keepalive fetch ──────────────────────────
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (abortControllerRef.current && activeStreamChatIdRef.current) {
                notifyBackendStopKeepalive(activeStreamChatIdRef.current);
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
                activeStreamChatIdRef.current = null;
                resetStreamBuffer();
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [notifyBackendStopKeepalive, resetStreamBuffer]);

    // ─── Stop stream when switching chats ────────────────────────────────
    const prevChatIdRef = useRef<string | undefined>(chatId);
    useEffect(() => {
        if (chatId !== prevChatIdRef.current) {
            if (abortControllerRef.current && activeStreamChatIdRef.current) {
                const chatIdToStop = activeStreamChatIdRef.current;
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
                activeStreamChatIdRef.current = null;
                resetStreamBuffer();
                notifyBackendStop(chatIdToStop);
            }
            setStatus("idle");
            prevChatIdRef.current = chatId;
        }
    }, [chatId, notifyBackendStop, resetStreamBuffer]);

    const sendMessage = useCallback(
        async (
            content: string,
            overrideChatId?: string,
            fileIds?: string[],
            optimisticFiles?: ChatMessageFile[],
            retryCount = 1
        ) => {
            const currentChatId = overrideChatId || chatId;
            if (!currentChatId || !content.trim()) return;

            // Reset error state & sources on new message
            setError(null);
            setSources([]);

            // 1. Optimistically add the user's message
            const userMessage: StreamMessage = {
                id: crypto.randomUUID(),
                content: content.trim(),
                sender: "user",
                files: optimisticFiles,
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
            resetStreamBuffer(aiMessageId);
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
                        resetStreamBuffer();
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

                        throw new Error(`SSE connection failed: ${response.status}`);
                    },

                    onmessage(ev) {
                        const eventType = ev.event || "message";
                        const data = ev.data;
                        console.log("[SSE] Received message event:", eventType, data); 
                        if (eventType === "message") {
                            streamBufferRef.current += data;
                            scheduleStreamFlush();
                        } else if (eventType === "sources") {
                            try {
                                const parsedSources: LawSource[] = JSON.parse(data);
                                setSources(parsedSources);
                            } catch {
                                console.error("Failed to parse sources event:", data);
                            }
                        } else if (eventType === "files") {
                            try {
                                const parsedFilesEvent: FilesStreamEvent = JSON.parse(data);
                                setMessages((prev) =>
                                    prev.map((msg) => {
                                        if (parsedFilesEvent.messageId && msg.id === parsedFilesEvent.messageId) {
                                            return { ...msg, files: parsedFilesEvent.files };
                                        }

                                        if (!parsedFilesEvent.messageId && msg.id === userMessage.id) {
                                            return { ...msg, files: parsedFilesEvent.files };
                                        }

                                        return msg;
                                    })
                                );
                            } catch {
                                console.error("Failed to parse files event:", data);
                            }
                        } else if (eventType === "error") {
                            console.error("[SSE] Received error event from server:", data);
                            setError(data);
                            setStatus("error");
                            flushStreamBuffer();
                            resetStreamBuffer();
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
                        if (ctrl.signal.aborted) return;

                        if (err instanceof Error && err.message === "TOKEN_EXPIRED_RETRY") {
                            throw err;
                        }

                        console.error("[SSE] Stream error encountered:", err);
                        const errorMessage = typeof err === "string"
                            ? err
                            : err?.message || i18n.t("toast.connectionError");

                        setError(errorMessage);
                        setStatus("error");
                        flushStreamBuffer();
                        const bufferedContent = streamBufferRef.current;
                        resetStreamBuffer();
                        toast.error(errorMessage);

                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === aiMessageId
                                    ? {
                                        ...msg,
                                        content: bufferedContent || msg.content || errorMessage,
                                        isStreaming: false,
                                        isError: true
                                    }
                                    : msg
                            )
                        );

                        throw err;
                    },

                    onclose() {
                        // Stream ended normally — mark as done
                        setStatus("done");
                        flushStreamBuffer();
                        resetStreamBuffer();
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === aiMessageId
                                    ? { ...msg, isStreaming: false }
                                    : msg
                            )
                        );

                        // Invalidate cache so React Query fetches the real server-side
                        // message IDs, replacing optimistic UUIDs without mid-stream flicker.
                        queryClient.invalidateQueries({ queryKey: ["messages", currentChatId] });
                    },
                });
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }

                if (err instanceof Error && err.message === "TOKEN_EXPIRED_RETRY") {
                    console.warn("[SSE] Token expired. Attempting refresh via dummy request...");
                    try {
                        await fetchMe();
                        // Clean up duplicate optimistic messages before retrying
                        resetStreamBuffer();
                        setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id && msg.id !== aiMessageId));
                        await sendMessage(content, overrideChatId, fileIds, optimisticFiles, retryCount - 1);
                        return;
                    } catch {
                        setError(i18n.t("toast.sessionExpired"));
                        setStatus("error");
                        resetStreamBuffer();
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === aiMessageId
                                    ? { ...msg, content: i18n.t("toast.sessionExpired"), isStreaming: false, isError: true }
                                    : msg
                            )
                        );
                        return;
                    }
                }

                // If status wasn't already set to error by the handlers above
                if (statusRef.current !== "error") {
                    setError(
                        err instanceof Error ? err.message : i18n.t("toast.unexpectedError")
                    );
                    setStatus("error");
                }
            } finally {
                if (abortControllerRef.current === ctrl) {
                    abortControllerRef.current = null;
                    activeStreamChatIdRef.current = null;
                }
            }
        },
        [chatId, flushStreamBuffer, queryClient, resetStreamBuffer, scheduleStreamFlush]
    );

    return {
        messages,
        setMessages,
        sources,
        status,
        isLoading: isHistoryLoading,
        error,
        sendMessage,
        stopStreaming,
    };
};
