import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/features/auth/store/auth";
import { LogOut } from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useHandleStart } from "@/shared/hooks/useHandleStart";
import MobileMenu from "./MobileMenu";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { useTranslation } from "react-i18next";
import { MoeenLogo } from "@/shared/components/MoeenLogo";
import { adminToolItem, authenticatedToolItems } from "@/shared/constants/tools";
import { preloadRoute, preloadToolRoutes } from "@/shared/utils/preloadRoutes";
import { useMe } from "@/features/auth/hooks/useMe";
import { hasAdminRole } from "@/features/auth/helpers/roles";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function Navbar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { accessToken } = useAuthStore();
    const { handleLogout: handleLogoutHook, loading } = useLogout();
    const { handleStart } = useHandleStart();
    const isAuthenticated = Boolean(accessToken);
    const { profile } = useMe({ enabled: isAuthenticated });
    const isAdmin = hasAdminRole(profile);
    const toolItems = isAdmin
        ? [...authenticatedToolItems, adminToolItem]
        : authenticatedToolItems;

    const preloadAuthenticatedTools = () => {
        preloadToolRoutes();
        if (isAdmin) {
            preloadRoute(adminToolItem.href);
        }
    };

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
                <div className="max-w-[1280px] mx-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-6 flex justify-between items-center relative group">
                    {/* Brand */}
                    <div
                        onClick={() => navigate("/")}
                        className="relative z-10 flex min-w-0 items-center gap-3.5 cursor-pointer transition-transform duration-250 hover:-translate-y-px"
                    >
                        <MoeenLogo
                            size="md"
                            className="min-w-0"
                            textClassName="max-w-28 lg:max-w-32 xl:max-w-none"
                        />
                    </div>

                    {/* Desktop Links */}
                    <div className="relative z-10 hidden lg:flex items-center gap-4 xl:gap-8">
                        <a
                            href="#features"
                            className="relative whitespace-nowrap text-muted-foreground no-underline font-semibold text-sm xl:text-base py-2 font-sans transition-colors duration-250 hover:text-foreground"
                        >
                            {t("nav.services")}
                            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-linear-to-r from-blue-500 to-amber-400 rounded-sm transition-all duration-250 group-hover:w-full"></span>
                        </a>
                        <a
                            href="#pricing"
                            className="relative whitespace-nowrap text-muted-foreground no-underline font-semibold text-sm xl:text-base py-2 font-sans transition-colors duration-250 hover:text-foreground"
                        >
                            {t("nav.pricing")}
                            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-linear-to-r from-blue-500 to-amber-400 rounded-sm transition-all duration-250 group-hover:w-full"></span>
                        </a>
                        <a
                            href="#about"
                            className="relative whitespace-nowrap text-muted-foreground no-underline font-semibold text-sm xl:text-base py-2 font-sans transition-colors duration-250 hover:text-foreground"
                        >
                            {t("nav.about")}
                            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-linear-to-r from-blue-500 to-amber-400 rounded-sm transition-all duration-250 group-hover:w-full"></span>
                        </a>

                        {isAuthenticated && (
                            <NavigationMenu
                                viewport={false}
                                className="z-20 font-sans"
                                onMouseEnter={preloadAuthenticatedTools}
                                onFocus={preloadAuthenticatedTools}
                            >
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="h-10 px-2 text-sm font-bold text-muted-foreground hover:text-foreground xl:px-3">
                                            {t("nav.tools")}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="z-50 min-w-80 p-2">
                                            <div className="grid gap-1">
                                                {toolItems.map((item) => {
                                                    const Icon = item.icon;

                                                    return (
                                                        <NavigationMenuLink asChild key={item.href}>
                                                            <Link
                                                                to={item.href}
                                                                onMouseEnter={() => preloadRoute(item.href)}
                                                                onFocus={() => preloadRoute(item.href)}
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

                        <div className="flex shrink-0 items-center gap-2 xl:gap-4">
                            <LanguageToggle />
                            <button
                                onClick={handleStart}
                                onMouseEnter={() => preloadRoute(isAuthenticated ? "/chat" : "/login")}
                                onFocus={() => preloadRoute(isAuthenticated ? "/chat" : "/login")}
                                className="relative cursor-pointer overflow-hidden whitespace-nowrap bg-card text-foreground border border-border px-4 py-2.5 rounded-md font-bold text-sm font-sans tracking-tight transition-all duration-250 shadow-[0_0_20px_rgba(59,130,246,0.15)] group hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-500 xl:px-7 xl:py-3 xl:text-[0.95rem]"
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
                                    aria-label={t("nav.logoutFull")}
                                    className="group flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed gap-2 px-3 py-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 font-sans font-bold text-[0.9rem] transition-all duration-300 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95 xl:px-4"
                                    title={t("nav.logoutFull")}
                                >
                                    <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    <span className="hidden xl:inline">{t("nav.logout")}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="relative z-10 flex lg:hidden items-center gap-3">
                        <LanguageToggle />
                        {/* Mobile Burger Menu Button */}
                        <button
                            className="cursor-pointer flex flex-col justify-center items-center w-10 h-10 border border-border rounded-md bg-card z-60 transition-colors hover:border-foreground"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <div className="relative w-5 h-4 flex flex-col justify-between items-center">
                                <span
                                    className={`w-full h-[2px] bg-foreground rounded-full origin-center transition-transform duration-300 ${
                                        isMobileMenuOpen ? "translate-y-[7.5px] rotate-45" : ""
                                    }`}
                                />
                                <span
                                    className={`w-full h-[2px] bg-foreground rounded-full origin-center transition-transform duration-300 ${
                                        isMobileMenuOpen ? "-translate-y-[7.5px] -rotate-45" : ""
                                    }`}
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
            {isMobileMenuOpen && (
                <MobileMenu setIsMobileMenuOpen={setIsMobileMenuOpen} />
            )}
        </>
    );
}
