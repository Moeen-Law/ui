import { motion } from "framer-motion";
import useAuthStore from "@/features/auth/store/auth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useHandleStart } from "@/shared/hooks/useHandleStart";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MobileMenuProps {
    setIsMobileMenuOpen: (open: boolean) => void;
}

function MobileMenu({ setIsMobileMenuOpen }: MobileMenuProps) {
    const { t } = useTranslation();
    const { accessToken } = useAuthStore();
    const { handleLogout, loading } = useLogout();
    const { handleStart } = useHandleStart();
    const isAuthenticated = Boolean(accessToken);

    const handleStartClick = () => {
        handleStart();
        setIsMobileMenuOpen(false);
    };

    const handleLogoutClick = async () => {
        await handleLogout();
        setIsMobileMenuOpen(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-background border-l border-border px-6 pt-28 pb-8 flex flex-col items-center overflow-y-auto md:hidden"
        >
            <div className="flex flex-col items-center gap-7 w-full max-w-sm">
                <div className="flex flex-col items-center gap-6">
                    <a
                        href="#features"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl cursor-pointer font-bold font-['Cairo'] text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t("nav.services")}
                    </a>
                    <a
                        href="#pricing"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl cursor-pointer font-bold font-['Cairo'] text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t("nav.pricing")}
                    </a>
                    <a
                        href="#about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl cursor-pointer font-bold font-['Cairo'] text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t("nav.about")}
                    </a>
                </div>

                <div className="flex flex-col w-full gap-4">
                    <button
                        onClick={handleStartClick}
                        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-xl font-['Cairo'] transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]"
                    >
                        {isAuthenticated ? t("nav.openChat") : t("hero.startNow")}
                    </button>

                    {isAuthenticated && (
                        <button
                            onClick={handleLogoutClick}
                            disabled={loading}
                            className="w-full flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed justify-center gap-3 border border-red-500/30 bg-red-500/5 text-red-500 py-4 rounded-xl font-bold text-xl font-['Cairo'] transition-all hover:bg-red-500 hover:text-white active:scale-[0.98]"
                        >
                            <LogOut className="size-6 shrink-0" />
                            <span>{t("nav.logoutFull")}</span>
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default MobileMenu
