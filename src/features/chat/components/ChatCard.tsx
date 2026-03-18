import { MessageSquare } from "lucide-react";
import type { ChatResponseDatum } from "../types";
import { cn } from "@/lib/utils";
import ChatMenu from "./ChatMenu";
import { useNavigate } from "react-router-dom";

interface ChatCardProps {
    chat: ChatResponseDatum;
    isActive?: boolean;
    onClick?: () => void;
}

export default function ChatCard({
    chat,
    isActive,
}: ChatCardProps) {
    const navigate = useNavigate();
    
    return (
        <div
            onClick={() => navigate(`/chat/${chat.id}`)}
            title={chat.title}
            className={cn(
                "group relative flex items-center gap-3 w-full p-3 rounded-xl transition-all cursor-pointer border border-transparent",
                isActive
                    ? "bg-white/10 ring-1 ring-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                    : "hover:bg-white/[0.03] text-[#a0a0a0] hover:text-white"
            )}
        >
            {/* Active Indicator Line */}
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            )}

            <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300",
                isActive 
                    ? "bg-blue-500/20 text-blue-400 scale-105" 
                    : "bg-white/5 group-hover:bg-white/10 text-[#666] group-hover:text-white"
            )}>
                <MessageSquare className="w-4.5 h-4.5" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className={cn(
                        "text-sm font-bold truncate leading-none transition-colors",
                        isActive ? "text-white" : "text-[#d0d0d0] group-hover:text-white"
                    )}>
                        {chat.title || "محادثة جديدة"}
                    </p>
                    {!chat.title && (
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase">جديد</span>
                    )}
                </div>
                <p className="text-[10px] text-[#555] group-hover:text-[#888] transition-colors truncate">
                    {new Date(chat.createdAt).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>

            <div className={cn(
                "transition-all duration-300",
                isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
            )}>
                <ChatMenu chatId={chat.id} />
            </div>
        </div>
    );
}
