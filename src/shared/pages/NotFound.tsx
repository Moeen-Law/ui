import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ArrowRight } from "lucide-react";

const NotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden font-[var(--font-family,Cairo)]">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_60%)]" />
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'radial-gradient(#3a3a3a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Glowing Aura for 404 */}
                    <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />

                    <div className="flex gap-4 md:gap-8 mb-4 relative z-10">
                        {["4", "0", "4"].map((char, i) => (
                            <motion.span
                                key={i}
                                animate={{
                                    y: [0, -20, 0],
                                    rotateY: [0, 360, 0]
                                }}
                                transition={{
                                    duration: i === 1 ? 6 : 8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.2
                                }}
                                className="text-[10rem] md:text-[15rem] font-black leading-none select-none drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                            >
                                <span className="bg-linear-to-b from-blue-500 via-white to-amber-400 bg-clip-text text-transparent">
                                    {char}
                                </span>
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="space-y-8 max-w-2xl"
                >
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-6xl  font-black text-foreground tracking-tight">
                            {t("notfound.title_1")}<span className="text-amber-400">{t("notfound.titleHighlight")}</span>{t("notfound.title_2")}
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl  font-medium leading-relaxed max-w-lg mx-auto">
                            {t("notfound.subtitle")}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <motion.button
                            whileHover={{ scale: 1.05, translateY: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/")}
                            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-3 bg-foreground text-background px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-lg group"
                        >
                            <Home className="w-6 h-6" />
                            {t("notfound.home")}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, translateY: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-3 bg-transparent text-foreground border-2 border-border hover:border-blue-500/50 hover:bg-blue-500/5 px-12 py-5 rounded-2xl font-black text-xl transition-all"
                        >
                            {t("notfound.back")}
                            <ArrowRight className="w-6 h-6 rotate-180 rtl:rotate-0 transition-transform group-hover:-translate-x-2 rtl:group-hover:translate-x-2" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Floating Elements (similar to Hero) */}
            <motion.div
                animate={{
                    y: [0, -30, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-[10%] w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm hidden lg:block"
            />
            <motion.div
                animate={{
                    y: [0, 30, 0],
                    rotate: [0, -5, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-[10%] w-20 h-20 bg-amber-400/10 border border-amber-400/20 rounded-3xl backdrop-blur-sm hidden lg:block"
            />
        </div>
    );
};

export default NotFound;
