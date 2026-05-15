import { features } from "../data";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/features/auth/store/auth";
import { cn } from "@/lib/utils";

const featureRoutes: Partial<Record<string, string>> = {
    chat: "/chat",
    explanation: "/legal-terminologies",
    "government-processes": "/government-processes",
};

export function Features() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { accessToken } = useAuthStore();

    const handleFeatureClick = (featureId: string) => {
        const route = featureRoutes[featureId];
        if (!route) return;
        navigate(accessToken ? route : "/login");
    };

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
                    {features.map((feature, index) => {
                        const isImplemented = Boolean(featureRoutes[feature.id]);

                        return (
                            <div
                                key={feature.id}
                                style={{ animationDelay: `${index * 0.5}s` }}
                                className="animate-float will-change-transform"
                            >
                                <button
                                    type="button"
                                    disabled={!isImplemented}
                                    onClick={() => handleFeatureClick(feature.id)}
                                    className={cn(
                                        "group h-full w-full rounded-2xl border border-border bg-card p-10 text-start transition-all duration-300",
                                        isImplemented
                                            ? "cursor-pointer hover:-translate-y-5 hover:border-blue-500 hover:bg-muted hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)]"
                                            : "cursor-default"
                                    )}
                                >
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
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
