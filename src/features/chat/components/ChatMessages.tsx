import { memo, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Download, FileText, MessageSquare } from "lucide-react";
import type { ChatMessageFile, StreamMessage } from "../types";
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

const formatFileSize = (bytes: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MessageFiles = memo(function MessageFiles({ files }: { files: ChatMessageFile[] }) {
    if (files.length === 0) return null;

    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {files.map((file) => {
                const content = (
                    <>
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 truncate">{file.originalName}</span>
                        {file.size > 0 && (
                            <span className="shrink-0 opacity-70">{formatFileSize(file.size)}</span>
                        )}
                        {file.downloadUrl && <Download className="h-3.5 w-3.5 shrink-0 opacity-70" />}
                    </>
                );

                const className = "flex max-w-[240px] items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-2.5 py-2 text-xs font-semibold";

                return file.downloadUrl ? (
                    <a
                        key={file.fileId}
                        href={file.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`${className} transition-colors hover:bg-white/15`}
                    >
                        {content}
                    </a>
                ) : (
                    <div key={file.fileId} className={className}>
                        {content}
                    </div>
                );
            })}
        </div>
    );
});

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
                    : msg.isError
                        ? "bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl p-4"
                        : msg.isStopped
                            ? "opacity-90"
                        : ""
                }`}
            >
                {msg.sender === "ai" ? (
                    <>
                        {msg.content ? (
                            <MarkdownRenderer content={msg.content} isStreaming={msg.isStreaming} />
                        ) : msg.isStreaming ? (
                            <TypingIndicator />
                        ) : null}
                        {msg.content && msg.isStreaming && <StreamingCursor />}
                    </>
                ) : (
                    <>
                        <div>{msg.content}</div>
                        <MessageFiles files={msg.files ?? []} />
                    </>
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
    prev.msg.files === next.msg.files &&
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
                {isLoading ? (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-background"
                    >
                        <MessagesSkeleton />
                    </motion.div>
                ) : messages.length === 0 && !isStreaming ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
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
                    <div>
                        {messages.map((msg) => (
                            <MessageRow key={msg.id} msg={msg} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
