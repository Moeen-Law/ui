import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, X, History } from "lucide-react";

export default function HistoryDrawer() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);


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
        className="p-2 text-[#a0a0a0] hover:text-white transition-colors"
        aria-label="Open History"
      >
        <History className="w-6 h-6 cursor-pointer" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-100 backdrop-blur-sm md:hidden"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 w-[300px] bg-[#111111] border-l border-[#2a2a2a] z-101 flex flex-col p-5 text-white md:hidden font-['Cairo']"
            >
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/");
                  }}
                  className="flex items-center gap-2 cursor-pointer text-[#a0a0a0] hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-semibold text-sm">الرئيسية</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-[#252525] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#a0a0a0] cursor-pointer" />
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center cursor-pointer justify-center gap-2 w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg py-3 px-4 font-bold text-sm transition-all hover:bg-[#252525] hover:border-white mb-8"
              >
                <Plus className="w-4 h-4" />
                <span>محادثة جديدة</span>
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <h3 className="text-[#707070] text-xs font-bold uppercase tracking-wider mb-4">المحادثات السابقة</h3>
                <div className="space-y-2 text-[#a0a0a0] text-sm italic">
                  لا توجد محادثات سابقة بعد.
                </div>
              </div>

              <div className="mt-auto pt-5 border-t border-[#2a2a2a]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-[#0a0a0a] font-bold text-lg">
                    م
                  </div>
                  <span className="font-bold text-[0.95rem]">مستخدم</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}