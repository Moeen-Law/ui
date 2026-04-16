import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { getForgotPasswordSchema } from "../schema";
import type { ForgotPasswordValues } from "../types";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { formatTime } from "../helpers";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const schema = useMemo(() => getForgotPasswordSchema(t), [t]);

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(schema),
    });

    const { forgotPassword, loading, cooldown } = useForgotPassword();

    const onSubmit = async (data: ForgotPasswordValues) => {
        if (cooldown > 0) return;
        await forgotPassword(data.email);
    };

    const isCooldownActive = cooldown > 0;

    return (
        <AuthLayout
            title={t("auth.forgotPasswordTitle")}
            subtitle={t("auth.forgotPasswordSubtitle")}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2 ms-1">{t("auth.email")}</label>
                    <div className="relative group">
                        <input
                            {...register("email")}
                            disabled={isCooldownActive}
                            className={`w-full placeholder:opacity-60 bg-muted border border-border rounded-xl px-4 py-3 pe-11 text-foreground focus:outline-none focus:border-blue-500 transition-all ${isCooldownActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="m@example.com"
                            dir="ltr"
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1 ms-1">{errors.email.message}</p>}
                </div>

                <motion.button
                    whileHover={!isCooldownActive && !loading ? { scale: 1.01 } : {}}
                    whileTap={!isCooldownActive && !loading ? { scale: 0.99 } : {}}
                    disabled={loading || isCooldownActive}
                    type="submit"
                    className="w-full cursor-pointer disabled:cursor-not-allowed bg-blue-500 text-white font-black rounded-xl py-4 mt-2 hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : isCooldownActive ? (
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{t("auth.wait")} {formatTime(cooldown)}</span>
                        </div>
                    ) : (
                        <>
                            {t("auth.sendResetLink")}
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180" />
                        </>
                    )}
                </motion.button>

                {isCooldownActive && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-center text-amber-500 font-medium"
                    >
                        {t("auth.sentRequestInfo")}
                    </motion.p>
                )}

                <div className="pt-4 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                        {t("auth.backToLogin")}
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
