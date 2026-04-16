import { useTranslation } from "react-i18next";

export function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="py-12 bg-background border-t border-border">
            <div className="max-w-[1280px] mx-auto px-8">
                <div className="flex flex-col md:flex-row items-center gap-6 bg-blue-500/5 border border-blue-500/20 p-8 rounded-2xl">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                    </div>
                    <p className="text-muted-foreground text-center md:text-start md:ms-auto leading-relaxed font-['Cairo'] text-[1.05rem]">
                        {t("footer.disclaimer")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
