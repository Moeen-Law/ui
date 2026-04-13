import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLogout } from "@/features/auth/hooks/useLogout"
import useThemeStore from "@/shared/store/theme"
import { DropdownMenu } from "radix-ui"
import { useNavigate } from "react-router-dom"
import UserCard from "./UserCard"
import { Loader2, LogOutIcon, MonitorIcon, MoonIcon, PaletteIcon, SettingsIcon, SunIcon } from "lucide-react"
import { useMe } from "@/features/auth/hooks/useMe"

export function UserMenu() {
     const navigate = useNavigate()
     const { handleLogout, loading } = useLogout()
     const { mode, setMode } = useThemeStore()
     const { profile } = useMe();

    return (
        <div className="relative z-10 mt-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <UserCard name={profile?.name} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44" align="start" side="top">
                    <DropdownMenuGroup>
                        {/* ── المظهر (Theme) ── */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <PaletteIcon className="size-4 shrink-0" />
                                المظهر
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup value={mode} onValueChange={(v) => setMode(v as "system" | "dark" | "light")}>
                                        <DropdownMenuRadioItem value="system">
                                            <MonitorIcon className="size-4 shrink-0" />
                                            النظام
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="dark">
                                            <MoonIcon className="size-4 shrink-0" />
                                            داكن
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="light">
                                            <SunIcon className="size-4 shrink-0" />
                                            فاتح
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        {/* ── الإعدادات (Settings) ── */}
                        <DropdownMenuItem onClick={() => navigate("/settings")}>
                            <SettingsIcon className="size-4 shrink-0" />
                            الإعدادات
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        {/* ── تسجيل الخروج (Logout) ── */}
                        <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()} onClick={handleLogout} disabled={loading}>
                            <LogOutIcon className="size-4 shrink-0" />
                            تسجيل الخروج
                            {loading && <Loader2 className="size-3 shrink-0 animate-spin" />}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
