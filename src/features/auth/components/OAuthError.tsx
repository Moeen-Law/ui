import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";

function OAuthError() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-8 text-center"
        >
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-black text-foreground">{t("auth.oauthHeader")}</h2>
                <p className="text-muted-foreground max-w-xs mx-auto">
                    {t("auth.oauthError")}
                </p>
            </div>
            <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 text-white cursor-pointer px-8 py-4 rounded-xl font-black hover:bg-blue-600 transition-all"
            >
                {t("auth.backToLogin")}
            </button>
        </motion.div>
    );
}

export default OAuthError