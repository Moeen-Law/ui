import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History } from "lucide-react";
import { useTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";
import { cn } from "@/lib/utils";

export default function HistoryDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

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
        className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer active:scale-95 outline-none"
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
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "absolute bottom-0 top-0 flex w-[300px] flex-col overflow-hidden border-e border-border bg-background p-5 font-sans text-foreground",
                isRtl ? "right-0" : "left-0"
              )}
            >
                <SidebarContent onClose={() => setIsOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
