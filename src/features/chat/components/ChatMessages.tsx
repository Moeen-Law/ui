import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";

export interface Message {
    id: number;
    text: string;
    sender: "user" | "ai";
}

interface ChatMessagesProps {
    messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto pt-4 md:pt-8 pb-40 md:pb-48 space-y-6 custom-scrollbar scroll-smooth"
        >
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <AnimatePresence mode="popLayout">
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
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
                        messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-start ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                <div className={`max-w-[85%] md:max-w-[80%] p-4 rounded-2xl leading-relaxed text-[0.95rem] shadow-sm ${msg.sender === "user"
                                    ? "bg-[#252525] text-white border border-[#333333]"
                                    : "bg-transparent text-white"
                                    }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
