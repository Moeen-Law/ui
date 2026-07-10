import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import i18n from "@/lib/i18n";
import { getStreamGraphemesPerUpdate, takeStreamPrefix } from "../helpers/stream";
import type { StreamMessage, StreamStatus } from "../types";
import type { ActiveStreamSession } from "../stream/types";

const STREAM_COMMIT_INTERVAL_MS = 32;

interface Options {
    chatId?: string;
    setMessages: Dispatch<SetStateAction<StreamMessage[]>>;
    invalidateMessages: (chatId: string) => void;
    notifyBackendStop: (chatId: string) => Promise<void>;
    notifyBackendStopKeepalive: (chatId: string) => void;
}

export function useStreamSession({ chatId, setMessages, invalidateMessages, notifyBackendStop, notifyBackendStopKeepalive }: Options) {
    const [status, setStatus] = useState<StreamStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const activeSessionRef = useRef<ActiveStreamSession | null>(null);
    const frameCallbackRef = useRef<FrameRequestCallback>(() => undefined);

    const isActiveSession = useCallback((session: ActiveStreamSession) => activeSessionRef.current?.id === session.id && !session.finalized, []);
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
        setMessages((previous) => previous.map((message) => message.id === session.aiMessageId
            ? { ...message, content: finalContent, isStreaming: false, isOptimistic: true }
            : message));
        setStatus("done");
        activeSessionRef.current = null;
        invalidateMessages(session.chatId);
    }, [cancelPresentationFrame, invalidateMessages, isActiveSession, setMessages]);

    const finalizeError = useCallback((session: ActiveStreamSession, errorMessage: string) => {
        if (!isActiveSession(session)) return;
        cancelPresentationFrame(session);
        const partialContent = session.visibleContent + session.queue;
        session.queue = "";
        session.visibleContent = partialContent;
        session.finalized = true;
        session.transportOpen = false;
        session.controller.abort();
        setError(errorMessage);
        setStatus("error");
        setMessages((previous) => previous.map((message) => message.id === session.aiMessageId
            ? { ...message, content: partialContent || errorMessage, isStreaming: false, isError: true }
            : message));
        activeSessionRef.current = null;
        toast.error(errorMessage);
    }, [cancelPresentationFrame, isActiveSession, setMessages]);

    const discardSession = useCallback((session: ActiveStreamSession) => {
        if (activeSessionRef.current?.id !== session.id) return;
        cancelPresentationFrame(session);
        session.finalized = true;
        session.transportOpen = false;
        session.controller.abort();
        activeSessionRef.current = null;
    }, [cancelPresentationFrame]);

    useEffect(() => {
        frameCallbackRef.current = (timestamp) => {
            const activeSession = activeSessionRef.current;
            if (!activeSession || activeSession.finalized) return;
            activeSession.frameId = null;
            if (!activeSession.queue) {
                if (activeSession.transportComplete) finalizeSuccess(activeSession);
                return;
            }
            if (timestamp - activeSession.lastCommitAt < STREAM_COMMIT_INTERVAL_MS) {
                schedulePresentation(activeSession);
                return;
            }
            const { visible, remaining } = takeStreamPrefix(activeSession.queue, getStreamGraphemesPerUpdate(activeSession.queue.length));
            activeSession.queue = remaining;
            activeSession.visibleContent += visible;
            activeSession.lastCommitAt = timestamp;
            const content = activeSession.visibleContent;
            setMessages((previous) => previous.map((message) => message.id === activeSession.aiMessageId ? { ...message, content } : message));
            if (activeSession.queue) schedulePresentation(activeSession);
            else if (activeSession.transportComplete) finalizeSuccess(activeSession);
        };
    }, [finalizeSuccess, schedulePresentation, setMessages]);

    const stopStreaming = useCallback(() => {
        const session = activeSessionRef.current;
        if (!session || session.finalized) return;
        if (session.transportComplete) { finalizeSuccess(session, true); return; }
        const content = session.visibleContent + session.queue;
        const shouldNotify = session.transportOpen;
        const sessionChatId = session.chatId;
        cancelPresentationFrame(session);
        session.queue = "";
        session.visibleContent = content;
        session.finalized = true;
        session.transportOpen = false;
        session.controller.abort();
        setStatus("done");
        setMessages((previous) => previous.map((message) => message.id === session.aiMessageId
            ? { ...message, content: content || message.content || i18n.t("toast.streamStopped"), isStreaming: false, isStopped: true }
            : message));
        activeSessionRef.current = null;
        if (shouldNotify) void notifyBackendStop(sessionChatId);
    }, [cancelPresentationFrame, finalizeSuccess, notifyBackendStop, setMessages]);

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

    useEffect(() => () => {
        const session = activeSessionRef.current;
        if (!session || session.finalized) return;
        const shouldNotify = session.transportOpen;
        const sessionChatId = session.chatId;
        discardSession(session);
        if (shouldNotify) void notifyBackendStop(sessionChatId);
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
            const shouldNotify = session.transportOpen;
            const sessionChatId = session.chatId;
            discardSession(session);
            if (shouldNotify) void notifyBackendStop(sessionChatId);
        }
        const continuesInNavigatedChat = !!session && !session.finalized && session.chatId === chatId;
        // Route changes intentionally reset the externally-driven stream state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!continuesInNavigatedChat) setStatus("idle");
        previousChatIdRef.current = chatId;
    }, [chatId, discardSession, notifyBackendStop]);

    return { status, setStatus, error, setError, activeSessionRef, isActiveSession, schedulePresentation, finalizeSuccess, finalizeError, discardSession, stopStreaming };
}
