import { MessageSquare } from "lucide-react";
import type { ChatResponseDatum } from "../types";
import { cn } from "@/lib/utils";
import ChatMenu from "./ChatMenu";

interface ChatCardProps {
    chat: ChatResponseDatum;
    isActive?: boolean;
    onClick?: () => void;
}

export default function ChatCard({
    chat,
    isActive,
    onClick,
}: ChatCardProps) {
    return (
        <div
            onClick={onClick}
            title={chat.title}
            className={cn(
                "group relative flex items-center gap-3 w-full p-3 rounded-xl transition-all cursor-pointer border border-transparent",
                isActive
                    ? "bg-[#1a1a1a] border-white/5 shadow-lg"
                    : "hover:bg-[#151515] text-[#a0a0a0] hover:text-white"
            )}
        >
            <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                isActive ? "bg-white/10 text-white" : "bg-white/5 group-hover:bg-white/10"
            )}>
                <MessageSquare className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate leading-none mb-1">
                    {chat.title || "محادثة جديدة"}
                </p>
                <p className="text-[10px] text-[#555] group-hover:text-[#777] transition-colors truncate">
                    {new Date(chat.createdAt).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className={cn(
                "transition-opacity",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 max-lg:opacity-100"
            )}>
                <ChatMenu chatId={chat.id} />
            </div>
        </div>
    );
}
