import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, X, History } from "lucide-react";
import { useChats } from "../hooks/useChats";
import ChatCard from "./ChatCard";

export default function HistoryDrawer() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { chats } = useChats();

  const hasChats = chats?.data && chats.data.length > 0;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleResize = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-[#666] hover:text-white transition-colors cursor-pointer active:scale-95"
        aria-label="Open History"
      >
        <History className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 bottom-0 right-0 w-[300px] bg-[#0a0a0a] border-l border-white/5 flex flex-col p-5 text-white font-['Cairo'] overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/2 blur-3xl rounded-full" />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/");
                  }}
                  className="flex items-center gap-2 cursor-pointer text-[#666] hover:text-white transition-all group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-bold text-xs uppercase tracking-wider">الرئيسية</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all active:scale-90"
                >
                  <X className="w-4 h-4 text-[#a0a0a0] cursor-pointer" />
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center cursor-pointer justify-center gap-3 w-full bg-white text-black rounded-xl py-3.5 px-4 font-black text-sm transition-all hover:bg-[#f0f0f0] active:scale-[0.98] mb-10 shadow-xl shadow-white/5 relative z-10"
              >
                <Plus className="w-4 h-4" />
                <span>محادثة جديدة</span>
              </button>

              <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-[#444] text-[10px] font-black uppercase tracking-[0.2em]">المحادثات السابقة</h3>
                    {hasChats && (
                        <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] text-[#666] font-mono">
                            {chats.data.length}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
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
                        <p className="text-[#444] text-xs leading-relaxed">
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
                            onClick={() => setIsOpen(false)}
                            onDelete={(id) => console.log('Delete', id)}
                            onRename={(id) => console.log('Rename', id)}
                          />
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/2 transition-colors cursor-pointer group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white font-black text-sm shadow-inner">
                      م
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-sm text-white group-hover:translate-x-1 transition-transform">مستخدم</span>
                    <span className="text-[10px] text-[#555] font-medium tracking-tight uppercase">Premium Account</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}