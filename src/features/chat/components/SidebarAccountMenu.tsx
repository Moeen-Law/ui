import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOutIcon, MonitorIcon, MoonIcon, PaletteIcon, ShieldCheck, Sparkles, SunIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMe } from "@/features/auth/hooks/useMe";
import { useLogout } from "@/features/auth/hooks/useLogout";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal,
    DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub,
    DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useThemeStore from "@/shared/store/theme";
import UserCard from "./UserCard";
import UserSessionsDialog from "./UserSessionsDialog";

export default function SidebarAccountMenu({ onClose }: { onClose?: () => void }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { profile } = useMe();
    const { handleLogout, loading } = useLogout();
    const { mode, setMode } = useThemeStore();
    const [sessionsOpen, setSessionsOpen] = useState(false);
    return (
        <div className="relative z-10 mt-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild><UserCard name={profile?.name ?? ""} /></DropdownMenuTrigger>
                <DropdownMenuContent className="w-44" align="start" side="top">
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger><PaletteIcon className="size-4 shrink-0" />{t("chat.ui.theme")}</DropdownMenuSubTrigger>
                            <DropdownMenuPortal><DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={mode} onValueChange={(value) => setMode(value as "system" | "dark" | "light")}>
                                    <DropdownMenuRadioItem value="system"><MonitorIcon className="size-4 shrink-0" />{t("chat.ui.system")}</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark"><MoonIcon className="size-4 shrink-0" />{t("chat.ui.dark")}</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="light"><SunIcon className="size-4 shrink-0" />{t("chat.ui.light")}</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent></DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={() => setSessionsOpen(true)}><ShieldCheck className="size-4 shrink-0" />{t("auth.sessions.menuLabel")}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { onClose?.(); navigate("/upgrade"); }}><Sparkles className="size-4 shrink-0" />{t("chat.ui.upgrade")}</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem variant="destructive" onSelect={(event) => event.preventDefault()} onClick={handleLogout} disabled={loading}>
                            <LogOutIcon className="size-4 shrink-0" />{t("chat.ui.logout")}{loading && <Loader2 className="size-3 shrink-0 animate-spin" />}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <UserSessionsDialog open={sessionsOpen} onOpenChange={setSessionsOpen} />
        </div>
    );
}
