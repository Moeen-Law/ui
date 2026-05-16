import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/features/auth/store/auth";
import { BookOpenText, Building2, LogOut, MessageCircle } from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useHandleStart } from "@/shared/hooks/useHandleStart";
import MobileMenu from "./MobileMenu";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { useTranslation } from "react-i18next";
import { MoeenLogo } from "@/shared/components/MoeenLogo";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const authenticatedNavItems = [
    {
        href: "/chat",
        icon: MessageCircle,
        titleKey: "nav.chat",
        descriptionKey: "nav.chatDescription",
    },
    {
        href: "/legal-terminologies",
        icon: BookOpenText,
        titleKey: "nav.legalTerminologies",
        descriptionKey: "nav.legalTerminologiesDescription",
    },
    {
        href: "/government-processes",
        icon: Building2,
        titleKey: "nav.governmentProcesses",
        descriptionKey: "nav.governmentProcessesDescription",
    },
];

export function Navbar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { accessToken } = useAuthStore();
    const { handleLogout: handleLogoutHook, loading } = useLogout();
    const { handleStart } = useHandleStart();
    const isAuthenticated = Boolean(accessToken);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        await handleLogoutHook();
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-background bg-opacity-95 backdrop-blur-xl border-b border-border shadow-lg"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-[1280px] mx-auto px-8 py-6 flex justify-between items-center relative group">
                    {/* Brand */}
                    <div
                        onClick={() => navigate("/")}
                        className="relative z-10 flex items-center gap-3.5 cursor-pointer transition-transform duration-250 hover:-translate-y-px"
                    >
                        <MoeenLogo size="md" />
                    </div>

                    {/* Desktop Links */}
                    <div className="relative z-10 hidden md:flex items-center gap-8">
                        <a
                            href="#features"
                            className="relative text-muted-foreground no-underline font-semibold text-base py-2 font-['Cairo'] transition-colors duration-250 hover:text-foreground"
                        >
                            {t("nav.services")}
                            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-linear-to-r from-blue-500 to-amber-400 rounded-sm transition-all duration-250 group-hover:w-full"></span>
                        </a>
                        <a
                            href="#pricing"
                            className="relative text-muted-foreground no-underline font-semibold text-base py-2 font-['Cairo'] transition-colors duration-250 hover:text-foreground"
                        >
                            {t("nav.pricing")}
                            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-linear-to-r from-blue-500 to-amber-400 rounded-sm transition-all duration-250 group-hover:w-full"></span>
                        </a>
                        <a
                            href="#about"
                            className="relative text-muted-foreground no-underline font-semibold text-base py-2 font-['Cairo'] transition-colors duration-250 hover:text-foreground"
                        >
                            {t("nav.about")}
                            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-linear-to-r from-blue-500 to-amber-400 rounded-sm transition-all duration-250 group-hover:w-full"></span>
                        </a>

                        {isAuthenticated && (
                            <NavigationMenu viewport={false} className="z-20 font-['Cairo']">
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="h-10 px-3 text-sm font-bold text-muted-foreground hover:text-foreground">
                                            {t("nav.tools")}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="z-50 min-w-80 p-2">
                                            <div className="grid gap-1">
                                                {authenticatedNavItems.map((item) => {
                                                    const Icon = item.icon;

                                                    return (
                                                        <NavigationMenuLink asChild key={item.href}>
                                                            <Link
                                                                to={item.href}
                                                                className="flex items-start gap-3 rounded-lg p-3 text-start"
                                                            >
                                                                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                                                                    <Icon className="size-4" aria-hidden="true" />
                                                                </span>
                                                                <span className="min-w-0">
                                                                    <span className="block truncate text-sm font-bold text-foreground">
                                                                        {t(item.titleKey)}
                                                                    </span>
                                                                    <span className="mt-1 block line-clamp-2 text-xs leading-5 text-muted-foreground">
                                                                        {t(item.descriptionKey)}
                                                                    </span>
                                                                </span>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    );
                                                })}
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        )}

                        <div className="flex items-center gap-4">
                            <LanguageToggle />
                            <button
                                onClick={handleStart}
                                className="relative cursor-pointer overflow-hidden bg-card text-foreground border border-border px-7 py-3 rounded-md font-bold text-[0.95rem] font-['Cairo'] tracking-tight transition-all duration-250 shadow-[0_0_20px_rgba(59,130,246,0.15)] group hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-500"
                            >
                                <span className="relative z-10 group-hover:text-background transition-colors duration-250">
                                    {isAuthenticated ? t("nav.openChat") : t("hero.startNow")}
                                </span>
                                <div className="absolute inset-0 bg-blue-500 origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-250"></div>
                            </button>

                            {isAuthenticated && (
                                <button
                                    onClick={handleLogout}
                                    disabled={loading}
                                    className="group flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed gap-2 px-4 py-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 font-['Cairo'] font-bold text-[0.9rem] transition-all duration-300 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95"
                                    title={t("nav.logoutFull")}
                                >
                                    <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    <span>{t("nav.logout")}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="relative z-10 flex md:hidden items-center gap-3">
                        <LanguageToggle />
                        {/* Mobile Burger Menu Button */}
                        <button
                            className="cursor-pointer flex flex-col justify-center items-center w-10 h-10 border border-border rounded-md bg-card z-60 transition-colors hover:border-foreground"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <div className="relative w-5 h-4 flex flex-col justify-between items-center">
                                <motion.span
                                    animate={isMobileMenuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-[2px] bg-foreground rounded-full origin-center"
                                />
                                <motion.span
                                    animate={isMobileMenuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-[2px] bg-foreground rounded-full origin-center"
                                />
                            </div>
                        </button>
                    </div>

                    {/* White/Black Bottom Line Effect */}
                    <div
                        className={`pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-[2px] bg-linear-to-r from-transparent dark:via-white via-black to-transparent opacity-0 transition-opacity duration-300 ${isScrolled ? "opacity-100" : "group-hover:opacity-100"
                            }`}
                    ></div>
                </div>
            </nav>

            {/* Mobile Side Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenu setIsMobileMenuOpen={setIsMobileMenuOpen} />
                )}
            </AnimatePresence>
        </>
    );
}
