import { MessageSquare } from "lucide-react";
import type { ChatResponseDatum } from "../types";
import { cn } from "@/lib/utils";
import ChatMenu from "./ChatMenu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ChatCardProps {
    chat: ChatResponseDatum;
    isActive?: boolean;
    setOpenAlertModal: (open: boolean) => void;
    setSelectedId: (chatId: string) => void;
    setOpenUpdateChatTitleModal: (open: boolean) => void;
    setSelectedChat: (chat: ChatResponseDatum) => void;
}

export default function ChatCard({
    chat,
    isActive,
    setOpenAlertModal,
    setSelectedId,
    setOpenUpdateChatTitleModal,
    setSelectedChat,
}: ChatCardProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    return (
        <div
            onClick={() => navigate(`/chat/${chat.id}`)}
            title={chat.title}
            className={cn(
                "group relative flex items-center gap-3 w-full p-3 rounded-xl transition-all cursor-pointer border border-transparent",
                isActive
                    ? "bg-blue-500/15 ring-1 ring-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                    : "hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 dark:hover:text-blue-300"
            )}
        >
            {/* Active Indicator Line */}
            {isActive && (
                <div className="absolute start-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-blue-500 rounded-e-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            )}

            <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300",
                isActive
                    ? "bg-blue-500/25 text-blue-400 scale-105"
                    : "bg-muted group-hover:bg-muted/70 text-muted-foreground group-hover:text-foreground"
            )}>
                <MessageSquare className="w-4.5 h-4.5" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className={cn(
                        "text-sm font-bold truncate leading-none transition-colors",
                        isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground/80 group-hover:text-foreground"
                    )}>
                        {chat.title || t("chat.ui.newChat")}
                    </p>
                    {!chat.title && (
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase">{t("chat.ui.newBadge")}</span>
                    )}
                </div>
                <p className="text-[10px] text-muted-foreground group-hover:text-muted-foreground/80 transition-colors truncate">
                    {new Date(chat.createdAt).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>

            <div className={cn(
                "transition-all duration-300",
                isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
            )}>
                <ChatMenu chat={chat} setOpenUpdateChatTitleModal={setOpenUpdateChatTitleModal} setSelectedChat={setSelectedChat} setSelectedId={setSelectedId} setOpenAlertModal={setOpenAlertModal} />
            </div>
        </div>
    );
}
