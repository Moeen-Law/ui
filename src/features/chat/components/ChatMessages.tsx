import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import type { StreamMessage } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";
import TypingIndicator from "./TypingIndicator";
import MessagesSkeleton from "./MessagesSkeleton";

interface ChatMessagesProps {
    messages: StreamMessage[];
    isStreaming?: boolean;
    isLoading?: boolean;
}



export default function ChatMessages({ messages, isStreaming, isLoading }: ChatMessagesProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll reliably by observing actual physical DOM resizing
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let isUserScrolling = false;

        const observer = new ResizeObserver(() => {
            // Scroll to the bottom whenever the physical content resizes 
            // (e.g., when Skeleton swaps to Messages, or during streaming)
            if (!isUserScrolling) {
                container.scrollTop = container.scrollHeight;
            }
        });

        // Observe the internal wrapper that holds the messages
        const innerContent = container.firstElementChild;
        if (innerContent) {
            observer.observe(innerContent);
        }

        // Briefly pause auto-scroll if the user intentionally scrolls up
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            isUserScrolling = !isNearBottom;
        };

        container.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            container.removeEventListener('scroll', handleScroll);
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
                            className="bg-[#0a0a0a]"
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
                            <h2 className="text-2xl md:text-4xl font-black mb-4 bg-linear-to-br from-white to-[#707070] bg-clip-text text-transparent">كيف يمكنني مساعدتك؟</h2>
                            <p className="text-[#808080] max-w-md mx-auto leading-relaxed text-sm md:text-base">
                                ابدأ محادثة جديدة مع مساعدك القانوني الذكي. يمكنني مساعدتك في تحليل المستندات، إنشاء العقود، وشرح المصطلحات القانونية المصرية.
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
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-start ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div className={`max-w-[85%] md:max-w-[80%] p-4 rounded-2xl leading-relaxed text-[0.95rem] shadow-sm ${msg.sender === "user"
                                        ? "bg-[#252525] text-white border mb-2 mt-2 border-[#333333]"
                                        : msg.isError
                                            ? "bg-red-500/10 border border-red-500/20 text-red-200"
                                            : "bg-transparent text-white"
                                        }`}>
                                        {msg.sender === "ai" ? (
                                            <>
                                                {msg.content ? (
                                                    <MarkdownRenderer content={msg.content} />
                                                ) : msg.isStreaming ? (
                                                    <TypingIndicator />
                                                ) : null}
                                                {msg.content && msg.isStreaming && (
                                                    <motion.span
                                                        className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 align-middle"
                                                        animate={{ opacity: [1, 0] }}
                                                        transition={{ duration: 0.7, repeat: Infinity }}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
