import { motion } from "framer-motion";
import { Loader2, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { StreamMessage } from "../types";
import { useChatMessageScroll } from "../hooks/useChatMessageScroll";
import MessageRow from "./MessageRow";
import MessagesSkeleton from "./MessagesSkeleton";

interface ChatMessagesProps {
    chatId?: string;
    messages: StreamMessage[];
    isStreaming?: boolean;
    isLoading?: boolean;
    hasOlderMessages?: boolean;
    isFetchingOlderMessages?: boolean;
    fetchOlderMessages?: () => Promise<unknown>;
}

export default function ChatMessages({ chatId, messages, isStreaming, isLoading, hasOlderMessages = false, isFetchingOlderMessages = false, fetchOlderMessages }: ChatMessagesProps) {
    const { t } = useTranslation();
    const { scrollRef, loadOlderRef } = useChatMessageScroll({ chatId, messages, isStreaming, isLoading, hasOlderMessages, isFetchingOlderMessages, fetchOlderMessages });

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto pt-4 md:pt-8 pb-40 md:pb-48 space-y-6 custom-scrollbar">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                {isLoading ? (
                    <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-background"><MessagesSkeleton /></motion.div>
                ) : messages.length === 0 && !isStreaming ? (
                    <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 shadow-inner"><MessageSquare className="w-8 h-8" /></div>
                        <h2 className="text-2xl md:text-4xl font-black mb-4 bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">{t("chat.ui.howCanIHelp")}</h2>
                        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-sm md:text-base">{t("chat.ui.welcomeMessage")}</p>
                    </motion.div>
                ) : (
                    <div>
                        <div ref={loadOlderRef} className="min-h-1">{isFetchingOlderMessages && <div className="flex justify-center py-3"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>}</div>
                        {messages.map((msg) => <MessageRow key={msg.id} msg={msg} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
