import { Paperclip, Send, ShieldCheck, Square } from "lucide-react";
import type { StreamStatus } from "../types";

interface ChatInputProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSendMessage: () => void;
    streamStatus: StreamStatus;
    onStopStreaming: () => void;
    isLoading?: boolean;
}

export default function ChatInput({
    inputValue,
    setInputValue,
    handleSendMessage,
    streamStatus,
    onStopStreaming,
    isLoading,
}: ChatInputProps) {
    const isProcessing = streamStatus === "streaming" || streamStatus === "creating" || isLoading;
    const canSend = inputValue.trim().length > 0 && !isProcessing;

    return (
        <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent pt-10 pb-4 md:pb-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto relative">
                <div className="relative bg-[#111111] border border-[#2a2a2a] rounded-2xl p-2 focus-within:border-blue-500/50 transition-all shadow-2xl backdrop-blur-sm">
                    <div className="flex items-end gap-2 px-2 py-1">
                        <button className="p-2 text-[#707070] hover:text-white transition-colors">
                            <Paperclip className="w-5 h-5 mb-1 cursor-pointer" />
                        </button>
                        <textarea
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (canSend) {
                                        handleSendMessage();
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = 'auto';
                                    }
                                }
                            }}
                            placeholder="اكتب سؤالك القانوني هنا..."
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            disabled={isProcessing}
                            className="w-full bg-transparent border-none outline-none focus:ring-0 text-white placeholder-[#707070] text-[1.1rem] py-2 resize-none max-h-[200px] min-h-[44px] custom-scrollbar disabled:opacity-50"
                            rows={1}
                        />
                        {(streamStatus === "streaming" || streamStatus === "creating") ? (
                            <button
                                onClick={onStopStreaming}
                                className="p-3 bg-red-500/80 text-white rounded-xl hover:bg-red-500 transition-all shrink-0 cursor-pointer shadow-lg shadow-red-500/20"
                                title="إيقاف التوليد"
                            >
                                <Square className="w-5 h-5 fill-current" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSendMessage}
                                disabled={!canSend}
                                className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-lg shadow-blue-500/20"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-center text-[#505050] text-[10px] md:text-xs mt-3 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>مُعين يمكن أن يخطئ. تحقق من المعلومات المهمة.</span>
                </p>
            </div>
        </div>
    );
}
