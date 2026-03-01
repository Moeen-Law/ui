import { Paperclip, Send, ShieldCheck } from "lucide-react";

interface ChatInputProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSendMessage: () => void;
}

export default function ChatInput({ inputValue, setInputValue, handleSendMessage }: ChatInputProps) {
    return (
        <div className="p-4 md:p-8 pt-0 mt-auto">
            <div className="max-w-4xl mx-auto">
                <div className="relative bg-[#111111] border border-[#2a2a2a] rounded-2xl p-2 focus-within:border-blue-500 transition-colors shadow-2xl">
                    <div className="flex items-end gap-2 px-2 py-1">
                        <button className="p-2 text-[#707070] hover:text-white transition-colors">
                            <Paperclip className="w-5 h-5 mb-1 cursor-pointer" />
                        </button>
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="اكتب سؤالك القانوني هنا..."
                            className="w-full bg-transparent border-none outline-none focus:ring-0 text-white placeholder-[#707070] text-[0.95rem] py-2 resize-none max-h-[150px] min-h-[44px]"
                            style={{ height: 'auto' }}
                            rows={1}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                        >
                            <Send className="w-5 h-5 " />
                        </button>
                    </div>
                </div>
                <p className="text-center text-[#707070] text-xs mt-4 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>مُعين يمكن أن يخطئ. تحقق من المعلومات المهمة.</span>
                </p>
            </div>
        </div>
    );
}
