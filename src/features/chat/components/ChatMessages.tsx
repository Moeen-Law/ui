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
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
            <AnimatePresence mode="popLayout">
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-full flex flex-col items-center justify-center text-center px-4"
                    >
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-3">ابدأ محادثة جديدة</h2>
                        <p className="text-[#a0a0a0] max-w-md mx-auto leading-relaxed">
                            ابدأ محادثة جديدة مع مساعدك القانوني الذكي. يمكنني مساعدتك في تحليل المستندات، إنشاء العقود، وشرح المصطلحات القانونية المصرية.
                        </p>
                    </motion.div>
                ) : (
                    messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-start gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${msg.sender === "user" ? "bg-amber-400 text-[#0a0a0a]" : "bg-blue-500 text-white"
                                }`}>
                                {msg.sender === "user" ? "م" : "AI"}
                            </div>
                            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-xl leading-relaxed text-[0.95rem] ${msg.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-[#1a1a1a] border border-[#2a2a2a] text-white"
                                }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
}
