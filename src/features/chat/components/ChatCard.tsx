import { MoreHorizontal, Trash2, Edit3, MessageSquare } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ChatResponseDatum } from "../types";
import { cn } from "@/lib/utils";

interface ChatCardProps {
    chat: ChatResponseDatum;
    isActive?: boolean;
    onClick?: () => void;
    onDelete?: (id: string) => void;
    onRename?: (id: string) => void;
}

export default function ChatCard({ 
    chat, 
    isActive, 
    onClick, 
    onDelete, 
    onRename 
}: ChatCardProps) {
    return (
        <div 
            onClick={onClick}
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

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-white/10 text-[#a0a0a0] hover:text-white transition-colors cursor-pointer">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#111] border-white/10 text-white min-w-[160px] p-1.5 rounded-xl shadow-2xl">
                        <DropdownMenuItem 
                            onClick={(e) => {
                                e.stopPropagation();
                                onRename?.(chat.id);
                            }}
                            className="flex items-center gap-2 font-['Cairo'] text-xs p-2 rounded-lg cursor-pointer hover:bg-white/5"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل العنوان</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(chat.id);
                            }}
                            className="flex items-center gap-2 font-['Cairo'] text-xs p-2 rounded-lg cursor-pointer text-red-400 hover:text-red-400 hover:bg-red-400/10"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف المحادثة</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
