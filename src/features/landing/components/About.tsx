import { motion } from "framer-motion";

export function About() {
    const stats = [
        { number: "10,000+", label: "مستخدم نشط" },
        { number: "50,000+", label: "استشارة قانونية" },
        { number: "98%", label: "نسبة الرضا" },
    ];

    return (
        <section id="about" className="py-24 bg-[#0a0a0a] overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-8">
                <div className="max-w-[900px] mx-auto text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-white mb-8 font-['Cairo']"
                    >
                        لماذا مُعين؟
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#a0a0a0] text-lg md:text-xl leading-relaxed font-['Cairo']"
                    >
                        مُعين هو أول مساعد قانوني ذكي متخصص في القانون المصري. نستخدم أحدث تقنيات الذكاء الاصطناعي
                        لتقديم استشارات قانونية دقيقة وسريعة، مما يوفر عليك الوقت والجهد والتكلفة.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 100 }}
                            className="text-center group"
                        >
                            <div className="text-5xl md:text-6xl font-black text-blue-500 mb-4 font-['Cairo'] group-hover:scale-110 transition-transform duration-300">
                                {stat.number}
                            </div>
                            <div className="text-[#a0a0a0] text-xl font-bold font-['Cairo']">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
