import { useCallback, useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAuthStore from "@/features/auth/store/auth";
import i18n from "@/lib/i18n";
import { refreshAccessToken } from "@/shared/api";
import { chatService } from "../helpers";
import { mergeStreamMessages } from "../helpers/messages";
import { extractTextFromStreamData } from "../helpers/stream";
import { stopStream as stopStreamService } from "../services";
import { getStreamResponseError, parseFilesEvent, parseSourcesEvent, toStreamErrorMessage } from "../stream/transport";
import { StreamConnectionError, TokenExpiredError, type ActiveStreamSession } from "../stream/types";
import type { ChatMessageFile, LawSource, StreamMessage, StreamStatus } from "../types";
import { useChatMessages } from "./useChatMessages";
import { useStreamSession } from "./useStreamSession";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
    sendMessage: (content: string, overrideChatId?: string, fileIds?: string[], optimisticFiles?: ChatMessageFile[], retryCount?: number) => Promise<void>;
    stopStreaming: () => void;
}

export const useChatStream = ({ chatId }: { chatId: string | undefined }): UseChatStreamReturn => {
    const queryClient = useQueryClient();
    const history = useChatMessages(chatId);
    const [messages, setMessages] = useState<StreamMessage[]>([]);
    const [sources, setSources] = useState<LawSource[]>([]);
    const syncedHistoryChatIdRef = useRef<string | undefined>(undefined);

    const invalidateMessages = useCallback((sessionChatId: string) => {
        void queryClient.invalidateQueries({ queryKey: ["messages", sessionChatId] });
    }, [queryClient]);
    const notifyBackendStop = useCallback(async (chatIdToStop: string) => {
        try { await stopStreamService(chatIdToStop); }
        catch { toast.error(i18n.t("toast.stopStreamError"), { description: i18n.t("toast.tryAgain") }); }
    }, []);
    const notifyBackendStopKeepalive = useCallback((chatIdToStop: string) => {
        const token = useAuthStore.getState().accessToken;
        void fetch(`${BASE_URL}${chatService}/messages/chat/stream/${chatIdToStop}/stop`, {
            method: "POST",
            keepalive: true,
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }).catch(() => undefined);
    }, []);

    const session = useStreamSession({ chatId, setMessages, invalidateMessages, notifyBackendStop, notifyBackendStopKeepalive });
    const { activeSessionRef, setStatus } = session;
    const statusRef = useRef<StreamStatus>("idle");
    statusRef.current = session.status;

    useEffect(() => {
        if (!chatId || !history.data) return;
        const activeSession = activeSessionRef.current;
        const isStreamingCurrentChat = (statusRef.current === "streaming" || statusRef.current === "creating") && activeSession?.chatId === chatId;
        if (isStreamingCurrentChat) return;
        if (syncedHistoryChatIdRef.current !== chatId) {
            syncedHistoryChatIdRef.current = chatId;
            setMessages(history.data);
            return;
        }
        setMessages((previous) => mergeStreamMessages(previous, history.data!));
    }, [activeSessionRef, chatId, history.data]);

    useEffect(() => {
        if (!chatId) {
            syncedHistoryChatIdRef.current = undefined;
            setMessages([]);
            setStatus("idle");
        }
    }, [chatId, setStatus]);

    const sendMessage = useCallback(async (
        content: string,
        overrideChatId?: string,
        fileIds?: string[],
        optimisticFiles?: ChatMessageFile[],
        retryCount = 1,
    ) => {
        const currentChatId = overrideChatId || chatId;
        if (!currentChatId || !content.trim() || session.activeSessionRef.current) return;
        session.setError(null);
        setSources([]);
        const userMessage: StreamMessage = { id: crypto.randomUUID(), content: content.trim(), sender: "user", files: optimisticFiles, isOptimistic: true };
        const aiMessage: StreamMessage = { id: crypto.randomUUID(), content: "", sender: "ai", isStreaming: true, isOptimistic: true };
        setMessages((previous) => [...previous, userMessage, aiMessage]);
        session.setStatus("streaming");

        const params = new URLSearchParams({ chatId: currentChatId, content: content.trim() });
        if (fileIds?.length) params.set("fileIds", fileIds.join(","));
        const controller = new AbortController();
        const activeSession: ActiveStreamSession = {
            id: crypto.randomUUID(), chatId: currentChatId, userMessageId: userMessage.id, aiMessageId: aiMessage.id,
            controller, queue: "", visibleContent: "", frameId: null, lastCommitAt: 0,
            transportComplete: false, transportOpen: true, finalized: false,
        };
        session.activeSessionRef.current = activeSession;
        const token = useAuthStore.getState().accessToken;
        const url = `${BASE_URL}${chatService}/messages/chat/stream?${params.toString()}`;

        try {
            await fetchEventSource(url, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`, Accept: "text/event-stream" },
                signal: controller.signal,
                openWhenHidden: true,
                async onopen(response) {
                    if (!session.isActiveSession(activeSession)) return;
                    if (response.status === 401 && retryCount > 0) throw new TokenExpiredError();
                    if (response.ok && response.headers.get("content-type")?.includes("text/event-stream")) return;
                    throw await getStreamResponseError(response);
                },
                onmessage(event) {
                    if (!session.isActiveSession(activeSession)) return;
                    const eventType = event.event || "message";
                    if (eventType === "message") {
                        const text = extractTextFromStreamData(event.data);
                        if (text) { activeSession.queue += text; session.schedulePresentation(activeSession); }
                    } else if (eventType === "sources") {
                        const parsed = parseSourcesEvent(event.data);
                        if (parsed) setSources(parsed);
                        else if (import.meta.env.DEV) console.debug("[SSE] Invalid sources event", event.data);
                    } else if (eventType === "files") {
                        const parsed = parseFilesEvent(event.data);
                        if (!parsed) {
                            if (import.meta.env.DEV) console.debug("[SSE] Invalid files event", event.data);
                            return;
                        }
                        setMessages((previous) => previous.map((message) => {
                            if (parsed.messageId && message.id === parsed.messageId) return { ...message, files: parsed.files };
                            if (!parsed.messageId && message.id === activeSession.userMessageId) return { ...message, files: parsed.files };
                            return message;
                        }));
                    } else if (eventType === "error") {
                        throw new StreamConnectionError(event.data || i18n.t("toast.connectionError"));
                    }
                },
                onerror(error) {
                    if (error instanceof TokenExpiredError) throw error;
                    if (!session.isActiveSession(activeSession)) throw error;
                    session.finalizeError(activeSession, toStreamErrorMessage(error));
                    throw error;
                },
                onclose() {
                    if (!session.isActiveSession(activeSession)) return;
                    activeSession.transportOpen = false;
                    activeSession.transportComplete = true;
                    if (document.hidden) session.finalizeSuccess(activeSession, true);
                    else if (activeSession.queue) session.schedulePresentation(activeSession);
                    else session.finalizeSuccess(activeSession);
                },
            });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                session.discardSession(activeSession);
                try {
                    await refreshAccessToken();
                    setMessages((previous) => previous.filter((message) => message.id !== userMessage.id && message.id !== aiMessage.id));
                    await sendMessage(content, overrideChatId, fileIds, optimisticFiles, retryCount - 1);
                    return;
                } catch {
                    const message = i18n.t("toast.sessionExpired");
                    session.setError(message);
                    session.setStatus("error");
                    setMessages((previous) => previous.map((item) => item.id === aiMessage.id ? { ...item, content: message, isStreaming: false, isError: true } : item));
                    return;
                }
            }
            if (error instanceof DOMException && error.name === "AbortError") return;
            if (session.isActiveSession(activeSession)) session.finalizeError(activeSession, error instanceof Error ? error.message : i18n.t("toast.unexpectedError"));
        } finally {
            activeSession.transportOpen = false;
        }
    }, [chatId, session]);

    return {
        messages,
        setMessages,
        sources,
        status: session.status,
        isLoading: history.isLoading,
        hasOlderMessages: !!history.hasNextPage,
        isFetchingOlderMessages: history.isFetchingNextPage,
        error: session.error,
        fetchOlderMessages: history.fetchNextPage,
        sendMessage,
        stopStreaming: session.stopStreaming,
    };
};
