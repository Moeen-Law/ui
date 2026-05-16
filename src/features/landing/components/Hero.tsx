import { useHandleStart } from "@/shared/hooks/useHandleStart";
import { useTranslation } from "react-i18next";


const cards = [
        {
            id: 1,
            titleKey: "docAnalysis",
            delay: 0,
            position: "top-[15%] right-[5%]",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        strokeWidth="2"
                    />
                </svg>
            ),
        },
        {
            id: 2,
            titleKey: "contractGen",
            delay: 0,
            position: "top-[15%] right-[55%]",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        strokeWidth="2"
                    />
                </svg>
            ),
        },
        {
            id: 3,
            titleKey: "instantConsult",
            delay: 2,
            position: "top-[42%] right-[0%]",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        strokeWidth="2"
                    />
                </svg>
            ),
        },
        {
            id: 4,
            titleKey: "termExp",
            delay: 2,
            position: "top-[42%] right-[60%]",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path
                        d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01"
                        strokeWidth="2"
                    />
                </svg>
            ),
        },
        {
            id: 5,
            titleKey: "legalConsult",
            delay: 4,
            position: "top-[69%] right-[5%]",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        strokeWidth="2"
                    />
                </svg>
            ),
        },
        {
            id: 6,
            titleKey: "caseTrack",
            delay: 4,
            position: "top-[69%] right-[55%]",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        strokeWidth="2"
                    />
                </svg>
            ),
        },
    ];

export function Hero() {
    const { t } = useTranslation();
    const { handleStart } = useHandleStart();

    return (
        <section className="min-h-screen flex items-center pt-20 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]">
            {/* Background patterns */}
            <div className="absolute inset-0 pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.05)_50%,transparent_100%),radial-gradient(circle_at_20%_50%,rgba(251,191,36,0.05),transparent_40%)]" />

            <div className="max-w-[1280px] mx-auto px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                    {/* Content */}
                    <div className="max-w-[800px] lg:max-w-[600px] mt-10 lg:mt-0 text-center lg:text-end flex flex-col items-center lg:items-start mx-auto lg:mx-0">
                        <h1 className="text-[2.5rem] md:text-5xl lg:text-[4rem] font-black leading-[1.3] mb-6 pt-2 font-['Cairo'] text-foreground">
                            {t("hero.titleMain")}
                            <span className="block bg-linear-to-br from-blue-500 to-amber-400 bg-clip-text text-transparent pb-3 pt-1">
                                {t("hero.titleSub")}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl lg:text-[1.25rem] text-muted-foreground leading-[1.8] mb-10 max-w-2xl lg:max-w-xl">
                            {t("hero.subtitle")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button
                                onClick={handleStart}
                                className="flex items-center cursor-pointer justify-center gap-2 bg-blue-500 hover:bg-blue-400 hover:-translate-y-0.5 text-white border-0 py-4 px-8 rounded-xl font-bold text-lg font-['Cairo'] transition-all shadow-[0_10px_30px_rgba(59,130,246,0.4)]"
                            >
                                {t("hero.startNow")}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    className="w-5 h-5 ms-2"
                                >
                                    <path
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            <button className="bg-transparent cursor-pointer hover:bg-blue-500/10 hover:border-blue-500 text-foreground border-2 border-border py-4 px-8 rounded-xl font-bold text-lg font-['Cairo'] transition-all flex items-center justify-center">
                                {t("hero.discoverMore")}
                            </button>
                        </div>
                    </div>

                    {/* Visual Elements */}
                    <div className="relative h-[400px] md:h-[500px] hidden lg:block">
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                className={`absolute flex w-fit animate-float flex-row-reverse items-center gap-4 rounded-[14px] border border-border bg-card p-5 shadow-2xl transition-transform duration-300 hover:z-50 hover:scale-105 ${card.position}`}
                                style={{
                                    animationDelay: `${card.delay}s`,
                                    willChange: "transform",
                                    backfaceVisibility: "hidden"
                                }}
                            >
                                <div className="w-8 h-8 text-blue-500 shrink-0">
                                    {card.icon}
                                </div>
                                <span className="font-semibold text-[0.95rem] whitespace-nowrap text-foreground">
                                    {t(`hero.${card.titleKey}`)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
