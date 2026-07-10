import { memo } from "react";
import { motion } from "framer-motion";
import type { StreamMessage } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";
import MessageFiles from "./MessageFiles";
import StreamingCursor from "./StreamingCursor";
import TypingIndicator from "./TypingIndicator";

export default memo(function MessageRow({ msg }: { msg: StreamMessage }) {
    return (
        <motion.div layout={false} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }} className={`flex items-start ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`max-w-[85%] md:max-w-[80%] leading-relaxed text-[1.1rem] ${msg.sender === "user" ? "bg-blue-500 text-white px-4 py-3 rounded-2xl mb-2 mt-2" : msg.isError ? "bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl p-4" : msg.isStopped ? "opacity-90" : ""}`}>
                {msg.sender === "ai" ? (
                    msg.content ? (
                        msg.isStreaming ? (
                            <div dir="rtl" className="whitespace-pre-wrap text-start leading-relaxed" data-testid="streaming-message-content">
                                {msg.content}<StreamingCursor />
                            </div>
                        ) : <MarkdownRenderer content={msg.content} isStreaming={false} contentDir="rtl" />
                    ) : msg.isStreaming ? <TypingIndicator /> : null
                ) : (
                    <><div>{msg.content}</div><MessageFiles files={msg.files ?? []} /></>
                )}
            </div>
        </motion.div>
    );
}, (prev, next) =>
    prev.msg.id === next.msg.id && prev.msg.content === next.msg.content &&
    prev.msg.isStreaming === next.msg.isStreaming && prev.msg.isError === next.msg.isError &&
    prev.msg.isStopped === next.msg.isStopped && prev.msg.files === next.msg.files &&
    prev.msg.sender === next.msg.sender
);
