import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export function InteractiveDemo() {
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.5 });

    const fullText = "تحليل العقد:\n\n• مدة العقد: سنة واحدة قابلة للتجديد\n• قيمة الإيجار: 3000 جنيه شهرياً\n• التأمين: شهرين مقدماً\n• المسؤول عن الصيانة: المالك";

    useEffect(() => {
        if (isInView) {
            const timer = setTimeout(() => {
                setIsTyping(false);
                let currentText = "";
                let index = 0;
                const interval = setInterval(() => {
                    if (index < fullText.length) {
                        currentText += fullText[index];
                        setDisplayText(currentText);
                        index++;
                    } else {
                        clearInterval(interval);
                    }
                }, 30);
            }, 2000); // 2 seconds of jumping dots
            return () => clearTimeout(timer);
        }
    }, [isInView]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <section className="bg-muted/50 py-24 px-8 overflow-hidden">
            <div className="max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
                            {/* Window Header */}
                            <div className="bg-muted p-4 border-b border-border flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
                                <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                                <span className="w-3 h-3 rounded-full bg-[#10b981]" />
                            </div>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="p-8 min-h-[400px] flex flex-col gap-6"
                            >
                                {/* User Message */}
                                <motion.div variants={itemVariants} className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-sm shrink-0">
                                        م
                                    </div>
                                    <div className="bg-muted border border-border rounded-xl p-4 text-foreground text-[0.95rem] max-w-[80%]">
                                        حلل عقد الإيجار هذا
                                    </div>
                                </motion.div>

                                {/* File Upload */}
                                <motion.div variants={itemVariants} className="flex items-center gap-3 bg-background border border-border rounded-xl p-4 mr-12 w-fit">
                                    <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" />
                                    </svg>
                                    <span className="text-muted-foreground text-sm font-semibold">عقد_إيجار.pdf</span>
                                </motion.div>

                                {/* AI Response with Typewriter */}
                                <motion.div variants={itemVariants} className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                        AI
                                    </div>
                                    <div className="bg-muted border border-border rounded-xl p-4 text-foreground text-[0.95rem] max-w-[80%] whitespace-pre-line min-h-[60px]">
                                        {isTyping ? (
                                            <div className="flex gap-1.5 py-2">
                                                <motion.span
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                                                    className="w-2 h-2 rounded-full bg-blue-500"
                                                />
                                                <motion.span
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                                    className="w-2 h-2 rounded-full bg-blue-500"
                                                />
                                                <motion.span
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                                    className="w-2 h-2 rounded-full bg-blue-500"
                                                />
                                            </div>
                                        ) : (
                                            displayText
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-right"
                    >
                        <span className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">
                            المساعد
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-6 font-['Cairo']">
                            مصمم خصيصاً لخبرتك القانونية
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-[1.15rem] leading-relaxed mb-8 max-w-xl font-['Cairo']">
                            وفّر المهام المعقدة بلغة طبيعية لمساعدك الشخصي المتخصص في القانون المصري.
                            يفهم مُعين السياق القانوني ويقدم إجابات دقيقة ومفصلة.
                        </p>
                        <button className="group inline-flex items-center gap-2 text-blue-500 font-bold text-lg cursor-pointer transition-all hover:gap-3 hover:text-blue-400 font-['Cairo']">
                            استكشف المساعد
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-[-4px] rtl:group-hover:translate-x-[-4px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
