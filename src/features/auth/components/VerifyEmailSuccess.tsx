import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";

function VerifyEmailSuccess() {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
        >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <p className="text-foreground text-lg font-bold">{t("auth.verificationSuccess")}</p>
            <p className="text-muted-foreground">{t("auth.verificationSuccessSub")}</p>
        </motion.div>
    );
}

export default VerifyEmailSuccess;
