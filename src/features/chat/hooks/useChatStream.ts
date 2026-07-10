import { useCallback, useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAuthStore from "@/features/auth/store/auth";
import i18n from "@/lib/i18n";
import { refreshAccessToken } from "@/shared/api";
import type { ChatMessageFile, FilesStreamEvent, LawSource, StreamMessage, StreamStatus } from "../types";
import { chatService } from "../helpers";
import { mergeStreamMessages } from "../helpers/messages";
import {
    extractTextFromStreamData,
    getStreamGraphemesPerUpdate,
    takeStreamPrefix,
} from "../helpers/stream";
import { stopStream as stopStreamService } from "../services";
import { useChatMessages } from "./useChatMessages";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const STREAM_COMMIT_INTERVAL_MS = 32;

class TokenExpiredError extends Error {
    constructor() {
        super("TOKEN_EXPIRED_RETRY");
        this.name = "TokenExpiredError";
    }
}

class StreamConnectionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "StreamConnectionError";
    }
}

interface ActiveStreamSession {
    id: string;
    chatId: string;
    userMessageId: string;
    aiMessageId: string;
    controller: AbortController;
    queue: string;
    visibleContent: string;
    frameId: number | null;
    lastCommitAt: number;
    transportComplete: boolean;
    transportOpen: boolean;
    finalized: boolean;
}

interface UseChatStreamOptions {
    chatId: string | undefined;
}

interface UseChatStreamReturn {
    messages: StreamMessage[];
    setMessages: React.Dispatch<React.SetStateAction<StreamMessage[]>>;
    sources: LawSource[];
    status: StreamStatus;
    isLoading: boolean;
    hasOlderMessages: boolean;
    isFetchingOlderMessages: boolean;
    error: string | null;
    fetchOlderMessages: () => Promise<unknown>;
    sendMessage: (
        content: string,
        overrideChatId?: string,
        fileIds?: string[],
        optimisticFiles?: ChatMessageFile[],
        retryCount?: number
    ) => Promise<void>;
    stopStreaming: () => void;
}

