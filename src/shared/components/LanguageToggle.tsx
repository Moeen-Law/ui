import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export function LanguageToggle() {
    const { i18n, t } = useTranslation();

    const currentLang = i18n.language || "ar";

    const toggleLanguage = () => {
        const nextLang = currentLang === "ar" ? "en" : "ar";
        i18n.changeLanguage(nextLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-lg hover:bg-muted"
            title={t("common.language")}
        >
            <Globe className="w-5 h-5" />
            <span className="font-['Cairo'] font-bold text-[0.9rem] uppercase">
                {currentLang === "ar" ? "EN" : "AR"}
            </span>
        </button>
    );
}
