import { useNavigate } from "react-router-dom";
import { ChevronLeft, LogOutIcon, MonitorIcon, MoonIcon, PaletteIcon, Plus, ShieldCheck, Sparkles, SunIcon, Wrench, X } from "lucide-react";
import { useChats } from "../hooks/useChats";
import { AnimatePresence } from "framer-motion";
import NotFoundChats from "./NotFoundChats";
import ChatsList from "./ChatsList";
import UserCard from "./UserCard";
import { useMe } from "@/features/auth/hooks/useMe";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/hooks/useLogout";
import useThemeStore from "@/shared/store/theme";
import { useTranslation } from "react-i18next";
import ChatSearchDialog from "./ChatSearchDialog";
import UserSessionsDialog from "./UserSessionsDialog";
import ToolsDialog from "@/shared/components/ToolsDialog";

interface SidebarContentProps {
    onClose?: () => void;
}

export default function SidebarContent({ onClose }: SidebarContentProps) {
    const { t } = useTranslation();
    const { chats, meta, hasNextPage, fetchNextPage, isFetchingNextPage } = useChats();
    const { profile } = useMe();
    const { handleLogout, loading } = useLogout();
    const { mode, setMode } = useThemeStore();
    const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false);
    
    const navigate = useNavigate();
    const hasChats = chats && chats.length > 0;

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
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-foreground/5 blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <button
                    onClick={() => {
                        onClose?.();
                        navigate("/");
                    }}
                    className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-all group self-start"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-xs font-sans uppercase tracking-wider">{t("chat.ui.backToHome")}</span>
                </button>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/70 border border-border rounded-xl transition-all active:scale-90"
                    >
                        <X className="w-4 h-4 text-muted-foreground cursor-pointer" />
                    </button>
                )}
            </div>

            <button
                onClick={() => {
                    onClose?.();
                    navigate("/chat");
                }}
                className="flex items-center cursor-pointer justify-center gap-3 w-full bg-blue-500 text-white rounded-xl py-3.5 px-4 font-black text-sm transition-all hover:bg-blue-600 active:scale-[0.98] mb-3 shadow-xl shadow-blue-500/10 border border-transparent relative z-10"
            >
                <Plus className="w-4 h-4" />
                <span className="font-sans">{t("chat.ui.newChat")}</span>
            </button>

            <div className="relative z-10 mb-3">
                <ToolsDialog
                    onToolSelect={onClose}
                    trigger={
                        <button
                            type="button"
                            className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-blue-500/15 bg-blue-500/5 px-4 text-sm font-black text-blue-500 shadow-md shadow-blue-500/5 transition-all hover:border-blue-500/35 hover:bg-blue-500/10 active:scale-[0.98]"
                            aria-label={t("nav.openTools")}
                        >
                            <Wrench className="size-4 shrink-0 text-amber-400" />
                            <span className="min-w-0 truncate font-sans">{t("nav.tools")}</span>
                        </button>
                    }
                />
            </div>

            <div className="relative z-10">
                <ChatSearchDialog />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] font-sans">{t("chat.ui.pastChats")}</h3>
                    {hasChats && (
                        <div className="px-2 py-0.5 rounded-full bg-muted/50 border border-border text-[9px] text-muted-foreground font-mono">
                            {meta?.total}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5 focus:outline-none">
                    <AnimatePresence mode="popLayout">
                        {!hasChats ? (
                            <NotFoundChats key="not-found-chats" />
                        ) : (
                            <motion.div key="chats-list-container">
                                <ChatsList chats={chats} />
                                {hasNextPage && (
                                    <div
                                        ref={loadMoreRef}
                                        className="py-4 flex justify-center items-center"
                                    >
                                        {isFetchingNextPage ? (
                                            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                                        ) : (
                                            <div className="h-4" /> // Trigger area
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <UserCard name={profile?.name ?? ""} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-44" align="start" side="top">
                        <DropdownMenuGroup>
                            {/* ── المظهر (Theme) ── */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <PaletteIcon className="size-4 shrink-0" />
                                    {t("chat.ui.theme")}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuRadioGroup value={mode} onValueChange={(v) => setMode(v as "system" | "dark" | "light")}>
                                            <DropdownMenuRadioItem value="system">
                                                <MonitorIcon className="size-4 shrink-0" />
                                                {t("chat.ui.system")}
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="dark">
                                                <MoonIcon className="size-4 shrink-0" />
                                                {t("chat.ui.dark")}
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="light">
                                                <SunIcon className="size-4 shrink-0" />
                                                {t("chat.ui.light")}
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>

                            {/* ── الإعدادات (Settings) ── */}
                            <DropdownMenuItem onClick={() => setSessionsDialogOpen(true)}>
                                <ShieldCheck className="size-4 shrink-0" />
                                {t("auth.sessions.menuLabel")}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => {
                                    onClose?.();
                                    navigate("/upgrade");
                                }}
                            >
                                <Sparkles className="size-4 shrink-0" />
                                {t("chat.ui.upgrade")}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            {/* ── تسجيل الخروج (Logout) ── */}
                            <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()} onClick={handleLogout} disabled={loading}>
                                <LogOutIcon className="size-4 shrink-0" />
                                {t("chat.ui.logout")}
                                {loading && <Loader2 className="size-3 shrink-0 animate-spin" />}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <UserSessionsDialog
                    open={sessionsDialogOpen}
                    onOpenChange={setSessionsDialogOpen}
                />
            </div>
        </div>
    );
}
