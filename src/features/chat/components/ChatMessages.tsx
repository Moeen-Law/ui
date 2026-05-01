import { memo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import type { StreamMessage } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";
import TypingIndicator from "./TypingIndicator";
import MessagesSkeleton from "./MessagesSkeleton";
import { useTranslation } from "react-i18next";
import StreamingCursor from "./StreamingCursor";

interface ChatMessagesProps {
    chatId?: string;
    messages: StreamMessage[];
    isStreaming?: boolean;
    isLoading?: boolean;
}

interface MessageRowProps {
    msg: StreamMessage;
}



const MessageRow = memo(function MessageRow({ msg }: MessageRowProps) {
    return (
        <motion.div
            layout={false}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
            className={`flex items-start ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
        >
            <div className={`max-w-[85%] md:max-w-[80%] leading-relaxed text-[1.1rem] ${msg.sender === "user"
                ? "bg-blue-500 text-white px-4 py-3 rounded-2xl mb-2 mt-2"
                : msg.isStopped
                    ? "bg-red-500/20 border border-red-500/30 text-red-100 font-medium rounded-2xl p-4"
                    : msg.isError
                        ? "bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl p-4"
                        : ""
                }`}
            >
                {msg.sender === "ai" ? (
                    <>
                        {msg.content ? (
                            <MarkdownRenderer content={msg.content} />
                        ) : msg.isStreaming ? (
                            <TypingIndicator />
                        ) : null}
                        {msg.content && msg.isStreaming && <StreamingCursor />}
                    </>
                ) : (
                    msg.content
                )}
            </div>
        </motion.div>
    );
}, (prev, next) =>
    prev.msg.id === next.msg.id &&
    prev.msg.content === next.msg.content &&
    prev.msg.isStreaming === next.msg.isStreaming &&
    prev.msg.isError === next.msg.isError &&
    prev.msg.isStopped === next.msg.isStopped &&
    prev.msg.sender === next.msg.sender
);

export default function ChatMessages({ chatId, messages, isStreaming, isLoading }: ChatMessagesProps) {
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const shouldStickToBottomRef = useRef(true);
    const scrollFrameRef = useRef<number | null>(null);
    const previousChatIdRef = useRef<string | undefined>(chatId);

    const isNearBottom = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return true;
        return container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    }, []);

    const scheduleScrollToBottom = useCallback((force = false, afterLayout = false) => {
        if (force && scrollFrameRef.current !== null) {
            window.cancelAnimationFrame(scrollFrameRef.current);
            scrollFrameRef.current = null;
        }

        if ((!force && !shouldStickToBottomRef.current) || scrollFrameRef.current !== null) return;

        scrollFrameRef.current = window.requestAnimationFrame(() => {
            const scroll = () => {
                const container = scrollRef.current;
                scrollFrameRef.current = null;
                if (container && (force || shouldStickToBottomRef.current)) {
                    container.scrollTop = container.scrollHeight;
                }
            };

            if (afterLayout) {
                scrollFrameRef.current = window.requestAnimationFrame(scroll);
                return;
            }

            scroll();
        });
    }, []);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            shouldStickToBottomRef.current = isNearBottom();
        };

        container.addEventListener('scroll', handleScroll);

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [isNearBottom]);

    useEffect(() => {
        const isNewChat = chatId !== previousChatIdRef.current;

        if (isNewChat) {
            previousChatIdRef.current = chatId;
            shouldStickToBottomRef.current = true;
            scheduleScrollToBottom(true, true);
            return;
        }

        if (isNearBottom()) {
            shouldStickToBottomRef.current = true;
        }
        scheduleScrollToBottom();
    }, [chatId, messages, isLoading, isStreaming, isNearBottom, scheduleScrollToBottom]);

    useEffect(() => {
        return () => {
            if (scrollFrameRef.current !== null) {
                window.cancelAnimationFrame(scrollFrameRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto pt-4 md:pt-8 pb-40 md:pb-48 space-y-6 custom-scrollbar"
        >
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-background"
                        >
                            <MessagesSkeleton />
                        </motion.div>
                    ) : messages.length === 0 && !isStreaming ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"
                        >
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 shadow-inner">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black mb-4 bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">{t("chat.ui.howCanIHelp")}</h2>
                            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-sm md:text-base">
                                {t("chat.ui.welcomeMessage")}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="messages-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {messages.map((msg) => (
                                <MessageRow key={msg.id} msg={msg} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
