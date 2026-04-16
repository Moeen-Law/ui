import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import VerifyEmailVerifying from "../components/VerifyEmailVerifying";
import VerifyEmailSuccess from "../components/VerifyEmailSuccess";
import VerifyEmailError from "../components/VerifyEmailError";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function VerifyEmail() {
    const { t } = useTranslation();
    const { verifyEmail, loading, error, success, token } = useVerifyEmail();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token]);

    const title = loading ? t("auth.verifying") : error ? t("auth.verificationFailed") : success ? t("auth.verificationSuccess") : t("auth.verifyEmailTitle");
    const subtitle = loading
        ? t("auth.wait")
        : error
            ? t("auth.verificationFailedSub")
            : success
                ? t("auth.verificationSuccessSub")
                : t("auth.verifyEmailSubtitle");

    return (
        <AuthLayout title={title} subtitle={subtitle}>
            {loading && <VerifyEmailVerifying />}

            {error && <VerifyEmailError message={error} />}

            {success && (
                <div className="space-y-6">
                    <VerifyEmailSuccess />
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => navigate("/login")}
                        className="w-full cursor-pointer bg-blue-500 text-white font-black rounded-xl py-4 mt-2 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group"
                    >
                        <LogIn className="size-5 transition-transform group-hover:translate-x-1" />
                        {t("auth.goLogin")}
                    </motion.button>
                </div>
            )}

            {!token && !loading && !success && !error && (
                <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">{t("auth.linkInvalidSub")}</p>
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => navigate("/signup")}
                        className="w-full cursor-pointer bg-blue-500 text-white font-black rounded-xl py-3 hover:bg-blue-600 transition-all"
                    >
                        {t("auth.goSignup")}
                    </motion.button>
                </div>
            )}
        </AuthLayout>
    );
}
