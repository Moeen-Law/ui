import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from "react-i18next";

function ResetPasswordSuccess() {
    const { t } = useTranslation();
    return (
        
            <div
                className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
            >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <p className="text-foreground text-lg font-bold">{t("auth.passwordChanged")}</p>
                <p className="text-muted-foreground">{t("auth.passwordChangedSub")}</p>
            </div>
        
    );
}

export default ResetPasswordSuccess