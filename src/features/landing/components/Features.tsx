import { features } from "../data";
import { useTranslation } from "react-i18next";

export function Features() {
    const { t } = useTranslation();
    return (
        <section id="features" className="py-24 bg-background">
            <div className="max-w-[1280px] mx-auto px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 font-['Cairo']">
                        {t("features.header")}
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl font-['Cairo']">
                        {t("features.subheader")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            style={{ animationDelay: `${index * 0.5}s` }}
                            className="animate-float will-change-transform"
                        >
                            <div className="group bg-card border border-border rounded-2xl p-10 transition-all duration-300 cursor-pointer hover:bg-muted hover:border-blue-500 hover:-translate-y-5 hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)]">
                                <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-lg p-3.5 mb-6 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-full h-full"
                                    >
                                        <path d={feature.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-extrabold text-foreground mb-4 font-['Cairo']">
                                    {t(`features.items.${feature.id}.title`)}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-[1.05rem] font-['Cairo']">
                                    {t(`features.items.${feature.id}.description`)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
