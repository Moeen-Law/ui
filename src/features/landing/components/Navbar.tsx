import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/features/auth/store/auth";
import { LogOut } from "lucide-react";

export function Navbar() {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { accessToken, removeAccessToken } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        removeAccessToken();
        navigate("/");
        setIsMobileMenuOpen(false);
    };

    const handleStart = () => {
        if (accessToken) {
            navigate("/chat");
        } else {
            navigate("/login");
        }
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-[#0a0a0a] bg-opacity-95 backdrop-blur-xl border-b border-[#2a2a2a] shadow-lg"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-[1280px] mx-auto px-8 py-6 flex justify-between items-center relative group">
                    {/* Brand */}
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3.5 cursor-pointer transition-transform duration-250 hover:-translate-y-px"
                    >
                        <svg
                            className="w-9 h-9 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)] transition-transform duration-250 hover:-rotate-6 hover:scale-105"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                        </svg>
                        <span className="text-[1.75rem] font-black text-white font-['Cairo'] tracking-tight">
                            مُعين
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-10">
                        <a
                            href="#features"
                            className="relative text-[#a0a0a0] no-underline font-semibold text-base py-2 font-['Cairo'] transition-colors duration-250 hover:text-white"
                        >
                            الخدمات
                            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-linear-to-r from-blue-500 to-amber-400 rounded-sm transition-all duration-250 group-hover:w-full"></span>
                        </a>
                        <a
                            href="#pricing"
                            className="relative text-[#a0a0a0] no-underline font-semibold text-base py-2 font-['Cairo'] transition-colors duration-250 hover:text-white"
                        >
                            الأسعار
                            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-linear-to-r from-blue-500 to-amber-400 rounded-sm transition-all duration-250 group-hover:w-full"></span>
                        </a>
                        <a
                            href="#about"
                            className="relative text-[#a0a0a0] no-underline font-semibold text-base py-2 font-['Cairo'] transition-colors duration-250 hover:text-white"
                        >
                            من نحن
                            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-linear-to-r from-blue-500 to-amber-400 rounded-sm transition-all duration-250 group-hover:w-full"></span>
                        </a>

                        <div className="flex items-center gap-4 ">
                            <button
                                onClick={handleStart}
                                className="relative cursor-pointer overflow-hidden bg-[#0a0a0a] text-white border border-[#3a3a3a] px-7 py-3 rounded-md font-bold text-[0.95rem] font-['Cairo'] tracking-tight transition-all duration-250 shadow-[0_0_20px_rgba(59,130,246,0.15)] group hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,255,255,0.3),0_0_60px_rgba(59,130,246,0.2)] hover:border-white"
                            >
                                <span className="relative z-10 group-hover:text-[#0a0a0a] transition-colors duration-250">
                                    ابدأ الآن
                                </span>
                                <div className="absolute inset-0 bg-white origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-250"></div>
                            </button>

                            {accessToken && (
                                <button
                                    onClick={handleLogout}
                                    className="group flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 font-['Cairo'] font-bold text-[0.9rem] transition-all duration-300 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95"
                                    title="تسجيل الخروج"
                                >
                                    <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    <span>خروج</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Burger Menu Button */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 border border-[#3a3a3a] rounded-md bg-[#111111] z-60 transition-colors hover:border-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <div className="relative w-5 h-4 flex flex-col justify-between items-center">
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-[2px] bg-white rounded-full origin-center"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-[2px] bg-white rounded-full origin-center"
                            />
                        </div>
                    </button>

                    {/* White Bottom Line Effect */}
                    <div
                        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-300 ${isScrolled ? "opacity-100" : "group-hover:opacity-100"
                            }`}
                    ></div>
                </div>
            </nav>

            {/* Mobile Side Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-40 bg-[#0a0a0a] border-l border-[#2a2a2a] px-8 pt-32 pb-8 flex flex-col items-center md:hidden"
                    >
                        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl cursor-pointer font-bold font-['Cairo'] text-[#a0a0a0] hover:text-white transition-colors"
                            >
                                الخدمات
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl cursor-pointer font-bold font-['Cairo'] text-[#a0a0a0] hover:text-white transition-colors"
                            >
                                الأسعار
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl cursor-pointer font-bold font-['Cairo'] text-[#a0a0a0] hover:text-white transition-colors"
                            >
                                من نحن
                            </button>

                            <div className="flex flex-col w-full gap-4 mt-8">
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate("/chat");
                                    }}
                                    className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-xl font-['Cairo'] transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]"
                                >
                                    ابدأ الآن
                                </button>

                                {accessToken && (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-3 border border-red-500/30 bg-red-500/5 text-red-500 py-4 rounded-xl font-bold text-xl font-['Cairo'] transition-all hover:bg-red-500 hover:text-white active:scale-[0.98]"
                                    >
                                        <LogOut className="w-6 h-6" />
                                        <span>تسجيل الخروج</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
