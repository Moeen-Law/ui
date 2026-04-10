import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, X } from "lucide-react";
import { useChats } from "../hooks/useChats";
import { AnimatePresence } from "framer-motion";
import NotFoundChats from "./NotFoundChats";
import ChatsList from "./ChatsList";
import UserCard from "./UserCard";
import { useMe } from "@/features/auth/hooks/useMe";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface SidebarContentProps {
    onClose?: () => void;
}

export default function SidebarContent({ onClose }: SidebarContentProps) {
    const navigate = useNavigate();
    const { chats, meta, hasNextPage, fetchNextPage, isFetchingNextPage } = useChats();
    const hasChats = chats && chats.length > 0;
    const { profile } = useMe();

    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


    return (
        <div className="flex flex-col h-full relative">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/2 blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <button
                    onClick={() => {
                        onClose?.();
                        navigate("/");
                    }}
                    className="flex items-center gap-2 cursor-pointer text-[#666] hover:text-white transition-all group self-start"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-xs font-['Cairo'] uppercase tracking-wider">العودة للرئيسية</span>
                </button>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all active:scale-90"
                    >
                        <X className="w-4 h-4 text-[#a0a0a0] cursor-pointer" />
                    </button>
                )}
            </div>

            <button
                onClick={() => navigate("/chat")}
                className="flex items-center cursor-pointer justify-center gap-3 w-full bg-white text-black rounded-xl py-3.5 px-4 font-black text-sm transition-all hover:bg-[#f0f0f0] active:scale-[0.98] mb-10 shadow-xl shadow-white/5 border border-transparent relative z-10"
            >
                <Plus className="w-4 h-4" />
                <span className="font-['Cairo']">محادثة جديدة</span>
            </button>

            <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-[#444] text-[10px] font-black uppercase tracking-[0.2em] font-['Cairo']">المحادثات السابقة</h3>
                    {hasChats && (
                        <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] text-[#666] font-mono">
                            {meta?.total}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5 focus:outline-none">
                    <AnimatePresence mode="popLayout">
                        {!hasChats ? (
                            <NotFoundChats />
                        ) : (
                            <>
                                <ChatsList chats={chats} />
                                {hasNextPage && (
                                    <div 
                                        ref={loadMoreRef} 
                                        className="py-4 flex justify-center items-center"
                                    >
                                        {isFetchingNextPage ? (
                                            <Loader2 className="w-4 h-4 text-[#444] animate-spin" />
                                        ) : (
                                            <div className="h-4" /> // Trigger area
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                <UserCard name={profile?.name} />
            </div>
        </div>
    );
}