export const useChatStream = ({ chatId }: UseChatStreamOptions): UseChatStreamReturn => {
    const queryClient = useQueryClient();
    const {
        data: historyMessages,
        isLoading: isHistoryLoading,
        fetchNextPage: fetchOlderMessages,
        hasNextPage: hasOlderMessages,
        isFetchingNextPage: isFetchingOlderMessages,
    } = useChatMessages(chatId);

    const [messages, setMessages] = useState<StreamMessage[]>([]);
    const [sources, setSources] = useState<LawSource[]>([]);
    const [status, setStatus] = useState<StreamStatus>("idle");
    const [error, setError] = useState<string | null>(null);

    const statusRef = useRef<StreamStatus>("idle");
    statusRef.current = status;

    const activeSessionRef = useRef<ActiveStreamSession | null>(null);
    const frameCallbackRef = useRef<FrameRequestCallback>(() => undefined);
    const syncedHistoryChatIdRef = useRef<string | undefined>(undefined);

    const isActiveSession = useCallback(
        (session: ActiveStreamSession) => activeSessionRef.current?.id === session.id && !session.finalized,
        []
    );

    const cancelPresentationFrame = useCallback((session: ActiveStreamSession) => {
        if (session.frameId === null) return;
        window.cancelAnimationFrame(session.frameId);
        session.frameId = null;
    }, []);

    const schedulePresentation = useCallback((session: ActiveStreamSession) => {
        if (session.frameId !== null || session.finalized || !session.queue) return;
        session.frameId = window.requestAnimationFrame((timestamp) => frameCallbackRef.current(timestamp));
    }, []);

    const finalizeSuccess = useCallback((session: ActiveStreamSession, revealRemaining = false) => {
        if (!isActiveSession(session)) return;

        cancelPresentationFrame(session);
        if (revealRemaining && session.queue) {
            session.visibleContent += session.queue;
            session.queue = "";
        }

        const finalContent = session.visibleContent;
        session.finalized = true;
        session.transportOpen = false;

        setMessages((previous) =>
            previous.map((message) =>
                message.id === session.aiMessageId
                    ? { ...message, content: finalContent, isStreaming: false, isOptimistic: true }
                    : message
            )
        );
        setStatus("done");
        activeSessionRef.current = null;
        queryClient.invalidateQueries({ queryKey: ["messages", session.chatId] });
    }, [cancelPresentationFrame, isActiveSession, queryClient]);

    const finalizeError = useCallback((session: ActiveStreamSession, errorMessage: string) => {
        if (!isActiveSession(session)) return;

        cancelPresentationFrame(session);
        const partialContent = session.visibleContent + session.queue;
        const messageContent = partialContent || errorMessage;

        session.queue = "";
        session.visibleContent = partialContent;
        session.finalized = true;
        session.transportOpen = false;
        session.controller.abort();

        setError(errorMessage);
        setStatus("error");
        setMessages((previous) =>
            previous.map((message) =>
                message.id === session.aiMessageId
                    ? {
                        ...message,
                        content: messageContent,
                        isStreaming: false,
                        isError: true,
                    }
                    : message
            )
        );
        activeSessionRef.current = null;
        toast.error(errorMessage);
    }, [cancelPresentationFrame, isActiveSession]);

    const discardSession = useCallback((session: ActiveStreamSession) => {
        if (activeSessionRef.current?.id !== session.id) return;
        cancelPresentationFrame(session);
        session.finalized = true;
        session.transportOpen = false;
        session.controller.abort();
        activeSessionRef.current = null;
    }, [cancelPresentationFrame]);

    frameCallbackRef.current = (timestamp) => {
        const session = activeSessionRef.current;
        if (!session || session.finalized) return;

        session.frameId = null;
        if (!session.queue) {
            if (session.transportComplete) finalizeSuccess(session);
            return;
        }

        if (timestamp - session.lastCommitAt < STREAM_COMMIT_INTERVAL_MS) {
            schedulePresentation(session);
            return;
        }

        const { visible, remaining } = takeStreamPrefix(
            session.queue,
            getStreamGraphemesPerUpdate(session.queue.length)
        );
        session.queue = remaining;
        session.visibleContent += visible;
        session.lastCommitAt = timestamp;

        const visibleSnapshot = session.visibleContent;
        setMessages((previous) =>
            previous.map((message) =>
                message.id === session.aiMessageId
                    ? { ...message, content: visibleSnapshot }
                    : message
            )
        );

        if (session.queue) {
            schedulePresentation(session);
        } else if (session.transportComplete) {
            finalizeSuccess(session);
        }
    };

    useEffect(() => {
        if (!chatId || !historyMessages) return;

        const activeSession = activeSessionRef.current;
        const isStreamingCurrentChat =
            (statusRef.current === "streaming" || statusRef.current === "creating") &&
            activeSession?.chatId === chatId;

        if (isStreamingCurrentChat) return;

        if (syncedHistoryChatIdRef.current !== chatId) {
            syncedHistoryChatIdRef.current = chatId;
            setMessages(historyMessages);
            return;
        }

        setMessages((previous) => mergeStreamMessages(previous, historyMessages));
    }, [chatId, historyMessages]);

    useEffect(() => {
        if (!chatId) {
            syncedHistoryChatIdRef.current = undefined;
            setMessages([]);
            setStatus("idle");
        }
    }, [chatId]);

    const notifyBackendStop = useCallback(async (chatIdToStop: string) => {
        try {
            await stopStreamService(chatIdToStop);
        } catch {
            toast.error(i18n.t("toast.stopStreamError"), {
                description: i18n.t("toast.tryAgain"),
            });
        }
    }, []);

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
            // The page may already be unloading, so no UI feedback is reliable here.
        });
    }, []);

    const stopStreaming = useCallback(() => {
        const session = activeSessionRef.current;
        if (!session || session.finalized) return;

        if (session.transportComplete) {
            finalizeSuccess(session, true);
            return;
        }

        const stoppedContent = session.visibleContent + session.queue;
        const wasTransportOpen = session.transportOpen;
        const stoppingChatId = session.chatId;

        cancelPresentationFrame(session);
        session.queue = "";
        session.visibleContent = stoppedContent;
        session.finalized = true;
        session.transportOpen = false;
        session.controller.abort();

        setStatus("done");
        setMessages((previous) =>
            previous.map((message) =>
                message.id === session.aiMessageId
                    ? {
                        ...message,
                        content: stoppedContent || message.content || i18n.t("toast.streamStopped"),
                        isStreaming: false,
                        isStopped: true,
                    }
                    : message
            )
        );
        activeSessionRef.current = null;

        if (wasTransportOpen) {
            void notifyBackendStop(stoppingChatId);
        }
    }, [cancelPresentationFrame, finalizeSuccess, notifyBackendStop]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) return;
            const session = activeSessionRef.current;
            if (!session || session.finalized) return;
            if (session.queue) schedulePresentation(session);
            else if (session.transportComplete) finalizeSuccess(session);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [finalizeSuccess, schedulePresentation]);

    useEffect(() => {
        return () => {
            const session = activeSessionRef.current;
            if (!session || session.finalized) return;
            const shouldNotifyBackend = session.transportOpen;
            const sessionChatId = session.chatId;
            discardSession(session);
            if (shouldNotifyBackend) void notifyBackendStop(sessionChatId);
        };
    }, [discardSession, notifyBackendStop]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            const session = activeSessionRef.current;
            if (!session || session.finalized) return;
            if (session.transportOpen) notifyBackendStopKeepalive(session.chatId);
            discardSession(session);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [discardSession, notifyBackendStopKeepalive]);

    const previousChatIdRef = useRef<string | undefined>(chatId);
    useEffect(() => {
        if (chatId === previousChatIdRef.current) return;

        const session = activeSessionRef.current;
        if (session && !session.finalized && session.chatId !== chatId) {
            const shouldNotifyBackend = session.transportOpen;
            const sessionChatId = session.chatId;
            discardSession(session);
            if (shouldNotifyBackend) void notifyBackendStop(sessionChatId);
        }

        const continuesInNavigatedChat = !!session && !session.finalized && session.chatId === chatId;
        if (!continuesInNavigatedChat) setStatus("idle");
        previousChatIdRef.current = chatId;
    }, [chatId, discardSession, notifyBackendStop]);

    const sendMessage = useCallback(
        async (
            content: string,
            overrideChatId?: string,
            fileIds?: string[],
            optimisticFiles?: ChatMessageFile[],
            retryCount = 1
        ) => {
            const currentChatId = overrideChatId || chatId;
            if (!currentChatId || !content.trim() || activeSessionRef.current) return;

            setError(null);
            setSources([]);

            const userMessage: StreamMessage = {
                id: crypto.randomUUID(),
                content: content.trim(),
                sender: "user",
                files: optimisticFiles,
                isOptimistic: true,
            };
            const aiMessage: StreamMessage = {
                id: crypto.randomUUID(),
                content: "",
                sender: "ai",
                isStreaming: true,
                isOptimistic: true,
            };

            setMessages((previous) => [...previous, userMessage, aiMessage]);
            setStatus("streaming");

            const params = new URLSearchParams({
                chatId: currentChatId,
                content: content.trim(),
            });
            if (fileIds?.length) params.set("fileIds", fileIds.join(","));

            const controller = new AbortController();
            const session: ActiveStreamSession = {
                id: crypto.randomUUID(),
                chatId: currentChatId,
                userMessageId: userMessage.id,
                aiMessageId: aiMessage.id,
                controller,
                queue: "",
                visibleContent: "",
                frameId: null,
                lastCommitAt: 0,
                transportComplete: false,
                transportOpen: true,
                finalized: false,
            };
            activeSessionRef.current = session;

            const token = useAuthStore.getState().accessToken;
            const url = `${BASE_URL}${chatService}/messages/chat/stream?${params.toString()}`;

            try {
                await fetchEventSource(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "text/event-stream",
                    },
                    signal: controller.signal,
                    openWhenHidden: true,

                    async onopen(response) {
                        if (!isActiveSession(session)) return;
                        if (response.status === 401 && retryCount > 0) throw new TokenExpiredError();

                        if (
                            response.ok &&
                            response.headers.get("content-type")?.includes("text/event-stream")
                        ) {
                            return;
                        }

                        const responseText = await response.text();
                        let errorPayload = responseText || i18n.t("toast.connectionError");
                        try {
                            const parsed = JSON.parse(responseText) as { message?: unknown };
                            if (typeof parsed.message === "string") errorPayload = parsed.message;
                        } catch {
                            // The response is already useful as plain text.
                        }
                        throw new StreamConnectionError(errorPayload);
                    },

                    onmessage(event) {
                        if (!isActiveSession(session)) return;
                        const eventType = event.event || "message";

                        if (eventType === "message") {
                            const text = extractTextFromStreamData(event.data);
                            if (text === null || text === "") return;
                            session.queue += text;
                            schedulePresentation(session);
                            return;
                        }

                        if (eventType === "sources") {
                            try {
                                setSources(JSON.parse(event.data) as LawSource[]);
                            } catch {
                                if (import.meta.env.DEV) console.debug("[SSE] Invalid sources event", event.data);
                            }
                            return;
                        }

                        if (eventType === "files") {
                            try {
                                const filesEvent = JSON.parse(event.data) as FilesStreamEvent;
                                setMessages((previous) =>
                                    previous.map((message) => {
                                        if (filesEvent.messageId && message.id === filesEvent.messageId) {
                                            return { ...message, files: filesEvent.files };
                                        }
                                        if (!filesEvent.messageId && message.id === session.userMessageId) {
                                            return { ...message, files: filesEvent.files };
                                        }
                                        return message;
                                    })
                                );
                            } catch {
                                if (import.meta.env.DEV) console.debug("[SSE] Invalid files event", event.data);
                            }
                            return;
                        }

                        if (eventType === "error") {
                            throw new StreamConnectionError(event.data || i18n.t("toast.connectionError"));
                        }
                    },

                    onerror(streamError) {
                        if (streamError instanceof TokenExpiredError) throw streamError;
                        if (!isActiveSession(session)) throw streamError;

                        const errorMessage = streamError instanceof Error
                            ? streamError.message
                            : typeof streamError === "string"
                                ? streamError
                                : i18n.t("toast.connectionError");
                        finalizeError(session, errorMessage);
                        throw streamError;
                    },

                    onclose() {
                        if (!isActiveSession(session)) return;
                        session.transportOpen = false;
                        session.transportComplete = true;

                        if (document.hidden) {
                            finalizeSuccess(session, true);
                        } else if (session.queue) {
                            schedulePresentation(session);
                        } else {
                            finalizeSuccess(session);
                        }
                    },
                });
            } catch (streamError) {
                if (streamError instanceof TokenExpiredError) {
                    discardSession(session);
                    try {
                        await refreshAccessToken();
                        setMessages((previous) =>
                            previous.filter(
                                (message) => message.id !== userMessage.id && message.id !== aiMessage.id
                            )
                        );
                        await sendMessage(content, overrideChatId, fileIds, optimisticFiles, retryCount - 1);
                        return;
                    } catch {
                        const sessionExpiredMessage = i18n.t("toast.sessionExpired");
                        setError(sessionExpiredMessage);
                        setStatus("error");
                        setMessages((previous) =>
                            previous.map((message) =>
                                message.id === aiMessage.id
                                    ? {
                                        ...message,
                                        content: sessionExpiredMessage,
                                        isStreaming: false,
                                        isError: true,
                                    }
                                    : message
                            )
                        );
                        return;
                    }
                }

                if (streamError instanceof DOMException && streamError.name === "AbortError") return;
                if (isActiveSession(session)) {
                    const errorMessage = streamError instanceof Error
                        ? streamError.message
                        : i18n.t("toast.unexpectedError");
                    finalizeError(session, errorMessage);
                }
            } finally {
                session.transportOpen = false;
            }
        },
        [
            chatId,
            discardSession,
            finalizeError,
            finalizeSuccess,
            isActiveSession,
            schedulePresentation,
        ]
    );

    return {
        messages,
        setMessages,
        sources,
        status,
        isLoading: isHistoryLoading,
        hasOlderMessages: !!hasOlderMessages,
        isFetchingOlderMessages,
        error,
        fetchOlderMessages,
        sendMessage,
        stopStreaming,
    };
};
