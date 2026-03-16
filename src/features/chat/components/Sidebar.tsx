import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { useChats } from "../hooks/useChats";
import { AnimatePresence } from "framer-motion";
import { useChatUIStore } from "../store/ui";
import { cn } from "@/lib/utils";
import NotFoundChats from "./NotFoundChats";
import ChatsList from "./ChatsList";
import UserCard from "./UserCard";

export default function Sidebar() {
    const navigate = useNavigate();
    const { chats } = useChats();
    const { isSidebarOpen } = useChatUIStore();
    const hasChats = chats?.data && chats.data.length > 0;

    return (
        <aside className={cn(
            "hidden md:flex flex-col w-[300px] bg-[#0a0a0a] border-l border-white/5 relative overflow-hidden transition-all duration-300 ease-in-out",
            !isSidebarOpen && "md:w-0 md:border-none"
        )}>
            <div className={cn(
                "flex flex-col h-full w-[300px] p-5 transition-all duration-300 ease-in-out",
                !isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/2 blur-3xl rounded-full" />
            
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2  cursor-pointer text-[#666] hover:text-white transition-all mb-8 group self-start"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-xs font-['Cairo'] uppercase tracking-wider">العودة للرئيسية</span>
            </button>

            <button  className="flex items-center cursor-pointer justify-center gap-3 w-full bg-white text-black rounded-xl py-3.5 px-4 font-black text-sm transition-all hover:bg-[#f0f0f0] active:scale-[0.98] mb-10 shadow-xl shadow-white/5 border border-transparent">
                <Plus className="w-4 h-4" />
                <span className="font-['Cairo']">محادثة جديدة</span>
            </button>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-[#444] text-[10px] font-black uppercase tracking-[0.2em] font-['Cairo']">المحادثات السابقة</h3>
                    {hasChats && (
                        <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] text-[#666] font-mono">
                            {chats.data.length}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5 focus:outline-none">
                    <AnimatePresence mode="popLayout">
                        {!hasChats ? (
                            <NotFoundChats />
                        ) : (
                           <ChatsList chats={chats.data} />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <UserCard />
            </div>
        </aside>
    );
}
