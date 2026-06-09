import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MoeenLogo } from "@/shared/components/MoeenLogo";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
            {/* Hero-like background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.06),transparent_50%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-5xl w-full bg-card/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[650px] relative z-10"
            >
                {/* Form Side */}
                <div className="flex-1 p-8 md:p-14 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-end">
                        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3">{title}</h1>
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{subtitle}</p>
                    </div>
                    {children}
                </div>

                {/* Info Side (Logo/Image) */}
                <div className="hidden md:flex flex-1 bg-muted border-s border-border p-12 flex-col items-center justify-center text-center relative overflow-hidden">
                    {/* Decorative Circles */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-foreground/5 rounded-full pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-foreground/10 rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* MUEEN Logo from Navbar */}
                        <div className="mb-8 relative">
                            <motion.div
                                animate={{ rotate: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            >
                                <MoeenLogo showText={false} size="lg" iconClassName="drop-shadow-[0_4px_12px_rgba(251,191,36,0.5)]" />
                            </motion.div>
                            <div className="absolute -inset-4 bg-amber-400/10 blur-2xl rounded-full -z-10" />
                        </div>

                        <h2 className="text-5xl font-black mb-6 tracking-tight">
                            <span className="bg-linear-to-l from-blue-500 via-foreground to-amber-400 bg-clip-text text-transparent animate-gradient-x">
                                {t("nav.logo")}
                            </span>
                        </h2>

                        <p className="text-muted-foreground text-lg leading-relaxed max-w-sm font-medium">
                            {t("hero.titleMain")}. <br />
                            <span className="text-foreground/80">{t("hero.subtitle").split('. ')[0]}.</span>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
