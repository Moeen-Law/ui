import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { StreamMessage } from "../types";

const TOP_FETCH_THRESHOLD_PX = 80;

interface Options {
    chatId?: string;
    messages: StreamMessage[];
    isStreaming?: boolean;
    isLoading?: boolean;
    hasOlderMessages: boolean;
    isFetchingOlderMessages: boolean;
    fetchOlderMessages?: () => Promise<unknown>;
}

export function useChatMessageScroll(options: Options) {
    const { chatId, messages, isStreaming, isLoading, hasOlderMessages, isFetchingOlderMessages, fetchOlderMessages } = options;
    const scrollRef = useRef<HTMLDivElement>(null);
    const loadOlderRef = useRef<HTMLDivElement>(null);
    const shouldStickToBottomRef = useRef(true);
    const scrollFrameRef = useRef<number | null>(null);
    const previousChatIdRef = useRef<string | undefined>(chatId);
    const pendingScrollRestoreRef = useRef<{ scrollHeight: number; scrollTop: number } | null>(null);
    const skipNextScrollEffectRef = useRef(false);
    const hasSettledInitialScrollRef = useRef(false);
    const hasUserScrolledRef = useRef(false);
    const isFetchOlderInFlightRef = useRef(false);

    const isNearBottom = useCallback(() => {
        const container = scrollRef.current;
        return !container || container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    }, []);

    const scheduleScrollToBottom = useCallback((force = false, afterLayout = false, onComplete?: () => void) => {
        if (force && scrollFrameRef.current !== null) {
            window.cancelAnimationFrame(scrollFrameRef.current);
            scrollFrameRef.current = null;
        }
        if ((!force && !shouldStickToBottomRef.current) || scrollFrameRef.current !== null) return;
        scrollFrameRef.current = window.requestAnimationFrame(() => {
            const scroll = () => {
                const container = scrollRef.current;
                scrollFrameRef.current = null;
                if (container && (force || shouldStickToBottomRef.current)) container.scrollTop = container.scrollHeight;
                onComplete?.();
            };
            if (afterLayout) scrollFrameRef.current = window.requestAnimationFrame(scroll);
            else scroll();
        });
    }, []);

    const tryFetchOlderMessages = useCallback(async () => {
        const container = scrollRef.current;
        if (!container || !fetchOlderMessages || !hasOlderMessages || isFetchingOlderMessages || isFetchOlderInFlightRef.current || !hasSettledInitialScrollRef.current || !hasUserScrolledRef.current || container.scrollTop > TOP_FETCH_THRESHOLD_PX) return;
        pendingScrollRestoreRef.current = { scrollHeight: container.scrollHeight, scrollTop: container.scrollTop };
        isFetchOlderInFlightRef.current = true;
        try { await fetchOlderMessages(); } finally { isFetchOlderInFlightRef.current = false; }
    }, [fetchOlderMessages, hasOlderMessages, isFetchingOlderMessages]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const handleScroll = () => {
            if (!hasSettledInitialScrollRef.current) return;
            shouldStickToBottomRef.current = isNearBottom();
            if (hasUserScrolledRef.current && container.scrollTop <= TOP_FETCH_THRESHOLD_PX) void tryFetchOlderMessages();
        };
        const markUserScrollIntent = () => {
            if (!hasSettledInitialScrollRef.current) return;
            hasUserScrolledRef.current = true;
            if (container.scrollTop <= TOP_FETCH_THRESHOLD_PX) void tryFetchOlderMessages();
        };
        container.addEventListener("scroll", handleScroll);
        container.addEventListener("wheel", markUserScrollIntent, { passive: true });
        container.addEventListener("touchstart", markUserScrollIntent, { passive: true });
        container.addEventListener("pointerdown", markUserScrollIntent);
        container.addEventListener("keydown", markUserScrollIntent);
        return () => {
            container.removeEventListener("scroll", handleScroll);
            container.removeEventListener("wheel", markUserScrollIntent);
            container.removeEventListener("touchstart", markUserScrollIntent);
            container.removeEventListener("pointerdown", markUserScrollIntent);
            container.removeEventListener("keydown", markUserScrollIntent);
        };
    }, [isNearBottom, tryFetchOlderMessages]);

    useEffect(() => {
        const container = scrollRef.current;
        const target = loadOlderRef.current;
        if (!container || !target || !hasOlderMessages || isLoading) return;
        const observer = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) void tryFetchOlderMessages(); }, { root: container, rootMargin: "240px 0px 0px 0px", threshold: 0 });
        observer.observe(target);
        return () => observer.disconnect();
    }, [tryFetchOlderMessages, hasOlderMessages, isLoading]);

    useLayoutEffect(() => {
        const restore = pendingScrollRestoreRef.current;
        const container = scrollRef.current;
        if (!restore || !container) return;
        pendingScrollRestoreRef.current = null;
        skipNextScrollEffectRef.current = true;
        shouldStickToBottomRef.current = false;
        container.scrollTop = container.scrollHeight - restore.scrollHeight + restore.scrollTop;
    }, [messages]);

    useEffect(() => {
        const isNewChat = chatId !== previousChatIdRef.current;
        if (isNewChat) {
            previousChatIdRef.current = chatId;
            shouldStickToBottomRef.current = true;
            hasSettledInitialScrollRef.current = false;
            hasUserScrolledRef.current = false;
            scheduleScrollToBottom(true, true, () => { hasSettledInitialScrollRef.current = true; });
            return;
        }
        if (skipNextScrollEffectRef.current) { skipNextScrollEffectRef.current = false; return; }
        if (isNearBottom()) shouldStickToBottomRef.current = true;
        const shouldSettle = !hasSettledInitialScrollRef.current && !isLoading && messages.length > 0;
        scheduleScrollToBottom(shouldSettle, shouldSettle, shouldSettle ? () => { hasSettledInitialScrollRef.current = true; } : undefined);
    }, [chatId, messages, isLoading, isStreaming, isNearBottom, scheduleScrollToBottom]);

    useEffect(() => () => { if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current); }, []);
    return { scrollRef, loadOlderRef };
}
