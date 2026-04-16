import { XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";

interface VerifyEmailErrorProps {
    message?: string | null;
}

function VerifyEmailError({ message }: VerifyEmailErrorProps) {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
        >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <p className="text-foreground text-lg font-bold">{t("auth.verificationFailed")}</p>
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-medium">{message || t("auth.verificationFailedSub")}</p>
            </div>
            <p className="text-muted-foreground text-sm">
                {t("auth.linkInvalidSub")}
            </p>
        </motion.div>
    );
}

export default VerifyEmailError;
