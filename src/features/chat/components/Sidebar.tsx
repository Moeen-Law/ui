import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { useChats } from "../hooks/useChats";
import ChatCard from "./ChatCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
    const navigate = useNavigate();
    const { chats } = useChats();

    const hasChats = chats?.data && chats.data.length > 0;

    return (
        <aside className="hidden md:flex flex-col w-[300px] bg-[#0a0a0a] border-l border-white/5 p-5 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/2 blur-3xl rounded-full" />
            
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 cursor-pointer text-[#666] hover:text-white transition-all mb-8 group self-start"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-xs font-['Cairo'] uppercase tracking-wider">العودة للرئيسية</span>
            </button>

            <button className="flex items-center cursor-pointer justify-center gap-3 w-full bg-white text-black rounded-xl py-3.5 px-4 font-black text-sm transition-all hover:bg-[#f0f0f0] active:scale-[0.98] mb-10 shadow-xl shadow-white/5 border border-transparent">
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
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-10 text-center px-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-center mb-4 text-[#333]">
                                    <Plus className="w-6 h-6 opacity-20" />
                                </div>
                                <p className="text-[#444] text-xs font-['Cairo'] leading-relaxed">
                                    ابدأ محادثة جديدة الآن<br />
                                    وسوف تظهر هنا
                                </p>
                            </motion.div>
                        ) : (
                            chats.data.map((chat, index) => (
                                <motion.div
                                    key={chat.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ChatCard 
                                        chat={chat} 
                                        onClick={() => {}} // Handle navigation
                                        onDelete={(id) => console.log('Delete', id)}
                                        onRename={(id) => console.log('Rename', id)}
                                    />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/2 transition-colors cursor-pointer group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white font-black text-sm shadow-inner">
                            م
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-sm text-white font-['Cairo'] group-hover:translate-x-1 transition-transform">مستخدم</span>
                        <span className="text-[10px] text-[#555] font-medium tracking-tight uppercase">Premium Account</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
