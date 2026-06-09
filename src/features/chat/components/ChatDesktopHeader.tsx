import { useChatUIStore } from '../store/ui';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useTranslation } from "react-i18next";

function ChatDesktopHeader() {
    const { t } = useTranslation();
    const { isSidebarOpen, toggleSidebar } = useChatUIStore();

  return (
      <header className="hidden md:flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-xl border-b border-border z-20">
          <div className="flex items-center gap-4">
              <button
                  onClick={toggleSidebar}
                  title={isSidebarOpen ? t("chat.ui.closeSidebar") : t("chat.ui.openSidebar")}
                  className="p-2.5 cursor-pointer hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground border border-transparent hover:border-border active:scale-95 group"
              >
                  {isSidebarOpen ? (
                      <PanelRightClose className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  ) : (
                      <PanelRightOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
              </button>
              <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                      <svg
                          className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                      >
                          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                      </svg>
                      <h1 className="text-xl font-black text-foreground font-sans tracking-tight">{t("chat.ui.appTitle")}</h1>
                  </div>
                  <div className="w-px h-4 bg-border/50" />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">AI Legal Assistant</p>
              </div>
          </div>
      </header>

  )
}

export default ChatDesktopHeader